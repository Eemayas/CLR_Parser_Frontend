/** @format */

import { GrammarStructure } from "@/types";

export const parseGrammar = (input: string): GrammarStructure => {
  const grammar: GrammarStructure = { grammar: [] }; // Initialize with the correct structure
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean); // Remove empty lines after trimming

  console.log(lines);

  lines.forEach((rule) => {
    const [lhs, rhs] = rule.split("->");
    const rhsParts = rhs
      .split("")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    grammar.grammar.push([lhs, rhsParts]); // Add the rule to the grammar structure
  });

  return grammar;
};
