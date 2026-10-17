"use client";

import { C, Row, Stage, StoryScene, Token, rowPath } from "../StoryScene";

const DUR = 6;
// The app's own inputs. Each knob moves between three settings; the estimate follows.
const SLIDERS = [
  { label: "age", stops: [0.2, 0.7, 0.45] },
  { label: "BMI", stops: [0.35, 0.55, 0.8] },
  { label: "children", stops: [0, 0.5, 0.25] },
];
const SMOKER = [0, 1, 1];
const ESTIMATE = [0.3, 0.85, 0.65];

/** Insurance cost app: the sliders move and the model's estimate rises and falls with them. */
export function InsuranceScene() {
  const kt = "0;0.3;0.33;0.63;0.66;0.96;1";
  const hold = (v: number[]) => [v[0], v[0], v[1], v[1], v[2], v[2], v[0]].join(";");
  const TRACK_X = 130;
  const TRACK_W = 200;

  return (
    <StoryScene label="Animation: age, BMI, children and smoker inputs change and a trained regression model's cost estimate in a Streamlit app follows them">
      {(still) => (
        <>
          <Stage caption="health insurance cost" />
          {SLIDERS.map((s, i) => {
            const y = 92 + i * 30;
            const xs = s.stops.map((v) => TRACK_X + v * TRACK_W);
            return (
              <g key={s.label}>
                <text x="50" y={y + 5} fontSize="14" fill={C.muted}>
                  {s.label}
                </text>
                <rect x={TRACK_X} y={y - 3} width={TRACK_W} height="6" fill={C.line} />
                <circle cx={xs[0]} cy={y} r="9" fill={C.ink}>
                  {!still && <animate attributeName="cx" values={hold(xs)} keyTimes={kt} dur={`${DUR}s`} repeatCount="indefinite" />}
                </circle>
              </g>
            );
          })}
          <text x="50" y="187" fontSize="14" fill={C.muted}>
            smoker
          </text>
          <rect x={TRACK_X} y="174" width="44" height="20" fill={C.line} />
          <rect x={TRACK_X + 2} y="176" width="20" height="16" fill={C.ink}>
            {!still && <animate attributeName="x" values={hold(SMOKER.map((v) => TRACK_X + 2 + v * 20))} keyTimes={kt} dur={`${DUR}s`} repeatCount="indefinite" />}
          </rect>

          {/* The estimate */}
          <text x="390" y="88" fontSize="14" fill={C.muted}>
            estimated cost
          </text>
          <rect x="390" y="100" width="150" height="90" fill="#2b2621" />
          <rect x="390" y={190 - ESTIMATE[0] * 90} width="150" height={ESTIMATE[0] * 90} fill={C.gold}>
            {!still && (
              <>
                <animate attributeName="height" values={hold(ESTIMATE.map((v) => v * 90))} keyTimes={kt} dur={`${DUR}s`} repeatCount="indefinite" />
                <animate attributeName="y" values={hold(ESTIMATE.map((v) => 190 - v * 90))} keyTimes={kt} dur={`${DUR}s`} repeatCount="indefinite" />
              </>
            )}
          </rect>

          <Row
            steps={[
              { name: "scikit-learn", role: "regression model", icon: "sklearn" },
              { name: "Streamlit", role: "web app", icon: "streamlit" },
            ]}
          />
          {[0, 1].map((i) => (
            <Token key={i} path={rowPath(465, 190, 2)} dur={DUR / 2} begin={i * 3} still={still} gold={i === 1} />
          ))}
        </>
      )}
    </StoryScene>
  );
}
