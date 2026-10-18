"use client";

import { Row, Stage, StoryScene, Token, rowPath, showBetween, useC } from "../StoryScene";

const DUR = 6;
// Five cluster centres inside the stage, and fixed offsets for the points around them (no randomness).
const CENTRES = [
  [130, 100],
  [250, 165],
  [330, 95],
  [430, 160],
  [510, 100],
];
const OFFSETS = [
  [-18, -10], [14, -16], [20, 8], [-10, 16], [2, 2], [-24, 6],
];
// Where each point starts before it settles: spread across the stage.
const SPREAD = (i: number) => [60 + ((i * 97) % 480), 80 + ((i * 53) % 110)];

/** Machine learning: scattered customers settle into five k-means segments, centres in gold. */
export function MlScene() {
  const C = useC();
  const points = CENTRES.flatMap(([cx, cy], c) => OFFSETS.map(([dx, dy], k) => ({ c, x: cx + dx, y: cy + dy, i: c * 6 + k })));
  return (
    <StoryScene label="Animation: scattered points settle into five customer segments with their centres in gold, built with pandas and scikit-learn in Jupyter">
      {(still) => (
        <>
          <Stage caption="customer segments, k-means" />
          {points.map((p) => {
            const [sx, sy] = SPREAD(p.i);
            return (
              <circle key={p.i} cx={still ? p.x : sx} cy={still ? p.y : sy} r="6" fill={C.muted}>
                {!still && (
                  <>
                    <animate attributeName="cx" values={`${sx};${sx};${p.x};${p.x};${sx}`} keyTimes="0;0.1;0.45;0.9;1" calcMode="spline" keySplines="0 0 1 1;0.22 1 0.36 1;0 0 1 1;0.76 0 0.24 1" dur={`${DUR}s`} repeatCount="indefinite" />
                    <animate attributeName="cy" values={`${sy};${sy};${p.y};${p.y};${sy}`} keyTimes="0;0.1;0.45;0.9;1" calcMode="spline" keySplines="0 0 1 1;0.22 1 0.36 1;0 0 1 1;0.76 0 0.24 1" dur={`${DUR}s`} repeatCount="indefinite" />
                  </>
                )}
              </circle>
            );
          })}
          {CENTRES.map(([cx, cy], c) => (
            <rect key={c} x={cx - 8} y={cy - 8} width="16" height="16" fill={C.gold} opacity={still ? 1 : 0}>
              {!still && <animate dur={`${DUR}s`} {...showBetween(0.45, 0.88)} />}
            </rect>
          ))}
          <Row
            steps={[
              { name: "pandas", role: "prepare", icon: "pandas" },
              { name: "scikit-learn", role: "train, evaluate", icon: "sklearn" },
              { name: "Jupyter", role: "6 models", icon: "jupyter" },
            ]}
          />
          {[0, 1].map((i) => (
            <Token key={i} path={rowPath(430, 160, 3)} dur={DUR} begin={2.8 + i * 3} still={still} gold={i === 0} />
          ))}
        </>
      )}
    </StoryScene>
  );
}
