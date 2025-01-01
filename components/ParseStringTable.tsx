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
import { TParsingResult } from "@/types";

interface ParseStringTableProps {
  parseStringResult: TParsingResult;
}

const ParseStringTable: React.FC<ParseStringTableProps> = ({
  parseStringResult,
}) => {
  return (
    <Table className="table-auto border-collapse border  border-gray-300 w-fit min-w-[800px] mx-auto mt-9">
      <TableCaption>{"Parsing result of given grammar"}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="border border-gray-300">Stack</TableHead>
          <TableHead className="border border-gray-300">Input</TableHead>
          <TableHead className="border border-gray-300">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parseStringResult.steps.map((step, index) => (
          <TableRow key={index}>
            <TableCell className="border border-gray-300">
              {step.stack}
            </TableCell>
            <TableCell className="border border-gray-300">
              {step.input}
            </TableCell>
            <TableCell className="border border-gray-300">
              {step.action}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ParseStringTable;
