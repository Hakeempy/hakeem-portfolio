"use client";

import { StoryScene, useC } from "../StoryScene";

const DUR = "6s";
const ROUTE = "M70 300 L70 210 L190 210 L190 110 L300 110";

/**
 * Trip pipeline: a car drives from pickup to dropoff. Each end of the ride sends an event to
 * DynamoDB (RAW#START, then RAW#END); the two merge into one gold COMPLETED trip, and the day's
 * count goes from 4,999 to 5,000, as in the project's data for 25 May 2024.
 */
export function TripScene() {
  const C = useC();
  // Times as fractions of the 6 s loop.
  const fade = (on: number, off: number) => ({
    values: "0;0;1;1;0;0",
    keyTimes: `0;${on};${on + 0.04};${off};${off + 0.04};1`,
  });

  return (
    <StoryScene label="Animation: a car's pickup and dropoff events are matched in DynamoDB into one completed trip, and the day's trip count rises">
      {(still) => (
        <>
          {/* The city: blocks with streets between them */}
          {[0, 1, 2].flatMap((r) =>
            [0, 1, 2].map((c) => (
              <rect key={`${r}-${c}`} x={30 + c * 110 + 6} y={40 + r * 100 + 6} width="98" height="88" fill={C.block} />
            )),
          )}
          <path d={ROUTE} fill="none" stroke={C.line} strokeWidth="6" strokeLinejoin="round" />

          {/* Pickup and dropoff pins */}
          <circle cx="70" cy="300" r="9" fill={C.ink} />
          <circle cx="300" cy="110" r="9" fill={C.ink} />
          <text x="86" y="330" fontSize="14" fill={C.muted}>pickup</text>
          <text x="246" y="88" fontSize="14" fill={C.muted}>dropoff</text>

          {/* The car */}
          <rect x="-9" y="-9" width="18" height="18" fill={C.gold} transform={still ? "translate(300 110)" : undefined}>
            {!still && (
              <animateMotion path={ROUTE} dur={DUR} repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;0.08;0.5;1" calcMode="linear" />
            )}
          </rect>

          {/* DynamoDB */}
          <rect x="390" y="40" width="180" height="230" fill={C.block} />
          <text x="406" y="74" fontSize="20" fontWeight="500" fill={C.ink}>DynamoDB</text>
          <text x="406" y="96" fontSize="14" fill={C.muted}>TripData</text>

          {/* Two raw events arrive, then merge */}
          {[
            { label: "RAW#START", y: 120, on: 0.08, from: "70 300" },
            { label: "RAW#END", y: 168, on: 0.5, from: "300 110" },
          ].map((e) => (
            <g key={e.label} opacity={still ? 0 : 1}>
              <rect x="406" y={e.y} width="148" height="36" fill={C.line} />
              <text x="418" y={e.y + 24} fontSize="14" fill={C.ink}>{e.label}</text>
              {!still && (
                <>
                  <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" {...fade(e.on, 0.74)} />
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={`${Number(e.from.split(" ")[0]) - 480} ${Number(e.from.split(" ")[1]) - e.y - 18};0 0;0 0`}
                    keyTimes={`0;${e.on + 0.06};1`}
                    dur={DUR}
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.22 1 0.36 1;0 0 1 1"
                  />
                </>
              )}
            </g>
          ))}
          <g opacity={still ? 1 : 0}>
            <rect x="406" y="140" width="148" height="44" fill={C.gold} />
            <text x="418" y="168" fontSize="15" fontWeight="500" fill={C.goldInk}>COMPLETED</text>
            {!still && <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.76;0.8;0.96;1" />}
          </g>

          {/* The day's count */}
          <text x="390" y="320" fontSize="14" fill={C.muted}>trips on 25 May 2024</text>
          <text x="390" y="362" fontSize="40" fontWeight="500" fill={C.ink} opacity={still ? 0 : 1} className="tabular">
            4,999
            {!still && <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" values="1;1;0;0;1" keyTimes="0;0.8;0.82;0.98;1" />}
          </text>
          <text x="390" y="362" fontSize="40" fontWeight="500" fill={C.gold} opacity={still ? 1 : 0} className="tabular">
            5,000
            {!still && <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.8;0.82;0.98;1" />}
          </text>
        </>
      )}
    </StoryScene>
  );
}
