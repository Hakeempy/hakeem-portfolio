"use client";

import { Row, Stage, StoryScene, Token, rowPath, useC } from "../StoryScene";

const DUR = 6;
const STOCK = [0.8, 0.6, 0.9, 0.5, 0.7, 0.85];
const BASE = 196;
const MAX = 110;

/**
 * Inventory and orders: each order lowers one product's stock through a trigger; when the stock
 * drops below its reorder level it turns gold and lands on the restock list.
 */
export function InventoryScene() {
  const C = useC();
  const shrinking = 3;
  return (
    <StoryScene label="Animation: orders lower a product's stock level through a database trigger until it turns gold and is flagged for restock">
      {(still) => (
        <>
          <Stage caption="stock per product" />
          {STOCK.map((s, i) => {
            const h = s * MAX;
            const isShrinking = i === shrinking;
            const low = 0.22 * MAX;
            return (
              <rect
                key={i}
                x={80 + i * 75}
                y={isShrinking && still ? BASE - low : BASE - h}
                width="48"
                height={isShrinking && still ? low : h}
                fill={isShrinking && still ? C.gold : C.line}
              >
                {isShrinking && !still && (
                  <>
                    <animate attributeName="height" values={`${h};${h * 0.66};${h * 0.4};${low};${low};${h}`} keyTimes="0;0.2;0.4;0.6;0.95;1" dur={`${DUR}s`} repeatCount="indefinite" />
                    <animate attributeName="y" values={`${BASE - h};${BASE - h * 0.66};${BASE - h * 0.4};${BASE - low};${BASE - low};${BASE - h}`} keyTimes="0;0.2;0.4;0.6;0.95;1" dur={`${DUR}s`} repeatCount="indefinite" />
                    <animate attributeName="fill" values={`${C.line};${C.line};${C.gold};${C.gold};${C.line}`} keyTimes="0;0.58;0.6;0.95;1" dur={`${DUR}s`} repeatCount="indefinite" />
                  </>
                )}
              </rect>
            );
          })}
          {/* The reorder level, as a filled marker beside the shelf rather than a rule across it */}
          <rect x="62" y={BASE - 0.3 * MAX - 3} width="12" height="6" fill={C.gold} />

          <Row
            steps={[
              { name: "Orders", role: "INSERT", icon: "mysql" },
              { name: "Trigger", role: "update stock" },
              { name: "Inventory", role: "stock table" },
              { name: "Restock", role: "reorder list" },
            ]}
          />
          {[0, 1, 2].map((i) => (
            <Token key={i} path={rowPath(329, 196, 4)} dur={DUR} begin={i * 2} still={still} gold={i === 2} />
          ))}
        </>
      )}
    </StoryScene>
  );
}
