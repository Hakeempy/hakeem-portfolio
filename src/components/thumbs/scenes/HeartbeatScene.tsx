"use client";

import { Bars, C, Row, Stage, StoryScene, Token, rowLayout, rowPath } from "../StoryScene";

// One ECG period, 120 units wide: flat, a small P wave, the QRS spike, a T wave, flat.
const BEAT = "l18 0 l8 -8 l8 8 l10 0 l5 10 l7 -70 l7 82 l5 -22 l12 0 l10 -14 l10 14 l20 0";
const DUR = 4;

/**
 * Heartbeat monitoring: a live ECG trace; each beat becomes a reading that goes through Kafka
 * and PostgreSQL to the Grafana panel. One reading in four is an outlier, in gold, as in the
 * project's generator (outliers outside 60 to 100 bpm).
 */
export function HeartbeatScene() {
  const trace = `M0 140 ${Array.from({ length: 8 }, () => BEAT).join(" ")}`;
  const grafana = rowLayout(3)[2];

  return (
    <StoryScene label="Animation: a heart-rate trace sends readings through Kafka and PostgreSQL into a Grafana dashboard">
      {(still) => (
        <>
          <Stage caption="customer heart rate, bpm" />
          <clipPath id="hb-screen">
            <rect x="30" y="40" width="540" height="170" />
          </clipPath>
          <g clipPath="url(#hb-screen)">
            <path d={trace} transform="translate(30 0)" fill="none" stroke={C.ink} strokeWidth="3" strokeLinejoin="round">
              {!still && (
                <animateTransform attributeName="transform" type="translate" from="30 0" to="-210 0" dur={`${DUR}s`} repeatCount="indefinite" />
              )}
            </path>
          </g>

          <Row
            steps={[
              { name: "Kafka", role: "heartbeats topic", icon: "kafka" },
              { name: "PostgreSQL", role: "readings", icon: "postgresql" },
              { name: "Grafana", role: "", icon: "grafana" },
            ]}
          />
          <Bars x={grafana.x + 16} base={346} values={[0.55, 0.7, 0.45, 0.62, 0.9, 0.5, 0.66]} max={36} ink={C.goldInk} still={still} />

          {[0, 1, 2, 3].map((i) => (
            <Token key={i} path={rowPath(545, 140, 3)} dur={DUR} begin={i} gold={i === 2} still={still} />
          ))}
        </>
      )}
    </StoryScene>
  );
}
