/** @format */

export default interface State {
  items: string[];
  transitions: { [key: string]: string };
}
export interface StateList {
  [key: string]: State;
}

export const states: { [key: string]: State } = {
  I0: {
    items: ["S'->.S,$", "S->.AA,$", "A->.aA,a|b", "A->.b,a|b"],
    transitions: { S: "I1", A: "I2", a: "I3", b: "I4" },
  },
  I1: { items: ["S'->S.,$"], transitions: {} },
  I2: {
    items: ["S->A.A,$", "A->.aA,$", "A->.b,$"],
    transitions: { A: "I5", a: "I6", b: "I7" },
  },
  I3: {
    items: ["A->a.A,a|b", "A->.aA, a|b", "A->.b, a|b"],
    transitions: { A: "I8", a: "I3", b: "I4" },
  },
  I4: { items: ["A->b.,a|b"], transitions: {} },
  I5: { items: ["S->AA.,$"], transitions: {} },
  I6: {
    items: ["A->a.A,$", "A->.aA,$", "A->.b,$"],
    transitions: { A: "I9", a: "I6", b: "I7" },
  },
  I7: { items: ["A->b.,$"], transitions: {} },
  I8: { items: ["A->aA.,a|b"], transitions: { A: "I9" } },
  I9: { items: ["A->aA.,$"], transitions: {} },
};
