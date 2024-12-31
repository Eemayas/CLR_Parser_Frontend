/** @format */

export type TFirstAndFollow = {
  FIRST: {
    [key: string]: string[];
  };
  FOLLOW: {
    [key: string]: string[] | never[];
  };
};
