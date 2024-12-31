/** @format */
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CLRParsingTableProps } from "@/types";

const CLRParsingTable: React.FC<CLRParsingTableProps> = ({
  table,
  terminals,
  nonTerminals,
}) => {
  return (
    <div className="overflow-x-auto p-4">
      <Table className="max-w-[800px] mx-auto rounded-xl bg-white border border-gray-600 overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2 text-left font-medium">
              State
            </TableHead>
            {terminals.map((terminal) => (
              <TableHead key={terminal} className="px-4 py-2 text-center">
                {terminal}
              </TableHead>
            ))}
            {nonTerminals.map((nonTerminal) => (
              <TableHead key={nonTerminal} className="px-4 py-2 text-center">
                {nonTerminal}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.map(({ stateName, action, goto }) => (
            <TableRow key={stateName} className="hover:bg-gray-50">
              <TableCell className="px-4 py-2 font-medium">
                {stateName}
              </TableCell>
              {terminals.map((terminal) => (
                <TableCell key={terminal} className="px-4 py-2 text-center">
                  {action[terminal] || "-"}
                </TableCell>
              ))}
              {nonTerminals.map((nonTerminal) => (
                <TableCell key={nonTerminal} className="px-4 py-2 text-center">
                  {goto[nonTerminal] || "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CLRParsingTable;
