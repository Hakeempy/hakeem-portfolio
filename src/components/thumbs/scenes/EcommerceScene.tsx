"use client";

import { C, Row, Stage, StoryScene, Token, rowPath } from "../StoryScene";

const DUR = 5;

function Receipt({ x, y, highlight = false }: { x: number; y: number; highlight?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width="78" height="104" fill={C.ink} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={x + 10} y={y + 14 + i * 16} width={i === 3 ? 30 : 58} height="7" fill="#c9c4bd" />
      ))}
      <rect x={x + 10} y={y + 84} width="58" height="9" fill={highlight ? C.gold : "#8a847d"} />
    </g>
  );
}

/** E-commerce orders: order slips land one after another, and their KPIs flow to DynamoDB. */
export function EcommerceScene() {
  return (
    <StoryScene label="Animation: order slips arrive in S3 and flow through Step Functions and containers on ECS into DynamoDB">
      {(still) => (
        <>
          <Stage caption="orders, order items, products" />
          <Receipt x={70} y={84} />
          <Receipt x={170} y={84} />
          <g>
            <Receipt x={270} y={84} highlight />
            {!still && (
              <animateTransform
                attributeName="transform"
                type="translate"
                values="240 0;0 0;0 0"
                keyTimes="0;0.25;1"
                calcMode="spline"
                keySplines="0.22 1 0.36 1;0 0 1 1"
                dur={`${DUR}s`}
                repeatCount="indefinite"
              />
            )}
            {!still && <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur={`${DUR}s`} repeatCount="indefinite" />}
          </g>
          <Row
            steps={[
              { name: "S3", role: "landing" },
              { name: "Step Functions", role: "orchestrate" },
              { name: "ECS", role: "validate, transform", icon: "docker" },
              { name: "DynamoDB", role: "live KPIs" },
            ]}
          />
          {[0, 1, 2].map((i) => (
            <Token key={i} path={rowPath(309, 190, 4)} dur={DUR} begin={i * 1.66} still={still} gold={i === 0} />
          ))}
        </>
      )}
    </StoryScene>
  );
}
