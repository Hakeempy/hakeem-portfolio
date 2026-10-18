"use client";

import { C, Row, Stage, StoryScene, Token, rowPath } from "../../StoryScene";

const DUR = 6;
const ROWS = 6;
const VALUES = [0.45, 0.7, 0.35, 0.9, 0.55, 0.65];

/** Analyst: a spreadsheet column is read cell by cell, and each cell becomes a bar of the chart. */
export function AnalystScene() {
  return (
    <StoryScene label="Animation: a spreadsheet column is read row by row and turned into a bar chart, with Excel, SQL and Power BI">
      {(still) => (
        <>
          <Stage caption="from a table to an answer" />
          {/* The sheet */}
          {Array.from({ length: ROWS }, (_, r) =>
            [0, 1, 2].map((c) => (
              <rect key={`${r}-${c}`} x={50 + c * 72} y={78 + r * 19} width="66" height="14" fill={c === 2 ? "#3a342e" : "#2b2621"} />
            )),
          )}
          {/* The reading cursor moves down the value column */}
          <rect x="194" y="78" width="66" height="14" fill={C.gold} opacity={still ? 0 : 1}>
            {!still && (
              <animate
                attributeName="y"
                values={Array.from({ length: ROWS }, (_, r) => 78 + r * 19).join(";")}
                calcMode="discrete"
                dur={`${DUR}s`}
                repeatCount="indefinite"
              />
            )}
          </rect>
          {/* The chart grows bar by bar as each cell is read */}
          {VALUES.map((v, i) => {
            const h = v * 100;
            const on = i / ROWS;
            return (
              <rect key={i} x={330 + i * 38} y={192 - h} width="28" height={h} fill={i === 3 ? C.gold : C.muted}>
                {!still && (
                  <>
                    <animate attributeName="height" values={`0;0;${h};${h};0`} keyTimes={`0;${on.toFixed(3)};${(on + 0.08).toFixed(3)};0.94;1`} dur={`${DUR}s`} repeatCount="indefinite" />
                    <animate attributeName="y" values={`192;192;${192 - h};${192 - h};192`} keyTimes={`0;${on.toFixed(3)};${(on + 0.08).toFixed(3)};0.94;1`} dur={`${DUR}s`} repeatCount="indefinite" />
                  </>
                )}
              </rect>
            );
          })}
          <Row
            steps={[
              { name: "Excel", role: "clean, explore" },
              { name: "SQL", role: "query" },
              { name: "Power BI", role: "dashboards" },
            ]}
          />
          {[0, 1].map((i) => (
            <Token key={i} path={rowPath(450, 192, 3)} dur={DUR} begin={i * 3} still={still} gold={i === 0} />
          ))}
        </>
      )}
    </StoryScene>
  );
}
