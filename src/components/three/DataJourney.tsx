"use client";

/* Three.js buffers and vectors are written in place every frame, by design, so the React
   compiler's immutability check does not apply to them in this file. */
/* eslint-disable react-hooks/immutability */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

/*
 * Raw to gold. Thousands of records travel one pipeline: a loose grey cloud at the source,
 * checked at the validate gate (a few are rejected and fall away), drawn into ordered lanes by
 * the transform gate, and settled into a gold block at the end: the served, gold-layer table.
 *
 * It answers the hand, quietly: records part around the cursor, the stage under it lights its
 * gate and name in gold, and a click sends a surge down the line. No text covers the stream.
 * Everything is deterministic: positions come from a seeded generator, never Math.random.
 */

const PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-10, 2, -5),
  new THREE.Vector3(-5.5, 1.1, -2),
  new THREE.Vector3(-1.2, 0.6, 0),
  new THREE.Vector3(2.8, 0.2, 0.6),
  new THREE.Vector3(6.6, 0.4, -0.4),
]);

// The gold block: a regular lattice, so the served records read as an ordered table.
const LATTICE = 12;
const SPACING = 0.15;

export const GATES = [
  { t: 0.22, label: "ingest" },
  { t: 0.44, label: "validate" },
  { t: 0.66, label: "transform" },
  { t: 0.9, label: "serve" },
];

/** Which stage a point on the line belongs to: the gate it is nearest to. */
function stageAt(t: number) {
  if (t < (GATES[0].t + GATES[1].t) / 2) return 0;
  if (t < (GATES[1].t + GATES[2].t) / 2) return 1;
  if (t < (GATES[2].t + GATES[3].t) / 2) return 2;
  return 3;
}

const RAW = new THREE.Color("#8f8a84");
const CLEAN = new THREE.Color("#f4f4f3");
const GOLD = new THREE.Color("#c9a45a");
const LANES = 8;
const REACH = 1.1; // how far the cursor parts the stream, in world units

type Interaction = {
  active: boolean;
  /** The stage under the cursor on the stream, or -1 */
  near: number;
  surge: number;
  /** Tells React which stage card to show; called only when the stage changes */
  onNear: (stage: number) => void;
};

// A small seeded generator so every visit draws the same field.
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

