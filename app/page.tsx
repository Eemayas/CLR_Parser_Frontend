/** @format */

"use client";
import MoveUpFadeAnimation from "@/components/MoveUpFadeAnimation";
import { Highlight } from "@/components/ui/hero-highlight";
import { styles } from "./style";
import { FormEventHandler, useState } from "react";
import ActionButton from "@/components/ActionButton";
import { CircleX } from "lucide-react";
import { GrammarStructure, parseGrammar } from "@/lib/grammerInputParse";
import StateGraph from "@/components/StateGraph";
import { StateList, states } from "./constant";
import CLRParsingTable from "@/components/CLRParsingTable";
import { parseCLRData } from "@/lib/parseCLRData";
import { api } from "@/utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function HeroHighlightDemo() {
  const { table, terminals, nonTerminals } = parseCLRData(states);
  return (
    <div className="grid min-h-screen items-center">
      <MoveUpFadeAnimation>
        <h1
          className={`${styles.sectionHeadText} text-center text-text-light dark:text-text-dark`}
        >
          <Highlight className="text-black dark:text-white">
            CLR(1) Parsing
          </Highlight>{" "}
        </h1>
        <h2 className="mx-auto mt-5 max-w-4xl px-4 text-center text-lg leading-relaxed text-neutral-700 dark:text-white md:text-xl lg:text-2xl lg:leading-snug">
          Experience the simplicity of CLR(1) Parsing with an intuitive demo
          that bridges theory and practice.
        </h2>
        <hr className="my-8 h-[2px] border-0 bg-gray-300 dark:bg-gray-600" />
        <div className="mt-10 flex w-full justify-center">
          <GrammerInputForm />
        </div>
        <hr className="my-8 h-[2px] border-0 bg-gray-300 dark:bg-gray-600" />
        <div className="flex flex-col  h-screen ">
          <h1
            className={`${styles.sectionHeadText} text-center text-text-light dark:text-text-dark`}
          >
            <Highlight className="text-black dark:text-white">
              Canonical Collection of CLR(1) Parsing
            </Highlight>{" "}
          </h1>
          <StateGraph states={states} />
        </div>
        <div className="flex flex-col  h-screen ">
          <h1
            className={`${styles.sectionHeadText} text-center text-text-light dark:text-text-dark`}
          >
            <Highlight className="text-black dark:text-white">
              Parsing Table of CLR(1) Parsing
            </Highlight>{" "}
          </h1>
          <CLRParsingTable
            table={table}
            terminals={terminals}
            nonTerminals={nonTerminals}
          />
        </div>
      </MoveUpFadeAnimation>
    </div>
  );
}

