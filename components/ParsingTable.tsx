/** @format */

import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

export const tablesData = {
  action_table: {
    headers: ["State", "=", "*", "id", "$"],
    rows: [
      {
        $: null,
        "*": ["shift", 4],
        "=": null,
        State: 0,
        id: ["shift", 5],
      },
      {
        $: ["accept", null],
        "*": null,
        "=": null,
        State: 1,
        id: null,
      },
      {
        $: ["reduce", 5],
        "*": null,
        "=": ["shift", 6],
        State: 2,
        id: null,
      },
      {
        $: ["reduce", 2],
        "*": null,
        "=": null,
        State: 3,
        id: null,
      },
      {
        $: null,
        "*": ["shift", 4],
        "=": null,
        State: 4,
        id: ["shift", 5],
      },
      {
        $: ["reduce", 4],
        "*": null,
        "=": ["reduce", 4],
        State: 5,
        id: null,
      },
      {
        $: null,
        "*": ["shift", 11],
        "=": null,
        State: 6,
        id: ["shift", 12],
      },
      {
        $: ["reduce", 5],
        "*": null,
        "=": ["reduce", 5],
        State: 7,
        id: null,
      },
      {
        $: ["reduce", 3],
        "*": null,
        "=": ["reduce", 3],
        State: 8,
        id: null,
      },
      {
        $: ["reduce", 5],
        "*": null,
        "=": null,
        State: 9,
        id: null,
      },
      {
        $: ["reduce", 1],
        "*": null,
        "=": null,
        State: 10,
        id: null,
      },
      {
        $: null,
        "*": ["shift", 11],
        "=": null,
        State: 11,
        id: ["shift", 12],
      },
      {
        $: ["reduce", 4],
        "*": null,
        "=": null,
        State: 12,
        id: null,
      },
      {
        $: ["reduce", 3],
        "*": null,
        "=": null,
        State: 13,
        id: null,
      },
    ],
  },
  goto_table: {
    headers: ["State", "S", "L", "R"],
    rows: [
      { L: 2, R: 3, S: 1, State: 0 },
      { L: null, R: null, S: null, State: 1 },
      { L: null, R: null, S: null, State: 2 },
      { L: null, R: null, S: null, State: 3 },
      { L: 7, R: 8, S: null, State: 4 },
      { L: null, R: null, S: null, State: 5 },
      { L: 9, R: 10, S: null, State: 6 },
      { L: null, R: null, S: null, State: 7 },
      { L: null, R: null, S: null, State: 8 },
      { L: null, R: null, S: null, State: 9 },
      { L: null, R: null, S: null, State: 10 },
      { L: 9, R: 13, S: null, State: 11 },
      { L: null, R: null, S: null, State: 12 },
      { L: null, R: null, S: null, State: 13 },
    ],
  },
};

export interface TParsingTable {
  headers: string[];
  rows: { [key: string]: (string | number | null)[] | null | number }[];
}

const ParsingTable = ({ tableData }: { tableData: TParsingTable }) => (
  <Table className="mb-4">
    <TableCaption>{"Parsing Table of CLR"}</TableCaption>
    <TableHeader>
      <TableRow>
        {tableData.headers.map((header, index) => (
          <TableHead key={index}>{header}</TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      {tableData.rows.map((row, rowIndex) => (
        <TableRow key={rowIndex}>
          {tableData.headers.map((header, cellIndex) => (
            <TableCell key={cellIndex}>
              {row[header] !== null ? row[header] : "-"}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default ParsingTable;
