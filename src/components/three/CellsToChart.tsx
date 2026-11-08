"use client";

/* Three.js matrices, colours and vectors are written in place every frame, by design, so the
   React compiler's immutability check does not apply to them in this file. */
/* eslint-disable react-hooks/immutability */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useTheme } from "@/components/theme/ThemeToggle";
import { PALETTES, type Palette } from "@/components/three/palettes";
import * as THREE from "three";

/*
 * Rows to a chart: what a student learns, in one move. A spreadsheet arrives in a mess, its cells
 * askew and scattered in depth. They straighten into a clean table, then lift out of the table and
 * stack into a bar chart, the tallest bar in gold. Point at a bar to pick it out; click to start
 * again with another sheet. Deterministic: every sheet comes from a seeded generator.
 */

const COLS = 8;
const ROWS = 7;
const N = COLS * ROWS;
const CELL_W = 0.9;
const CELL_H = 0.45;
const TABLE_Y = 2.7; // the middle of the clean table
const MAX_BAR = 13;
const LOOK = new THREE.Vector3(0, 2.75, 0);
const VIEW_DIR = new THREE.Vector3(0.38, 0.22, 1).normalize();
const FOV = 34;

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const ease = (x: number) => {
  const t = Math.min(Math.max(x, 0), 1);
  return t * t * (3 - 2 * t);
};

type Sheet = {
  messy: THREE.Vector3[];
  tilt: THREE.Quaternion[];
  table: THREE.Vector3[];
  chart: THREE.Vector3[];
  bar: number[];
  delayClean: number[];
  delayChart: number[];
  tallest: number;
  heights: number[];
};

/** One sheet: where each cell starts, where it sits in the table, and where it lands in the chart. */
function makeSheet(seed: number): Sheet {
  const rand = seeded(seed * 7919 + 13);

  // Bar heights that use every cell: weighted at random, at least two cells, at most MAX_BAR.
  const weights = Array.from({ length: COLS }, () => 0.3 + rand());
  const total = weights.reduce((a, b) => a + b, 0);
  const heights = weights.map((w) => Math.min(MAX_BAR, Math.max(2, Math.round((w / total) * N))));
  let diff = N - heights.reduce((a, b) => a + b, 0);
  while (diff !== 0) {
    const i = Math.floor(rand() * COLS);
    if (diff > 0 && heights[i] < MAX_BAR) {
      heights[i]++;
      diff--;
    } else if (diff < 0 && heights[i] > 2) {
      heights[i]--;
      diff++;
    }
  }
  const tallest = heights.indexOf(Math.max(...heights));

  // Each cell takes a random place in the chart, so the table is torn apart, not slid across.
  const slots: { b: number; level: number }[] = [];
  heights.forEach((h, b) => {
    for (let level = 0; level < h; level++) slots.push({ b, level });
  });
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }

  const sheet: Sheet = {
    messy: [],
    tilt: [],
    table: [],
    chart: [],
    bar: [],
    delayClean: [],
    delayChart: [],
    tallest,
    heights,
  };
  const euler = new THREE.Euler();
  for (let i = 0; i < N; i++) {
    const c = i % COLS;
    const r = Math.floor(i / COLS);
    const table = new THREE.Vector3((c - (COLS - 1) / 2) * CELL_W, TABLE_Y + ((ROWS - 1) / 2 - r) * CELL_H, 0);
    sheet.table.push(table);
    sheet.messy.push(
      table.clone().add(new THREE.Vector3((rand() - 0.5) * 1.8, (rand() - 0.5) * 1.2, (rand() - 0.5) * 3.2)),
    );
    euler.set((rand() - 0.5) * 1.1, (rand() - 0.5) * 1.1, (rand() - 0.5) * 0.9);
    sheet.tilt.push(new THREE.Quaternion().setFromEuler(euler));
    const { b, level } = slots[i];
    sheet.chart.push(new THREE.Vector3((b - (COLS - 1) / 2) * CELL_W, level * CELL_H + CELL_H / 2, 0));
    sheet.bar.push(b);
    sheet.delayClean.push(rand() * 0.6);
    sheet.delayChart.push(b * 0.07 + level * 0.025);
  }
  return sheet;
}

type Interaction = { active: boolean; reshuffle: number };

