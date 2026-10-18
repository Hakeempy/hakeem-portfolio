"use client";

import { Row, Stage, StoryScene, Token, rowPath, showBetween, useC } from "../StoryScene";

const DUR = 6;
const R = 42;
const CIRC = 2 * Math.PI * R;

/** Spark streaming: a 15-second timer fills, and each time a new CSV batch appears on the shelf. */
export function SparkStreamingScene() {
  const C = useC();
  return (
    <StoryScene label="Animation: a timer fills every 15 seconds as new CSV batches arrive and Spark Structured Streaming writes them to PostgreSQL">
      {(still) => (
        <>
          <Stage caption="a new batch every 15 seconds" />
          <circle cx="110" cy="138" r={R} fill="none" stroke={C.line} strokeWidth="8" />
          <circle
            cx="110"
            cy="138"
            r={R}
            fill="none"
            stroke={C.gold}
            strokeWidth="8"
            strokeDasharray={CIRC}
            strokeDashoffset={still ? 0 : CIRC}
            transform="rotate(-90 110 138)"
          >
            {!still && <animate attributeName="stroke-dashoffset" values={`${CIRC};0`} dur={`${DUR * 0.22}s`} repeatCount="indefinite" />}
          </circle>
          <text x="110" y="145" fontSize="20" fontWeight="500" fill={C.ink} textAnchor="middle">
            15 s
          </text>

          {/* The batches, one more each turn of the timer */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i} opacity={still ? 1 : 0}>
              <rect x={210 + i * 86} y="96" width="62" height="80" fill={C.paper} />
              <text x={222 + i * 86} y="141" fontSize="13" fontWeight="500" fill={C.paperInk}>
                CSV
              </text>
              {!still && <animate dur={`${DUR}s`} {...showBetween(0.05 + i * 0.22, 0.94)} />}
            </g>
          ))}

          <Row
            steps={[
              { name: "Generator", role: "CSV files", icon: "python" },
              { name: "Spark", role: "Structured Streaming", icon: "spark" },
              { name: "PostgreSQL", role: "events table", icon: "postgresql" },
            ]}
          />
          {[0, 1, 2, 3].map((i) => (
            <Token key={i} path={rowPath(241 + i * 86, 176, 3)} dur={DUR} begin={(0.05 + i * 0.22) * DUR} still={still} gold={i === 3} />
          ))}
        </>
      )}
    </StoryScene>
  );
}
