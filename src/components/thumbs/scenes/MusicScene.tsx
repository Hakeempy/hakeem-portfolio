"use client";

import { Bars, Row, Stage, StoryScene, Token, rowPath } from "../StoryScene";

const DUR = 5;
const LEVELS = [0.45, 0.7, 0.55, 0.9, 0.6, 0.4, 0.75, 0.5, 0.85, 0.65, 0.35, 1, 0.55, 0.7, 0.45, 0.8, 0.5, 0.6];

/** Music streaming: an equalizer of listening activity; the top genre of the day is in gold. */
export function MusicScene() {
  return (
    <StoryScene label="Animation: an equalizer of streams by genre feeds files through Airflow and a Spark job into DynamoDB">
      {(still) => (
        <>
          <Stage caption="streams by genre" />
          <Bars x={62} base={196} values={LEVELS} width={20} gap={6.5} max={100} highlight={11} dur={2.4} still={still} ink="#4a433c" />
          <Row
            steps={[
              { name: "S3", role: "incoming files" },
              { name: "Airflow", role: "validate, branch", icon: "airflow" },
              { name: "Glue", role: "Spark KPIs", icon: "spark" },
              { name: "DynamoDB", role: "3 tables" },
            ]}
          />
          {[0, 1, 2].map((i) => (
            <Token key={i} path={rowPath(366, 196, 4)} dur={DUR} begin={i * 1.66} still={still} gold={i === 1} />
          ))}
        </>
      )}
    </StoryScene>
  );
}
