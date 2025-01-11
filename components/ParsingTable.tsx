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

export interface TParsingTable {
  headers: string[];
  rows: { [key: string]: (string | number | null)[] | null | number }[];
}

const ParsingTable = ({ tableData }: { tableData: TParsingTable }) => {
  return (
    <Table className="table-auto border-collapse border border-gray-300 w-fit min-w-[800px] mx-auto mt-9">
      <TableCaption>{"Parsing Table of CLR"}</TableCaption>
      <TableHeader>
        <TableRow>
          {tableData.headers.map((header, index) => (
            <TableHead key={index}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.rows.map((row, rowIndex) => {
          return (
            <TableRow key={rowIndex}>
              {tableData.headers.map((header, cellIndex) => {
                return (
                  <TableCell key={cellIndex}>
                    {header === "State"
                      ? `I${row[header]}`
                      : Array.isArray(row[header])
                      ? `(${row[header].join(", ")})`
                      : row[header] !== null
                      ? row[header]
                      : "-"}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ParsingTable;
