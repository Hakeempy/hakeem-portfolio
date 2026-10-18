"use client";

import { Row, Stage, StoryScene, Token, rowPath, useC } from "../StoryScene";

const DUR = 5;
const ARC = "M80 180 Q300 20 520 150";

/** Flight prices: a plane crosses its route; each fare it carries flows into the KPI pipeline. */
export function FlightScene() {
  const C = useC();
  return (
    <StoryScene label="Animation: a plane flies a route out of Bangladesh while fares flow through MySQL, Airflow and PostgreSQL to a Grafana dashboard">
      {(still) => (
        <>
          <Stage caption="57,000 fares, 24 airlines" />
          <path d={ARC} fill="none" stroke={C.line} strokeWidth="4" />
          <circle cx="80" cy="180" r="7" fill={C.ink} />
          <circle cx="520" cy="150" r="7" fill={C.ink} />
          <path d="M-12 -8 L14 0 L-12 8 L-7 0 Z" fill={C.gold} transform={still ? "translate(300 100)" : undefined}>
            {!still && <animateMotion path={ARC} dur={`${DUR}s`} rotate="auto" repeatCount="indefinite" />}
          </path>

          <Row
            steps={[
              { name: "MySQL", role: "staging", icon: "mysql" },
              { name: "Airflow", role: "validate, transform", icon: "airflow" },
              { name: "PostgreSQL", role: "5 KPI tables", icon: "postgresql" },
              { name: "Grafana", role: "dashboard", icon: "grafana" },
            ]}
          />
          {[0, 1, 2].map((i) => (
            <Token key={i} path={rowPath(520, 158, 4)} dur={DUR} begin={i * 1.66} still={still} gold={i === 0} />
          ))}
        </>
      )}
    </StoryScene>
  );
}
