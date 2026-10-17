"use client";

import { C, Row, Stage, StoryScene, Token, rowPath } from "../StoryScene";

const DUR = 5;
const ZONES = [
  { x: 50, label: "raw" },
  { x: 225, label: "preprocessed" },
  { x: 400, label: "warehouse" },
];

/**
 * Lakehouse: an Excel workbook lands in the raw zone, becomes one CSV per sheet, and ends as a
 * Delta Lake table in the warehouse, in gold; bad rows peel off into the rejected zone.
 */
export function LakehouseScene() {
  const main = `M110 130 L285 130 L460 130${rowPath(460, 130, 4).replace(/^M[^L]*/, " ")}`;

  return (
    <StoryScene label="Animation: Excel and CSV files move from the raw zone to a Delta Lake warehouse table, rejected rows split off, and the data flows on to Athena">
      {(still) => (
        <>
          <Stage />
          {ZONES.map((z) => (
            <g key={z.label}>
              <rect x={z.x} y="56" width="150" height="138" fill="#2b2621" />
              <text x={z.x + 12} y="184" fontSize="14" fill={C.muted}>
                {z.label}
              </text>
            </g>
          ))}

          {/* Raw: a workbook with three sheet tabs */}
          <rect x="88" y="78" width="44" height="56" fill={C.ink} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={88 + i * 15} y="136" width="13" height="7" fill={C.muted} />
          ))}
          <text x="96" y="112" fontSize="13" fontWeight="500" fill={C.goldInk}>
            XLSX
          </text>

          {/* Preprocessed: one CSV per sheet */}
          {[0, 1].map((i) => (
            <g key={i}>
              <rect x={250 + i * 52} y="80" width="40" height="52" fill={C.ink} />
              <text x={255 + i * 52} y="111" fontSize="12" fontWeight="500" fill={C.goldInk}>
                CSV
              </text>
            </g>
          ))}
          <text x="300" y="160" fontSize="13" fill={C.muted}>
            rejected
          </text>
          <rect x="358" y="150" width="12" height="12" fill={C.line} />

          {/* Warehouse: a Delta table */}
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="420" y={76 + i * 18} width="110" height="12" fill={i === 0 ? C.gold : "#4a433c"} />
          ))}

          <Row
            steps={[
              { name: "S3", role: "raw zone" },
              { name: "Glue", role: "3 jobs in parallel" },
              { name: "Delta Lake", role: "ACID tables" },
              { name: "Athena", role: "SQL" },
            ]}
          />

          {[0, 1, 2].map((i) => (
            <Token key={i} path={main} dur={DUR} begin={i * 1.6} still={still} gold={i === 1} />
          ))}
          <Token path="M285 130 L285 156 L364 156" dur={DUR / 2} begin={0.8} size={10} still={still} />
        </>
      )}
    </StoryScene>
  );
}
