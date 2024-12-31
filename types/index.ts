/** @format */

export type TFirstAndFollow = {
  FIRST: {
    [key: string]: string[];
  };
  FOLLOW: {
    [key: string]: string[] | never[];
  };
};

export type GrammarRule = [string, string[]];

export interface GrammarStructure {
  grammar: GrammarRule[];
}

export interface TableData {
  stateName: string;
  goto: Record<string, string | null>;
  action: Record<string, string | null>;
}

export interface CLRParsingTableProps {
  table: TableData[];
  terminals: string[];
  nonTerminals: string[];
}

export default interface State {
  items: string[];
  transitions: { [key: string]: string };
}
export interface StateList {
  [key: string]: State;
}

export interface StateGraphProps {
  states: StateList;
}
