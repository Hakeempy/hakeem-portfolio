"use client";

import { Row, Stage, StoryScene, Token, rowPath, showBetween, useC } from "../StoryScene";

const DUR = 6;
const CELLS = [70, 230, 390];

/** Data analysis notebooks: three cells run in turn, and each draws its chart when it runs. */
export function AnalysisScene() {
  const C = useC();
  const show = (i: number) => showBetween(0.08 + i * 0.25, 0.92);
  return (
    <StoryScene label="Animation: three notebook cells run one after another, each drawing a chart, with Python, SQL and Jupyter">
      {(still) => (
        <>
          <Stage caption="notebooks on public datasets" />
          {CELLS.map((x, i) => (
            <g key={x}>
              <rect x={x} y="80" width="140" height="112" fill={C.panel} />
              {/* The run marker */}
              <rect x={x} y="80" width="140" height="8" fill={C.line} />
              <rect x={x} y="80" width="140" height="8" fill={C.gold} opacity={still ? 1 : 0}>
                {!still && <animate dur={`${DUR}s`} {...showBetween(0.02 + i * 0.25, 0.08 + i * 0.25)} />}
              </rect>
              <g opacity={still ? 1 : 0}>
                {!still && <animate dur={`${DUR}s`} {...show(i)} />}
                {i === 0 &&
                  [0.5, 0.8, 0.35, 0.95, 0.6, 0.7].map((h, b) => (
                    <rect key={b} x={x + 14 + b * 20} y={180 - h * 70} width="14" height={h * 70} fill={b === 3 ? C.gold : C.muted} />
                  ))}
                {i === 1 && (
                  <path d={`M${x + 12} 170 L${x + 40} 150 L${x + 66} 158 L${x + 92} 120 L${x + 128} 104`} fill="none" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
                )}
                {i === 2 &&
                  [[20, 60], [40, 40], [55, 70], [75, 35], [95, 55], [110, 30], [30, 80], [85, 75]].map(([dx, dy], d) => (
                    <circle key={d} cx={x + dx + 6} cy={100 + dy} r="5" fill={d === 5 ? C.gold : C.muted} />
                  ))}
              </g>
            </g>
          ))}
          <Row
            steps={[
              { name: "Python", role: "pandas, seaborn", icon: "python" },
              { name: "SQL", role: "queries" },
              { name: "Jupyter", role: "findings", icon: "jupyter" },
            ]}
          />
          {[0, 1, 2].map((i) => (
            <Token key={i} path={rowPath(CELLS[i] + 70, 192, 3)} dur={DUR} begin={(0.1 + i * 0.25) * DUR} still={still} gold={i === 2} />
          ))}
        </>
      )}
    </StoryScene>
  );
}
