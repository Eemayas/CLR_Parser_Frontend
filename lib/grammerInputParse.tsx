/** @format */

// /** @format */

import { GrammarRule, GrammarStructure } from "@/types";

// import { GrammarStructure } from "@/types";

// export const parseGrammar = (input: string): GrammarStructure => {
//   const grammar: GrammarStructure = { grammar: [] }; // Initialize with the correct structure
//   const lines = input
//     .split("\n")
//     .map((line) => line.trim())
//     .filter(Boolean); // Remove empty lines after trimming

//   console.log(lines);

//   lines.forEach((rule) => {
//     const [lhs, rhs] = rule.split("->");
//     const rhsParts = rhs
//       .split("")
//       .map((part) => part.trim())
//       .filter((part) => part.length > 0);

//     grammar.grammar.push([lhs, rhsParts]); // Add the rule to the grammar structure
//   });

//   return grammar;
// };

export const parseGrammar = (input: string): GrammarStructure => {
  const grammar = [];
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    // Split line into left-hand side (non-terminal) and right-hand side (productions)
    const [lhs, rhs] = line.split("->").map((part) => part.trim());

    if (!lhs || !rhs) {
      throw new Error(`Invalid grammar rule: ${line}`);
    }

    // Validate non-terminal (updated to allow mixed case)
    if (!/^[A-Za-z]+$/.test(lhs)) {
      throw new Error(`Non-terminal must be alphanumeric: ${lhs}`);
    }

    // Split right-hand side into alternatives and handle spaces
    const productions = rhs.split("|").map((production) =>
      production
        .trim()
        .split(/\s+/) // Split by spaces to separate tokens
        .filter(Boolean)
    );

    grammar.push({
      nonTerminal: lhs,
      productions,
    });
  }
  let formatted_grammer: GrammarRule[] = [];

  grammar.map((entry) => {
    // console.log([entry["nonTerminal"], entry["productions"][0]]);
    formatted_grammer.push([entry["nonTerminal"], entry["productions"][0]]);
  });

  return { grammar: formatted_grammer };
};
