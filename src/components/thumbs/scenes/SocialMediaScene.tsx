"use client";

import { Row, Stage, StoryScene, Token, rowPath, showBetween, useC } from "../StoryScene";

const DUR = 6;
const LINE = "M60 178 L120 170 L180 174 L240 160 L300 150 L360 152 L420 128 L480 112 L540 96";
const LENGTH = 520;

/** Social media dashboard: engagement climbs across the chart and the +20% lift appears in gold. */
export function SocialMediaScene() {
  const C = useC();
  return (
    <StoryScene label="Animation: an engagement line climbs across a Power BI chart and a 20 percent lift in user interaction appears">
      {(still) => (
        <>
          <Stage caption="user interaction" />
          <path
            d={LINE}
            fill="none"
            stroke={C.ink}
            strokeWidth="4"
            strokeLinejoin="round"
            strokeDasharray={LENGTH}
            strokeDashoffset={still ? 0 : LENGTH}
          >
            {!still && (
              <animate attributeName="stroke-dashoffset" values={`${LENGTH};0;0;${LENGTH}`} keyTimes="0;0.5;0.92;1" dur={`${DUR}s`} repeatCount="indefinite" />
            )}
          </path>
          <g opacity={still ? 1 : 0}>
            {!still && <animate dur={`${DUR}s`} {...showBetween(0.5, 0.9)} />}
            <rect x="440" y="58" width="110" height="34" fill={C.gold} />
            <text x="454" y="82" fontSize="20" fontWeight="500" fill={C.goldInk}>
              +20%
            </text>
          </g>
          <Row
            steps={[
              { name: "Power Query", role: "clean" },
              { name: "DAX", role: "measures" },
              { name: "Power BI", role: "dashboard" },
            ]}
          />
          {[0, 1].map((i) => (
            <Token key={i} path={rowPath(540, 96, 3)} dur={DUR} begin={3 + i * 3} still={still} gold={i === 0} />
          ))}
        </>
      )}
    </StoryScene>
  );
}