const GrammerInputForm = () => {
  const [grammer, setGrammer] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setError] = useState<string | null>(null);
  const [firstFollowSets, setFirstFollowSets] = useState<TFirstAndFollow>({
    FIRST: {},
    FOLLOW: {},
  });
  const [canonicalCollection, setCanonicalCollection] = useState({});
  const [message, setMessage] = useState<string>("");
  const placeholder = `S -> A B | C\nA -> a\nB -> b\nC -> c`;

  const validateGrammar = (input: string): boolean => {
    const grammarRules = input.split("\n").filter((line) => line.trim() !== "");
    const rulePattern = /^[A-Z]\s*->\s*.+$/;
    return grammarRules.every((rule) => rulePattern.test(rule.trim()));
  };

  // Example of calling the initializeParser endpoint
  const initialize = async (grammar: GrammarStructure) => {
    try {
      const result = await api.initializeParser(grammar);
      console.log("Initialized Parser:", result);
      setMessage(result.message);
    } catch (err) {
      console.error("Error initializing parser:", err);
      setError("Failed to initialize parser");
    }
  };

  const fetchFirstFollowSets = async (grammar: GrammarStructure) => {
    try {
      const result = await api.getFirstFollowSets(grammar);
      console.log("FIRST and FOLLOW Sets:", result);
      setFirstFollowSets(result);
    } catch (err) {
      console.error("Error fetching FIRST and FOLLOW sets:", err);
      setError("Failed to fetch FIRST and FOLLOW sets");
    }
  };

  const fetchCanonicalCollection = async (grammar: GrammarStructure) => {
    try {
      const result = await api.getCanonicalCollection(grammar);
      console.log("Canonical Collection:", result);
      setCanonicalCollection(result.canonical_collection);
    } catch (err) {
      console.error("Error fetching canonical collection:", err);
      setError("Failed to fetch canonical collection");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newGrammar = e.target.value;
    setGrammer(newGrammar);

    if (!validateGrammar(newGrammar)) {
      setError("Invalid grammar format. Please check your input.");
    } else {
      setError(null);
    }
    console.log({ newGrammarvalid: validateGrammar(newGrammar) });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (errorMessage) {
      return;
    }

    try {
      const parsedGrammar = parseGrammar(grammer);
      initialize(parsedGrammar);
      fetchFirstFollowSets(parsedGrammar);
      fetchCanonicalCollection(parsedGrammar);
    } catch (error) {
      setError(String(error));
      console.error(error);
    }
  };

  function convertToStateList(data: any): StateList {
    const stateList: StateList = {};

    data.forEach((entry: any) => {
      const productionKey = entry.production[0]; // Use the first element of the production as the state key.
      const lookahead = entry.lookahead[0]; // Assuming we only care about the first lookahead element.

      // Ensure the state exists in stateList
      if (!stateList[productionKey]) {
        stateList[productionKey] = {
          items: entry.production.flat(), // Flatten production array to a single-level array
          transitions: {},
        };
      }

      // Add transition for the lookahead
      stateList[productionKey].transitions[lookahead] = productionKey;
    });

    return stateList;
  }
  console.log(canonicalCollection);
  console.log(
    canonicalCollection ? convertToStateList(canonicalCollection) : []
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <form
          className="flex w-full flex-col justify-center gap-3 px-8 sm:w-[30rem]"
          onSubmit={handleSubmit}
        >
          {" "}
          <label
            htmlFor="github-repo-link"
            className={` block text-sm font-medium ${
              errorMessage
                ? "text-red-700 dark:text-red-500"
                : "text-text-light dark:text-text-dark"
            }`}
          >
            {"Enter the Grammer here"}
          </label>
          <textarea
            rows={6}
            value={grammer}
            onChange={handleChange}
            className={`border ${
              errorMessage
                ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:text-red-500 dark:placeholder-red-500"
                : "border-gray-300 bg-gray-50 text-text-light placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:text-text-dark dark:placeholder-gray-500"
            } block w-full rounded-lg p-2.5 text-sm dark:bg-gray-700`}
            placeholder={placeholder}
          ></textarea>
          {errorMessage && (
            <div className="mt-2 text-red-500 text-sm">{errorMessage}</div>
          )}
          <ActionButton text="Get going &rarr;" onClick={() => {}} />
        </form>
        <div className="text-sm text-gray-500 dark:text-gray-500 flex flex-row justify-center ">
          Getting problem with Grammer:{"  "}
          <div
            onClick={() => setShowModal(true)}
            className="font-bold text-blue-400 underline"
          >
            See Rules and Examples{" "}
          </div>
          <GrammerRuleModal
            isShow={showModal}
            closeModal={() => setShowModal(false)}
          />
        </div>
      </div>
      <div className="p-4">
        <h1
          className={`${styles.sectionHeadText} text-center text-text-light dark:text-text-dark`}
        >
          <Highlight className="text-black dark:text-white">
            First and Follow of given Grammer
          </Highlight>{" "}
        </h1>
        <GrammarTable {...firstFollowSets} />{" "}
        <h1
          className={`${styles.sectionHeadText} text-center text-text-light dark:text-text-dark`}
        >
          <Highlight className="text-black dark:text-white">
            First and Follow of given Grammer
          </Highlight>{" "}
        </h1>
        <h1 className="text-xl font-bold">Flask API with Next.js</h1>
        {message && <p className="text-green-500">{message}</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <pre className="bg-gray-100 p-2 mt-4 rounded">
          {JSON.stringify(canonicalCollection, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export const GrammerRuleModal = ({
  isShow,
  closeModal,
}: {
  isShow: boolean;
  closeModal: () => void;
}) => {
  const rules = [
    {
      title: "Rule Format",
      description: "<Non-terminal> -> <Production>",
      examples: ["S -> NP VP", "NP -> Det Noun", "VP -> Verb NP"],
    },
    {
      title: "Whitespace Optionality",
      description:
        "Spaces around -> are optional. Space separates production parts.",
      examples: ["S->NP VP", "Det -> the | a"],
    },
    {
      title: "Production Alternatives",
      description: "Multiple alternatives separated by |",
      examples: ["Noun -> dog | cat | mouse"],
    },
    {
      title: "Multiple Words",
      description: "Multiple tokens allowed if separated by spaces",
      examples: ["NP -> Det Noun"],
    },
    {
      title: "Non-terminal Capitalization",
      description: "Non-terminals must use uppercase letters",
      examples: ["NP -> Noun"],
    },
    {
      title: "Terminal Symbols",
      description: "Terminals must be alphanumeric, cannot start with numbers",
      examples: ["Verb -> run | jump"],
    },
    {
      title: "Empty Productions",
      description: "Empty productions use ε (epsilon)",
      examples: ["NP -> Det | ε"],
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-50 items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none ${
          isShow ? "flex" : "hidden"
        }`}
      >
        <div
          className={`rounded-[10px] bg-gradient-to-br from-green-400 to-blue-600 p-[2px] text-gray-900 hover:text-white dark:text-white md:w-[30rem]`}
        >
          <div className="relative h-[80vh] w-auto max-w-3xl rounded-lg bg-white p-6 dark:bg-black">
            {/* Close icon */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <CircleX className="h-6 w-6" onClick={closeModal} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Grammar Rules
            </h1>
            <div
              className="space-y-8 overflow-y-auto max-h-[70vh]"
              style={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {rules.map((rule, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {index + 1}. {rule.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    {rule.description}
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="font-mono text-sm text-blue-600 dark:text-blue-400 mb-2 underline">
                      Examples:
                    </p>
                    {rule.examples.map((example, i) => (
                      <code
                        key={i}
                        className="block text-sm text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-900 p-2 rounded-md"
                      >
                        {example}
                      </code>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              {/* <button
                onClick={closeModal}
                className="bg-gray-300 text-black p-3 rounded-md shadow-sm hover:shadow-lg transition duration-200 ease-in-out"
              >
                Close
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const data = {
  FIRST: {
    S: ["S"],
    "S'": ["S"],
    g: ["r"],
    r: ["r"],
  },
  FOLLOW: {
    "S'": ["$"],
    g: [],
  },
};

// Merge the FIRST and FOLLOW data into a unified structure
const processData = (data: any) => {
  const symbols = new Set([
    ...Object.keys(data.FIRST),
    ...Object.keys(data.FOLLOW),
  ]);

  return Array.from(symbols).map((symbol) => ({
    symbol,
    first: data.FIRST[symbol] ? `{${data.FIRST[symbol].join(", ")}}` : "{}",
    follow: data.FOLLOW[symbol] ? `{${data.FOLLOW[symbol].join(", ")}}` : "{}",
  }));
};

type TFirstAndFollow = {
  FIRST: {
    [key: string]: string[];
  };
  FOLLOW: {
    [key: string]: string[] | never[];
  };
};

const GrammarTable = (data: TFirstAndFollow) => {
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
