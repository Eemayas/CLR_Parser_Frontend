/** @format */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TFirstAndFollow } from "@/types";

const FirstAndFollowTable = (data: TFirstAndFollow) => {
  // Merge the FIRST and FOLLOW data into a unified structure
  const processData = (data: any) => {
    const symbols = new Set([
      ...Object.keys(data.FIRST),
      ...Object.keys(data.FOLLOW),
    ]);

    return Array.from(symbols).map((symbol) => ({
      symbol,
      first: data.FIRST[symbol] ? `{${data.FIRST[symbol].join(", ")}}` : "{}",
      follow: data.FOLLOW[symbol]
        ? `{${data.FOLLOW[symbol].join(", ")}}`
        : "{}",
    }));
  };

  const rows = processData(data);

  return (
    <div className="p-4">
      <Table className="table-auto border-collapse border border-gray-300">
        <TableHeader>
          <TableRow>
            <TableHead className="border border-gray-300">Symbol</TableHead>
            <TableHead className="border border-gray-300">First</TableHead>
            <TableHead className="border border-gray-300">Follow</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ symbol, first, follow }) => (
            <TableRow key={symbol}>
              <TableCell className="border border-gray-300">{symbol}</TableCell>
              <TableCell className="border border-gray-300">{first}</TableCell>
              <TableCell className="border border-gray-300">{follow}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FirstAndFollowTable;
