"use client";

import { Row, Stage, StoryScene, Token, rowPath, useC } from "../../StoryScene";

const DUR = 5;
const SITES = [60, 230, 400];

/**
 * Data engineer: sensors at three production sites report in; their readings flow through Kafka
 * and Dockerized microservices to the monitoring dashboards.
 */
export function EngineerScene() {
  const C = useC();
  return (
    <StoryScene label="Animation: sensors at three production sites send readings through Kafka and Dockerized microservices to Grafana monitoring">
      {(still) => (
        <>
          <Stage caption="IoT sensors across production sites" />
          {SITES.map((x, s) => (
            <g key={x}>
              <rect x={x} y="80" width="140" height="104" fill={C.panel} />
              {/* The building's roofline, as filled blocks */}
              <rect x={x + 14} y="128" width="40" height="44" fill={C.line} />
              <rect x={x + 62} y="112" width="30" height="60" fill={C.line} />
              <rect x={x + 100} y="140" width="26" height="32" fill={C.line} />
              {/* Sensors blink as they report */}
              {[0, 1, 2].map((k) => (
                <rect key={k} x={x + 24 + k * 38} y="96" width="10" height="10" fill={C.muted}>
                  {!still && (
                    <animate
                      attributeName="fill"
                      values={`${C.muted};${C.gold};${C.muted}`}
                      keyTimes="0;0.08;0.25"
                      dur={`${DUR / 2}s`}
                      begin={`${(s * 0.7 + k * 0.5) % (DUR / 2)}s`}
                      repeatCount="indefinite"
                    />
                  )}
                </rect>
              ))}
            </g>
          ))}
          <Row
            steps={[
              { name: "Kafka", role: "sensor events", icon: "kafka" },
              { name: "Docker", role: "microservices", icon: "docker" },
              { name: "Grafana", role: "monitoring", icon: "grafana" },
            ]}
          />
          {SITES.map((x, i) => (
            <Token key={x} path={rowPath(x + 70, 184, 3)} dur={DUR} begin={i * 1.66} still={still} gold={i === 1} />
          ))}
        </>
      )}
    </StoryScene>
  );
}
