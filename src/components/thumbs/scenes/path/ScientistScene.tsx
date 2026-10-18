"use client";

import { Row, Stage, StoryScene, Token, rowPath, showBetween, useC } from "../../StoryScene";

const DUR = 6;

/**
 * Data scientist: a question goes to a RAG chatbot; the matching documents light up in the
 * knowledge base and the answer arrives, grounded in them.
 */
export function ScientistScene() {
  const C = useC();
  return (
    <StoryScene label="Animation: a question to a RAG chatbot retrieves matching documents from a knowledge base and an answer is returned, with LangChain and Gemini">
      {(still) => (
        <>
          <Stage caption="a chatbot that answers from its own documents" />
          {/* The chat */}
          <g opacity={still ? 1 : 0}>
            {!still && <animate dur={`${DUR}s`} {...showBetween(0.03, 0.92)} />}
            <rect x="50" y="80" width="190" height="34" fill={C.paper} />
            <rect x="62" y="93" width="120" height="8" fill={C.paperLine} />
          </g>
          <g opacity={still ? 1 : 0}>
            {!still && <animate dur={`${DUR}s`} {...showBetween(0.6, 0.92)} />}
            <rect x="90" y="128" width="190" height="56" fill={C.gold} />
            {[0, 1, 2].map((l) => (
              <rect key={l} x="102" y={140 + l * 13} width={l === 2 ? 90 : 160} height="7" fill={C.goldInk} opacity="0.55" />
            ))}
          </g>
          {/* The knowledge base: documents, three of which match */}
          {Array.from({ length: 12 }, (_, i) => {
            const match = i === 2 || i === 7 || i === 9;
            return (
              <rect key={i} x={330 + (i % 4) * 56} y={80 + Math.floor(i / 4) * 38} width="44" height="30" fill={match && still ? C.ink : C.line}>
                {match && !still && (
                  <animate
                    attributeName="fill"
                    values={`${C.line};${C.line};${C.ink};${C.ink};${C.line}`}
                    keyTimes="0;0.25;0.3;0.9;1"
                    dur={`${DUR}s`}
                    repeatCount="indefinite"
                  />
                )}
              </rect>
            );
          })}
          {/* Retrieved passages travel to the answer */}
          {[0, 1].map((i) => (
            <Token key={i} path={`M${386 + i * 112} 114 L300 150 L285 150`} dur={DUR} begin={1.9 + i * 0.4} size={10} still={still} />
          ))}
          <Row
            steps={[
              { name: "LangChain", role: "RAG pipeline" },
              { name: "Vectors", role: "retrieval" },
              { name: "Gemini", role: "answers" },
            ]}
          />
          <Token path={rowPath(185, 184, 3)} dur={DUR} begin={3.8} still={still} gold />
        </>
      )}
    </StoryScene>
  );
}
