/** @format */

export default interface State {
  items: string[];
  transitions: { [key: string]: string };
}
export interface StateList {
  [key: string]: State;
}

// export const states: { [key: string]: State } = {
//   I0: {
//     items: ["S'->.S,$", "S->.AA,$", "A->.aA,a|b", "A->.b,a|b"],
//     transitions: { S: "I1", A: "I2", a: "I3", b: "I4" },
//   },
//   I1: { items: ["S'->S.,$"], transitions: {} },
//   I2: {
//     items: ["S->A.A,$", "A->.aA,$", "A->.b,$"],
//     transitions: { A: "I5", a: "I6", b: "I7" },
//   },
//   I3: {
//     items: ["A->a.A,a|b", "A->.aA, a|b", "A->.b, a|b"],
//     transitions: { A: "I8", a: "I3", b: "I4" },
//   },
//   I4: { items: ["A->b.,a|b"], transitions: {} },
//   I5: { items: ["S->AA.,$"], transitions: {} },
//   I6: {
//     items: ["A->a.A,$", "A->.aA,$", "A->.b,$"],
//     transitions: { A: "I9", a: "I6", b: "I7" },
//   },
//   I7: { items: ["A->b.,$"], transitions: {} },
//   I8: { items: ["A->aA.,a|b"], transitions: { A: "I9" } },
//   I9: { items: ["A->aA.,$"], transitions: {} },
// };
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

const s = [
  {
    I0: {
      items: [
        "R → • L, $",
        "L → • i d, =",
        "L → • i d, $",
        "S → • L = R, $",
        "L → • * R, =",
        "S → • R, $",
        "L → • * R, $",
        "S' → • S, $",
      ],
      transitions: { "*": "I4", L: "I2", R: "I3", S: "I1", i: "I5" },
    },
  },
  { I1: { items: ["S' → S •, $"], transitions: {} } },
  {
    I2: {
      items: ["R → L •, $", "S → L • = R, $"],
      transitions: { "=": "I6" },
    },
  },
  { I3: { items: ["S → R •, $"], transitions: {} } },
  {
    I4: {
      items: [
        "L → * • R, =",
        "R → • L, $",
        "R → • L, =",
        "L → • * R, =",
        "L → • * R, $",
        "L → • i d, =",
        "L → • i d, $",
        "L → * • R, $",
      ],
      transitions: { "*": "I4", L: "I7", R: "I8", i: "I5" },
    },
  },
  {
    I5: { items: ["L → i • d, =", "L → i • d, $"], transitions: { d: "I9" } },
  },
  {
    I6: {
      items: ["R → • L, $", "S → L = • R, $", "L → • * R, $", "L → • i d, $"],
      transitions: { "*": "I12", L: "I10", R: "I11", i: "I13" },
    },
  },
  {
    I7: { items: ["R → L •, =", "R → L •, $"], transitions: {} },
  },
  {
    I8: { items: ["L → * R •, =", "L → * R •, $"], transitions: {} },
  },
  {
    I9: { items: ["L → i d •, =", "L → i d •, $"], transitions: {} },
  },
  { I10: { items: ["R → L •, $"], transitions: {} } },
  { I11: { items: ["S → L = R •, $"], transitions: {} } },
  {
    I12: {
      items: ["R → • L, $", "L → * • R, $", "L → • i d, $", "L → • * R, $"],
      transitions: { "*": "I12", L: "I10", R: "I14", i: "I13" },
    },
  },
  { I13: { items: ["L → i • d, $"], transitions: { d: "I15" } } },
  { I14: { items: ["L → * R •, $"], transitions: {} } },
  { I15: { items: ["L → i d •, $"], transitions: {} } },
];