function Cells({
  still,
  io,
  palette,
}: {
  still: boolean;
  io: React.RefObject<Interaction>;
  palette: Palette;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { camera, pointer } = useThree();
  const first = useMemo(() => makeSheet(1), []);
  const sheet = useRef(first);
  const seen = useRef(0); // the last reshuffle count acted on
  const clock = useRef(still ? 99 : 0);
  const hover = useRef(new Float32Array(COLS));

  // Where each cell is now; it eases toward its target, so a reshuffle flows instead of jumping.
  const state = useMemo(
    () => ({
      pos: first.messy.map((v) => v.clone()),
      rot: first.tilt.map((q) => q.clone()),
      // Mid grey to start; each frame blends toward the theme's colours.
      col: Array.from({ length: N }, () => new THREE.Color(0.55, 0.53, 0.5)),
    }),
    [first],
  );

  const geometry = useMemo(() => new THREE.BoxGeometry(CELL_W - 0.06, CELL_H - 0.06, 0.14), []);
  const tmp = useMemo(
    () => ({
      target: new THREE.Vector3(),
      quat: new THREE.Quaternion(),
      identity: new THREE.Quaternion(),
      color: new THREE.Color(),
      matrix: new THREE.Matrix4(),
      scale: new THREE.Vector3(1, 1, 1),
      ndc: new THREE.Vector3(),
    }),
    [],
  );

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(delta, 0.05);

    if (io.current.reshuffle !== seen.current) {
      seen.current = io.current.reshuffle;
      sheet.current = makeSheet(seen.current + 1);
      clock.current = still ? 99 : 0;
    }
    const s = sheet.current;
    clock.current += dt;
    const t = clock.current;

    // The bar under the pointer, once the chart has formed.
    let pointed = -1;
    if (io.current.active && t > 3.8) {
      // Anywhere within half a bar's spacing of its centre counts as pointing at it.
      tmp.ndc.set(-CELL_W / 2, 0, 0).project(camera);
      const left = tmp.ndc.x;
      tmp.ndc.set(CELL_W / 2, 0, 0).project(camera);
      let best = Math.abs(tmp.ndc.x - left) / 2;
      for (let b = 0; b < COLS; b++) {
        tmp.ndc.set((b - (COLS - 1) / 2) * CELL_W, (s.heights[b] * CELL_H) / 2, 0).project(camera);
        const d = Math.abs(tmp.ndc.x - pointer.x);
        if (d < best) {
          best = d;
          pointed = b;
        }
      }
    }
    for (let b = 0; b < COLS; b++) {
      hover.current[b] += ((b === pointed ? 1 : 0) - hover.current[b]) * (1 - Math.exp(-dt * 10));
    }

    const follow = still ? 1 : 1 - Math.exp(-dt * 9);
    for (let i = 0; i < N; i++) {
      // Messy for a beat, clean table by about two seconds, held, then the chart builds.
      const clean = ease((t - 0.5 - s.delayClean[i]) / 1);
      const chart = ease((t - 2.8 - s.delayChart[i]) / 0.8);
      const b = s.bar[i];
      const lift = hover.current[b] * chart;

      tmp.target.copy(s.messy[i]).lerp(s.table[i], clean).lerp(s.chart[i], chart);
      tmp.target.z += lift * 0.45;
      state.pos[i].lerp(tmp.target, follow);

      tmp.quat.slerpQuaternions(s.tilt[i], tmp.identity, clean);
      state.rot[i].slerp(tmp.quat, follow);

      tmp.color.copy(palette.raw).lerp(palette.clean, clean);
      if (b === s.tallest) tmp.color.lerp(palette.gold, chart);
      tmp.color.lerp(palette.gold, lift * 0.75);
      state.col[i].lerp(tmp.color, follow);

      tmp.matrix.compose(state.pos[i], state.rot[i], tmp.scale);
      m.setMatrixAt(i, tmp.matrix);
      m.setColorAt(i, state.col[i]);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, N]} frustumCulled={false}>
      <meshStandardMaterial roughness={0.75} metalness={0} />
    </instancedMesh>
  );
}

/** Frames the table and the tallest possible chart for the box's shape; drifts toward the pointer. */
function Rig({ still }: { still: boolean }) {
  const { camera, pointer, size } = useThree();
  const distance = useMemo(() => {
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const aspect = size.width / size.height;
    return Math.max(7.6 / 2 / tan, 9.4 / 2 / (tan * aspect));
  }, [size.width, size.height]);
  const at = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const px = still ? 0 : pointer.x * 0.9;
    const py = still ? 0 : pointer.y * 0.5;
    at.copy(VIEW_DIR).multiplyScalar(distance).add(LOOK);
    at.x += px;
    at.y += py;
    camera.position.lerp(at, still ? 1 : 0.06);
    camera.lookAt(LOOK);
  });
  return null;
}

export function CellsToChart({ className = "" }: { className?: string }) {
  const still = useReducedMotion() ?? false;
  const palette = PALETTES[useTheme()];
  const [visible, setVisible] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);
  const io = useRef<Interaction>({ active: false, reshuffle: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (wrap.current) observer.observe(wrap.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      className={`cursor-pointer ${className}`}
      aria-hidden
      onPointerMove={() => (io.current.active = true)}
      onPointerLeave={() => (io.current.active = false)}
      onClick={() => io.current.reshuffle++}
    >
      <Canvas
        style={{ position: "absolute", inset: 0 }}
        camera={{ position: [3.5, 4.5, 16], fov: FOV }}
        dpr={[1, 2]}
        frameloop={!visible ? "demand" : "always"}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[5, 8, 10]} intensity={1.6} />
        <Cells still={still} io={io} palette={palette} />
        <Rig still={still} />
      </Canvas>
    </div>
  );
}