function Records({ count, still, io }: { count: number; still: boolean; io: React.RefObject<Interaction> }) {
  const points = useRef<THREE.Points>(null);
  const { camera, pointer } = useThree();

  const data = useMemo(() => {
    const rand = seeded(7);
    return Array.from({ length: count }, (_, i) => ({
      t0: rand(),
      speed: 0.035 + rand() * 0.02,
      radius: 0.6 + rand() * 2.6,
      angle: rand() * Math.PI * 2,
      lane: i % LANES,
      laneJitter: (rand() - 0.5) * 0.12,
      rejected: rand() < 0.05,
      slot: new THREE.Vector3(
        ((i % LATTICE) - (LATTICE - 1) / 2) * SPACING,
        ((Math.floor(i / LATTICE) % LATTICE) - (LATTICE - 1) / 2) * SPACING,
        ((Math.floor(i / (LATTICE * LATTICE)) % LATTICE) - (LATTICE - 1) / 2) * SPACING,
      ),
      wobble: rand() * Math.PI * 2,
    }));
  }, [count]);

  const buffers = useMemo(
    () => ({ positions: new Float32Array(count * 3), colors: new Float32Array(count * 3) }),
    [count],
  );

  const scratch = useMemo(
    () => ({
      frame: new THREE.Vector3(),
      tangent: new THREE.Vector3(),
      normal: new THREE.Vector3(),
      binormal: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      end: PATH.getPointAt(0.96),
      color: new THREE.Color(),
      ray: new THREE.Raycaster(),
      p: new THREE.Vector3(),
      closest: new THREE.Vector3(),
      away: new THREE.Vector3(),
      clock: 18,
    }),
    [],
  );

  const place = (time: number, probe: boolean) => {
    const { positions, colors } = buffers;
    const s = scratch;
    const ray = s.ray.ray;
    if (probe) s.ray.setFromCamera(pointer, camera);

    let nearestD = REACH;
    let nearestT = -1;

    for (let i = 0; i < count; i++) {
      const d = data[i];
      const t = (d.t0 + time * d.speed) % 1;
      const u = Math.min(t, 0.999);

      PATH.getPointAt(u, s.frame);
      PATH.getTangentAt(u, s.tangent);
      s.normal.crossVectors(s.tangent, s.up).normalize();
      s.binormal.crossVectors(s.normal, s.tangent).normalize();

      // Before validation: a loose cloud. After transform: tight, ordered lanes.
      const order = smooth(GATES[1].t, GATES[2].t, t);
      const spread = THREE.MathUtils.lerp(d.radius, 0.55, smooth(GATES[0].t - 0.1, GATES[2].t, t));
      const laneAngle = (d.lane / LANES) * Math.PI * 2;
      const angle = THREE.MathUtils.lerp(d.angle + time * 0.15 + Math.sin(time + d.wobble) * 0.3, laneAngle, order);
      const r = spread + d.laneJitter * order;
      const c = Math.cos(angle) * r;
      const sn = Math.sin(angle) * r;
      s.p.set(
        s.frame.x + s.normal.x * c + s.binormal.x * sn,
        s.frame.y + s.normal.y * c + s.binormal.y * sn,
        s.frame.z + s.normal.z * c + s.binormal.z * sn,
      );

      // Rejected records fall out of the stream after the validate gate.
      const fallen = d.rejected && t > GATES[1].t;
      if (fallen) {
        const fall = (t - GATES[1].t) * 14;
        s.p.y -= fall * fall * 0.6;
      }

      // At the end, records settle into the gold block.
      const settle = d.rejected ? 0 : smooth(GATES[3].t - 0.06, 0.97, t);
      s.p.x = THREE.MathUtils.lerp(s.p.x, s.end.x + d.slot.x, settle);
      s.p.y = THREE.MathUtils.lerp(s.p.y, s.end.y + d.slot.y, settle);
      s.p.z = THREE.MathUtils.lerp(s.p.z, s.end.z + d.slot.z, settle);

      if (fallen) s.color.copy(RAW).multiplyScalar(0.55);
      else s.color.copy(RAW).lerp(CLEAN, smooth(GATES[1].t - 0.05, GATES[1].t + 0.05, t)).lerp(GOLD, settle);

      // The cursor parts the stream, and the records it touches brighten.
      if (probe) {
        ray.closestPointToPoint(s.p, s.closest);
        const dist = s.closest.distanceTo(s.p);
        if (dist < REACH) {
          const k = 1 - dist / REACH;
          s.away.subVectors(s.p, s.closest).normalize().multiplyScalar(k * k * 0.7);
          s.p.add(s.away);
          s.color.lerp(CLEAN, k * 0.6);
        }
        if (dist < nearestD && !fallen) {
          nearestD = dist;
          nearestT = t;
        }
      }

      positions[i * 3] = s.p.x;
      positions[i * 3 + 1] = s.p.y;
      positions[i * 3 + 2] = s.p.z;
      colors[i * 3] = s.color.r;
      colors[i * 3 + 1] = s.color.g;
      colors[i * 3 + 2] = s.color.b;
    }

    const geometry = points.current?.geometry;
    if (geometry) {
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
    }

    // The stage under the cursor lights its gate and name. React hears about it only when the
    // stage changes, not on every frame.
    const io_ = io.current;
    if (probe && io_) {
      const near = nearestT < 0 ? -1 : stageAt(nearestT);
      if (near !== io_.near) {
        io_.near = near;
        io_.onNear(near);
      }
    }
  };

  // The still frame for reduced motion, and the first frame before the loop starts.
  useEffect(() => {
    place(scratch.clock, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useFrame((_, delta) => {
    const io_ = io.current;
    if (!io_) return;
    io_.surge = Math.max(0, io_.surge - delta * 0.7);
    if (!still) scratch.clock += Math.min(delta, 0.05) * (1 + io_.surge * 6);
    place(scratch.clock, io_.active);
  });

  return (
    <>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[buffers.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[buffers.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors sizeAttenuation />
      </points>
    </>
  );
}

/** The served table: a standing lattice of gold records the stream settles into, turning slowly. */
function GoldBlock({ still, io }: { still: boolean; io: React.RefObject<Interaction> }) {
  const group = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    const n = 9;
    const step = (LATTICE * SPACING) / n;
    const out = new Float32Array(n * n * n * 3);
    let k = 0;
    for (let x = 0; x < n; x++)
      for (let y = 0; y < n; y++)
        for (let z = 0; z < n; z++) {
          out[k++] = (x - (n - 1) / 2) * step;
          out[k++] = (y - (n - 1) / 2) * step;
          out[k++] = (z - (n - 1) / 2) * step;
        }
    return out;
  }, []);
  const end = useMemo(() => PATH.getPointAt(0.96), []);
  useFrame(({ clock }, delta) => {
    if (!group.current || still) return;
    const served = io.current?.near === 3;
    group.current.rotation.y += delta * (0.12 + (served ? 0.5 : 0));
    // A gentle breath, deeper while a surge arrives.
    const surge = io.current?.surge ?? 0;
    group.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 1.2) * 0.02 + surge * 0.08);
  });
  return (
    <group ref={group} position={end} rotation={[0.35, 0.6, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.075} color="#c9a45a" sizeAttenuation />
      </points>
    </group>
  );
}

/** The first three stage gates: square frames standing across the stream. They light when hovered. */
function Gates({ io }: { io: React.RefObject<Interaction> }) {
  const materials = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const dim = useMemo(() => new THREE.Color("#4a433c"), []);
  const lit = useMemo(() => new THREE.Color("#c9a45a"), []);
  useFrame(() => {
    materials.current.forEach((m, k) => {
      if (!m) return;
      const gate = Math.floor(k / 4);
      const on = io.current?.near === gate;
      m.color.lerp(on ? lit : dim, 0.15);
    });
  });
  return (
    <>
      {GATES.slice(0, 3).map((gate, g) => {
        const position = PATH.getPointAt(gate.t);
        const tangent = PATH.getTangentAt(gate.t);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
        const size = gate.t < 0.3 ? 4.6 : gate.t < 0.6 ? 3.4 : 2.2;
        const bar = 0.05;
        return (
          <group key={gate.label} position={position} quaternion={quaternion}>
            {[
              [0, size / 2, size, bar],
              [0, -size / 2, size, bar],
              [size / 2, 0, bar, size],
              [-size / 2, 0, bar, size],
            ].map(([x, y, w, h], i) => (
              <mesh key={i} position={[x, y, 0]}>
                <boxGeometry args={[w, h, bar]} />
                <meshBasicMaterial
                  ref={(m) => {
                    materials.current[g * 4 + i] = m;
                  }}
                  color="#4a433c"
                />
              </mesh>
            ))}
          </group>
        );
      })}
    </>
  );
}

/** Keeps each HTML stage label pinned to its gate as the camera moves. */
function Labels({ refs }: { refs: React.RefObject<(HTMLElement | null)[]> }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    GATES.forEach((gate, i) => {
      const el = refs.current?.[i];
      if (!el) return;
      PATH.getPointAt(gate.t, v);
      v.y += i === 3 ? 1.4 : gate.t < 0.4 ? 2.9 : gate.t < 0.6 ? 2 : 1.3;
      v.project(camera);
      // Labels stay clear of the navigation bar at the top.
      const top = Math.max(((1 - v.y) / 2) * size.height, 110);
      el.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${top}px) translate(-50%, -100%)`;
    });
  });
  return null;
}

// The points that must stay in frame: the corners of the first (largest) gate and of the gold block.
const FRAME_POINTS = (() => {
  const out: THREE.Vector3[] = [];
  const gate = GATES[0];
  const at = PATH.getPointAt(gate.t);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), PATH.getTangentAt(gate.t));
  const half = 4.6 / 2;
  for (const [x, y] of [[-half, -half], [-half, half], [half, -half], [half, half]])
    out.push(new THREE.Vector3(x, y, 0).applyQuaternion(q).add(at));
  const end = PATH.getPointAt(0.96);
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1])
    out.push(new THREE.Vector3(x, y, z).multiplyScalar(1.1).add(end));
  return out;
})();

const CAMERA_AT = new THREE.Vector3(-2, 1.6, 0);
const LOOK_AT = new THREE.Vector3(-0.2, 0.4, 0);

/**
 * The nearest camera distance at which every frame point fits on screen, inside the band above
 * the headline. Found by bisection for the window's shape, so no stage is ever cut off.
 */
// On tall screens the camera looks a little lower, which lifts the stream toward the middle.
const lookY = (aspect: number) => LOOK_AT.y - (aspect < 1 ? (1 - aspect) * 2.4 : 0);

function fitDistance(aspect: number) {
  const cam = new THREE.PerspectiveCamera(38, aspect, 0.1, 200);
  const v = new THREE.Vector3();
  const fits = (z: number) => {
    cam.position.set(CAMERA_AT.x, CAMERA_AT.y, z);
    cam.lookAt(LOOK_AT.x, lookY(aspect), LOOK_AT.z);
    cam.updateMatrixWorld();
    return FRAME_POINTS.every((p) => {
      v.copy(p).project(cam);
      return Math.abs(v.x) <= 0.94 && v.y <= 0.72 && v.y >= -0.3;
    });
  };
  let lo = 6;
  let hi = 60;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (fits(mid)) hi = mid;
    else lo = mid;
  }
  return hi;
}

/** The camera drifts toward the pointer and travels a little way down the line as the page scrolls. */
function Rig({ still }: { still: boolean }) {
  const { camera, pointer, size, scene } = useThree();
  const scroll = useRef(0);
  const distance = useMemo(() => fitDistance(size.width / size.height), [size.width, size.height]);

  useEffect(() => {
    const onScroll = () => {
      scroll.current = Math.min(window.scrollY / window.innerHeight, 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame(() => {
    const s = scroll.current;
    const px = still ? 0 : pointer.x * 0.5;
    const py = still ? 0 : pointer.y * 0.25;
    camera.position.x += (CAMERA_AT.x + s * 4 + px - camera.position.x) * 0.05;
    camera.position.y += (CAMERA_AT.y - s * 0.8 + py - camera.position.y) * 0.05;
    camera.position.z += (distance - s * 3 - camera.position.z) * 0.05;
    camera.lookAt(LOOK_AT.x + s * 3, lookY(size.width / size.height), LOOK_AT.z);
    // Depth fog that travels with the camera: the near stream is crisp, the far end recedes.
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = camera.position.z - 2;
      scene.fog.far = camera.position.z + 16;
    }
  });
  return null;
}

export function DataJourney({ className = "" }: { className?: string }) {
  const still = useReducedMotion() ?? false;
  // Fewer records on small screens. Read once on the client; the canvas never renders on the server.
  const [count] = useState(() => (typeof window !== "undefined" && window.innerWidth < 768 ? 1600 : 4200));
  const [visible, setVisible] = useState(true);
  const [near, setNear] = useState(-1);
  const wrap = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const io = useRef<Interaction>({ active: false, near: -1, surge: 0, onNear: () => {} });

  useEffect(() => {
    io.current.onNear = setNear;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (wrap.current) observer.observe(wrap.current);
    return () => observer.disconnect();
  }, []);


  return (
    <div
      ref={wrap}
      className={className}
      aria-hidden
      onPointerMove={() => (io.current.active = true)}
      onPointerLeave={() => {
        io.current.active = false;
        io.current.near = -1;
        setNear(-1);
      }}
      onClick={() => (io.current.surge = 1)}
    >
      <Canvas
        camera={{ position: [-2, 1.6, 11.5], fov: 38 }}
        dpr={[1, 2]}
        frameloop={still || !visible ? "demand" : "always"}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={["#0c0a08", 10, 26]} />
        <Records count={count} still={still} io={io} />
        <GoldBlock still={still} io={io} />
        <Gates io={io} />
        <Rig still={still} />
        <Labels refs={labels} />
      </Canvas>

      {GATES.map((g, i) => (
        <span
          key={g.label}
          ref={(el) => {
            labels.current[i] = el;
          }}
          className={`pointer-events-none absolute top-0 left-0 py-2 text-small transition-colors duration-300 ${
            i === 3 || near === i ? "text-accent" : "text-muted"
          }`}
        >
          {g.label}
        </span>
      ))}
    </div>
  );
}
