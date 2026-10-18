"use client";

import { Row, Stage, StoryScene, Token, rowPath, useC } from "../StoryScene";

const DUR = 6;
// Five films whose bars re-rank: [length, row before, row after]. The gold one rises to the top.
const FILMS: [number, number, number][] = [
  [0.55, 0, 2],
  [0.95, 3, 0],
  [0.7, 1, 1],
  [0.4, 2, 4],
  [0.5, 4, 3],
];

/** TMDB with pandas: films re-rank by revenue as the data is cleaned and enriched. */
export function TmdbPandasScene() {
  const C = useC();
  const y = (row: number) => 80 + row * 24;
  return (
    <StoryScene label="Animation: films are re-ranked by revenue as TMDB data is cleaned with pandas and analysed in Jupyter">
      {(still) => (
        <>
          <Stage caption="films ranked by revenue" />
          {FILMS.map(([len, before, after], i) => (
            <rect key={i} x="60" y={still ? y(after) : y(before)} width={len * 440} height="16" fill={i === 1 ? C.gold : C.line}>
              {!still && (
                <animate
                  attributeName="y"
                  values={`${y(before)};${y(before)};${y(after)};${y(after)};${y(before)}`}
                  keyTimes="0;0.2;0.45;0.9;1"
                  calcMode="spline"
                  keySplines="0 0 1 1;0.76 0 0.24 1;0 0 1 1;0.76 0 0.24 1"
                  dur={`${DUR}s`}
                  repeatCount="indefinite"
                />
              )}
            </rect>
          ))}
          <Row
            steps={[
              { name: "TMDB API", role: "fetch", icon: "tmdb" },
              { name: "pandas", role: "clean, enrich", icon: "pandas" },
              { name: "Jupyter", role: "KPIs and charts", icon: "jupyter" },
            ]}
          />
          {[0, 1, 2].map((i) => (
            <Token key={i} path={rowPath(500, 112, 3)} dur={DUR} begin={i * 2} still={still} gold={i === 0} />
          ))}
        </>
      )}
    </StoryScene>
  );
}
