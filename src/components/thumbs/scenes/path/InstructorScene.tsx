"use client";

import { C, Row, Stage, StoryScene, Token, rowPath } from "../../StoryScene";

const DUR = 6;
const LESSON = "M70 170 L120 150 L170 158 L220 120 L270 104";
const LENGTH = 230;

/**
 * Instructor and consultant: a chart is drawn on the board, and one by one the learners in the
 * room light up as it lands.
 */
export function InstructorScene() {
  const seats = Array.from({ length: 24 }, (_, i) => ({ x: 350 + (i % 6) * 34, y: 92 + Math.floor(i / 6) * 28, i }));
  return (
    <StoryScene label="Animation: a chart is drawn on a board while learners in a room light up one by one, from Excel and SQL to Python">
      {(still) => (
        <>
          <Stage caption="100+ students and professionals" />
          {/* The board */}
          <rect x="50" y="78" width="250" height="116" fill="#2b2621" />
          <path
            d={LESSON}
            fill="none"
            stroke={C.ink}
            strokeWidth="4"
            strokeLinejoin="round"
            strokeDasharray={LENGTH}
            strokeDashoffset={still ? 0 : LENGTH}
          >
            {!still && <animate attributeName="stroke-dashoffset" values={`${LENGTH};0;0;${LENGTH}`} keyTimes="0;0.4;0.9;1" dur={`${DUR}s`} repeatCount="indefinite" />}
          </path>
          {/* The room */}
          {seats.map((s) => {
            const on = 0.35 + (s.i / seats.length) * 0.5;
            return (
              <rect key={s.i} x={s.x} y={s.y} width="20" height="16" fill={still ? (s.i % 5 === 0 ? C.gold : C.ink) : C.line}>
                {!still && (
                  <animate
                    attributeName="fill"
                    values={`${C.line};${C.line};${s.i % 5 === 0 ? C.gold : C.ink};${s.i % 5 === 0 ? C.gold : C.ink};${C.line}`}
                    keyTimes={`0;${on.toFixed(3)};${(on + 0.04).toFixed(3)};0.94;1`}
                    dur={`${DUR}s`}
                    repeatCount="indefinite"
                  />
                )}
              </rect>
            );
          })}
          <Row
            steps={[
              { name: "Excel", role: "first steps" },
              { name: "SQL", role: "querying" },
              { name: "Python", role: "analysis", icon: "python" },
              { name: "Learners", role: "100+ taught" },
            ]}
          />
          {[0, 1].map((i) => (
            <Token key={i} path={rowPath(270, 104, 4)} dur={DUR} begin={2.4 + i * 3} still={still} gold={i === 0} />
          ))}
        </>
      )}
    </StoryScene>
  );
}
