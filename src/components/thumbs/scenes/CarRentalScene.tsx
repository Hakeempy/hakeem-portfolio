"use client";

import { Row, Stage, StoryScene, Token, rowPath, useC } from "../StoryScene";

const DUR = 5;
const LOTS = [
  { x: 50, cars: 4, revenue: 0.6 },
  { x: 182, cars: 3, revenue: 0.45 },
  { x: 314, cars: 5, revenue: 0.95 },
  { x: 446, cars: 2, revenue: 0.35 },
];

/** Car rentals: four locations; cars flash as they are rented and each lot's revenue bar fills. */
export function CarRentalScene() {
  const C = useC();
  return (
    <StoryScene label="Animation: cars are rented at four locations and the transactions flow through Spark on EMR Serverless and Glue crawlers into Athena">
      {(still) => (
        <>
          <Stage caption="rentals by location" />
          {LOTS.map((lot, l) => (
            <g key={lot.x}>
              <rect x={lot.x} y="80" width="104" height="70" fill={C.panel} />
              {Array.from({ length: lot.cars }, (_, c) => (
                <rect key={c} x={lot.x + 10 + (c % 3) * 32} y={92 + Math.floor(c / 3) * 28} width="22" height="16" fill={C.muted}>
                  {!still && (
                    <animate
                      attributeName="fill"
                      values={`${C.muted};${C.gold};${C.muted}`}
                      keyTimes="0;0.1;0.3"
                      dur={`${DUR}s`}
                      begin={`${(l * 1.3 + c * 0.7) % DUR}s`}
                      repeatCount="indefinite"
                    />
                  )}
                </rect>
              ))}
              <rect x={lot.x} y={196 - lot.revenue * 34} width="104" height={lot.revenue * 34} fill={l === 2 ? C.gold : C.line} />
            </g>
          ))}
          <Row
            steps={[
              { name: "S3", role: "raw CSV" },
              { name: "EMR", role: "2 Spark jobs", icon: "spark" },
              { name: "Glue", role: "3 crawlers" },
              { name: "Athena", role: "ad-hoc SQL" },
            ]}
          />
          {[0, 1, 2].map((i) => (
            <Token key={i} path={rowPath(366, 196, 4)} dur={DUR} begin={i * 1.66} still={still} gold={i === 2} />
          ))}
        </>
      )}
    </StoryScene>
  );
}
