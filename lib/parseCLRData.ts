/** @format */

import { StateList } from "@/types";

export const parseCLRData = (states: StateList) => {
  const terminals = new Set<string>();
  const nonTerminals = new Set<string>();

  // Identify terminal and non-terminal symbols
  for (const state of Object.values(states)) {
    for (const symbol of Object.keys(state.transitions)) {
      if (/[A-Z]/.test(symbol)) {
        nonTerminals.add(symbol);
      } else {
        terminals.add(symbol);
      }
    }
  }

  // Create GOTO and ACTION tables
  const table = Object.entries(states).map(([stateName, stateData]) => {
    const goto: Record<string, string | null> = {};
    const action: Record<string, string | null> = {};

    for (const symbol of Array.from(terminals)) {
      action[symbol] = stateData.transitions[symbol] || null;
    }

    for (const symbol of Array.from(nonTerminals)) {
      goto[symbol] = stateData.transitions[symbol] || null;
    }

    return { stateName, goto, action };
  });

  return {
    table,
    terminals: Array.from(terminals),
    nonTerminals: Array.from(nonTerminals),
  };
};
