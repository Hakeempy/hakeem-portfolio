"use client";

import { C, Row, Stage, StoryScene, Token, rowLayout, rowPath } from "../StoryScene";

const DUR = 5;
const FRAME = 96;

/** TMDB with PySpark: a film strip runs past and splits into four partitions processed in parallel. */
export function TmdbSparkScene() {
  const ks = rowLayout(3)[2];
  return (
    <StoryScene label="Animation: a film strip of movies from the TMDB API is processed in parallel by PySpark into return-on-investment figures by genre">
      {(still) => (
        <>
          <Stage caption="movies from the TMDB API" />
          <clipPath id="tmdb-strip">
            <rect x="30" y="80" width="540" height="96" />
          </clipPath>
          <g clipPath="url(#tmdb-strip)">
            <g>
              <rect x="0" y="84" width="1200" height="88" fill="#2b2621" />
              {Array.from({ length: 12 }, (_, i) => (
                <g key={i}>
                  <rect x={10 + i * FRAME} y="98" width={FRAME - 20} height="60" fill={i % 4 === 1 ? C.gold : C.line} />
                  {[0, 1, 2, 3].map((h) => (
                    <g key={h}>
                      <rect x={14 + i * FRAME + h * 22} y="88" width="10" height="6" fill={C.block} />
                      <rect x={14 + i * FRAME + h * 22} y="162" width="10" height="6" fill={C.block} />
                    </g>
                  ))}
                </g>
              ))}
              {!still && (
                <animateTransform attributeName="transform" type="translate" from="0 0" to={`${-FRAME * 4} 0`} dur={`${DUR}s`} repeatCount="indefinite" />
              )}
            </g>
          </g>
          {/* Four partitions */}
          {[0, 1, 2, 3].map((p) => (
            <rect key={p} x={300 + p * 64} y="188" width="54" height="10" fill={p === 1 ? C.gold : C.line} />
          ))}

          <Row
            steps={[
              { name: "TMDB API", role: "movie data", icon: "tmdb" },
              { name: "PySpark", role: "4 partitions", icon: "spark" },
              { name: "KPIs", role: "ROI by genre" },
            ]}
          />
          {[0.9, 0.75, 0.6, 0.5].map((h, i) => (
            <rect key={i} x={ks.x + ks.w - 100 + i * 22} y={346 - h * 30} width="16" height={h * 30} fill={C.goldInk} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <Token key={i} path={rowPath(327 + i * 64, 198, 3)} dur={DUR} begin={i * 1.25} size={10} still={still} gold={i === 1} />
          ))}
        </>
      )}
    </StoryScene>
  );
}
