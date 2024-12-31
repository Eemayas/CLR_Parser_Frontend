/** @format */

"use client";
import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import MoveUpFadeAnimation from "@/components/MoveUpFadeAnimation";
import { Highlight } from "@/components/ui/hero-highlight";
import { styles } from "./style";
import ActionButton from "@/components/ActionButton";
import { parseGrammar } from "@/lib/grammerInputParse";
import StateGraph from "@/components/StateGraph";
import { api } from "@/utils/api";
import FirstAndFollowTable from "@/components/FirstAndFollowTable";
import { GrammarStructure, TableData, TFirstAndFollow } from "@/types";
import GrammerRuleModal from "@/components/GrammerRuleModal";
import ParsingTable, {
  tablesData,
  TParsingTable,
} from "@/components/ParsingTable";

export default function HeroHighlightDemo() {
  const [grammer, setGrammer] = useState<string>(
    "S->L = R\nS->R\nL-> * R\nL->id\nR->L"
  );
  const [errorMessage, setError] = useState<string | null>(null);
  const [firstFollowSets, setFirstFollowSets] = useState<TFirstAndFollow>({
    FIRST: {},
    FOLLOW: {},
  });
  const [canonicalCollection, setCanonicalCollection] = useState<{
    [key: string]: any;
  }>({});
  const [parsingTable, setParsingTable] = useState<TParsingTable>();

  const initializeParser = useCallback(async (grammar: GrammarStructure) => {
    try {
      const result = await api.initializeParser(grammar);
    } catch (err) {
      setError("Failed to initialize parser");
    }
  }, []);

  const fetchFirstFollowSets = useCallback(
    async (grammar: GrammarStructure) => {
      try {
        const result = await api.getFirstFollowSets(grammar);
        setFirstFollowSets(result);
      } catch (err) {
        setError("Failed to fetch FIRST and FOLLOW sets");
      }
    },
    []
  );

  const fetchCanonicalCollection = useCallback(
    async (grammar: GrammarStructure) => {
      try {
        const result = await api.getCanonicalCollection(grammar);
        let temp: { [key: string]: { items: any; transitions: any } } = {};
        result.canonical_collection.map(
          (collection: { [key: string]: any }) => {
            Object.keys(collection).map((state) => {
              temp[state] = {
                items: collection[state].items,
                transitions: collection[state].transitions,
              };
            });
          }
        );

        setCanonicalCollection(temp);
      } catch (err) {
        setError("Failed to fetch canonical collection");
      }
    },
    []
  );

  const fetchParsingTable = useCallback(async (grammar: GrammarStructure) => {
    try {
      const result = await api.getParsingTable(grammar);
      console.log(result.combined_table);
      setParsingTable(result.combined_table);
    } catch (err) {
      setError("Failed to fetch FIRST and FOLLOW sets");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (errorMessage) return;

    try {
      const parsedGrammar = parseGrammar(grammer);
      await Promise.all([
        initializeParser(parsedGrammar),
        fetchFirstFollowSets(parsedGrammar),
        fetchCanonicalCollection(parsedGrammar),
        fetchParsingTable(parsedGrammar),
      ]);
    } catch (error) {
      setError("Error processing grammar");
    }
  };
  useEffect(() => {
    console.log({ firstFollowSets });
    console.log({ canonicalCollection });
  }, [firstFollowSets, canonicalCollection]);

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
          <GrammerInputForm
            errorMessage={errorMessage}
            setError={setError}
            grammer={grammer}
            setGrammer={setGrammer}
            handleSubmit={handleSubmit}
          />
        </div>
        {grammer && (
          <>
            {" "}
            {Object.keys(firstFollowSets.FIRST).length > 0 &&
              Object.keys(firstFollowSets.FOLLOW).length > 0 && (
                <>
                  <hr className="my-8 h-[2px] border-0 bg-gray-300 dark:bg-gray-600" />
                  <h1
                    className={`${styles.sectionHeadText} text-center text-text-light dark:text-text-dark`}
                  >
                    <Highlight className="text-black dark:text-white">
                      First and Follow of given Grammar
                    </Highlight>
                  </h1>
                  <FirstAndFollowTable {...firstFollowSets} />
                </>
              )}
            {Object.keys(canonicalCollection).length > 0 && (
              <>
                <hr className="my-8 h-[2px] border-0 bg-gray-300 dark:bg-gray-600" />
                <h1
                  className={`${styles.sectionHeadText} text-center text-text-light dark:text-text-dark`}
                >
                  <Highlight className="text-black dark:text-white">
                    Canonical Collection of CLR(1) Parsing
                  </Highlight>
                </h1>
                <StateGraph states={canonicalCollection} />
              </>
            )}
            {parsingTable && (
              <>
                <hr className="my-8 h-[2px] border-0 bg-gray-300 dark:bg-gray-600" />
                <h1
                  className={`${styles.sectionHeadText} text-center text-text-light dark:text-text-dark`}
                >
                  <Highlight className="text-black dark:text-white">
                    Parsing Table of CLR(1) Parsing
                  </Highlight>
                </h1>
                <ParsingTable tableData={parsingTable} />
              </>
            )}
          </>
        )}
      </MoveUpFadeAnimation>
    </div>
  );
}

type GrammerInputFormProps = {
  errorMessage: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  grammer: string;
  setGrammer: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

const GrammerInputForm: React.FC<GrammerInputFormProps> = ({
  errorMessage,
  setError,
  grammer,
  setGrammer,
  handleSubmit,
}) => {
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState<string>("");

  const validateGrammar = useCallback((input: string): boolean => {
    const grammarRules = input.split("\n").filter((line) => line.trim() !== "");
    const rulePattern = /^[A-Z]\s*->\s*.+$/;
    return grammarRules.every((rule) => rulePattern.test(rule.trim()));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newGrammar = e.target.value;
    setGrammer(newGrammar);
    if (!validateGrammar(newGrammar)) {
      setError("Invalid grammar format. Please check your input.");
    } else {
      setError(null);
    }
  };

  return (
    <div className="flex flex-col">
      <form
        className="flex w-full flex-col justify-center gap-3 px-8 sm:w-[30rem]"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="github-repo-link"
          className={`block text-sm font-medium ${
            errorMessage
              ? "text-red-700 dark:text-red-500"
              : "text-text-light dark:text-text-dark"
          }`}
        >
          Enter the Grammar here
        </label>
        <textarea
          rows={6}
          value={grammer}
          onChange={handleChange}
          className={`border ${
            errorMessage
              ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:text-red-500 dark:placeholder-red-500"
              : "border-gray-300 bg-gray-50 text-text-light placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:text-text-dark dark:placeholder-gray-500"
          }`}
          placeholder="S -> A B | C\nA -> a\nB -> b\nC -> c"
        ></textarea>
        {errorMessage && (
          <div className="mt-2 text-red-500 text-sm">{errorMessage}</div>
        )}
        <ActionButton text="Get going &rarr;" onClick={() => {}} />
      </form>

      <div className="text-sm text-gray-500 dark:text-gray-500 flex flex-row justify-center ">
        Getting problem with Grammar:{" "}
        <div
          onClick={() => setShowModal(true)}
          className="font-bold text-blue-400 underline"
        >
          See Rules and Examples
        </div>
        <GrammerRuleModal
          isShow={showModal}
          closeModal={() => setShowModal(false)}
        />
      </div>

      <div className="p-4"></div>
    </div>
  );
};

// /** @format */

// "use client";
// import MoveUpFadeAnimation from "@/components/MoveUpFadeAnimation";
// import { Highlight } from "@/components/ui/hero-highlight";
// import { styles } from "./style";
// import { useEffect, useState } from "react";
// import ActionButton from "@/components/ActionButton";
// import StateGraph from "@/components/StateGraph";
// import { states } from "./constant";
// import { parseCLRData } from "@/lib/parseCLRData";
// import { api } from "@/utils/api";
// import FirstAndFollowTable from "@/components/FirstAndFollowTable";
// import { GrammarStructure, TFirstAndFollow } from "@/types";
// import GrammerRuleModal from "@/components/GrammerRuleModal";
// import { parseGrammar } from "@/lib/grammerInputParse";

// export default function HeroHighlightDemo() {
//   const { table, terminals, nonTerminals } = parseCLRData(states);
//   return (
//     <div className="grid min-h-screen items-center">
//       <MoveUpFadeAnimation>
//         <h1
//           className={`${styles.sectionHeadText} text-center text-text-light dark:text-text-dark`}
//         >
//           <Highlight className="text-black dark:text-white">
//             CLR(1) Parsing
//           </Highlight>{" "}
//         </h1>
//         <h2 className="mx-auto mt-5 max-w-4xl px-4 text-center text-lg leading-relaxed text-neutral-700 dark:text-white md:text-xl lg:text-2xl lg:leading-snug">
//           Experience the simplicity of CLR(1) Parsing with an intuitive demo
//           that bridges theory and practice.
//         </h2>
//         <hr className="my-8 h-[2px] border-0 bg-gray-300 dark:bg-gray-600" />
//         <div className="mt-10 flex w-full justify-center">
//           <GrammerInputForm />
//         </div>
//         <hr className="my-8 h-[2px] border-0 bg-gray-300 dark:bg-gray-600" />
//         {/*   <div className="flex flex-col  h-screen ">
//           <h1
//             className={`${styles.sectionHeadText} text-center text-text-light dark:text-text-dark`}
//           >
//             <Highlight className="text-black dark:text-white">
//               Canonical Collection of CLR(1) Parsing
//             </Highlight>{" "}
//           </h1>
//           <StateGraph states={states} />
//         </div>
//         <div className="flex flex-col  h-screen ">
//           <h1
//             className={`${styles.sectionHeadText} text-center text-text-light dark:text-text-dark`}
//           >
//             <Highlight className="text-black dark:text-white">
//               Parsing Table of CLR(1) Parsing
//             </Highlight>{" "}
//           </h1>
//           <CLRParsingTable
//             table={table}
//             terminals={terminals}
//             nonTerminals={nonTerminals}
//           />
//         </div> */}
//       </MoveUpFadeAnimation>
//     </div>
//   );
// }

// const GrammerInputForm = () => {
//   const [grammer, setGrammer] = useState(`S->L=R
// S->R
// L->*R
// L->id
// R->L`);
//   const [showModal, setShowModal] = useState(false);
//   const [errorMessage, setError] = useState<string | null>(null);
//   const [firstFollowSets, setFirstFollowSets] = useState<TFirstAndFollow>({
//     FIRST: {},
//     FOLLOW: {},
//   });
//   const [canonicalCollection, setCanonicalCollection] = useState({});
//   const [message, setMessage] = useState<string>("");
//   const placeholder = `S -> A B | C\nA -> a\nB -> b\nC -> c`;

//   const validateGrammar = (input: string): boolean => {
//     const grammarRules = input.split("\n").filter((line) => line.trim() !== "");
//     const rulePattern = /^[A-Z]\s*->\s*.+$/;
//     return grammarRules.every((rule) => rulePattern.test(rule.trim()));
//   };

//   // Example of calling the initializeParser endpoint
//   const initialize = async (grammar: GrammarStructure) => {
//     try {
//       const result = await api.initializeParser(grammar);
//       console.log("Initialized Parser:", result);
//       setMessage(result.message);
//     } catch (err) {
//       console.error("Error initializing parser:", err);
//       setError("Failed to initialize parser");
//     }
//   };

//   const fetchFirstFollowSets = async (grammar: GrammarStructure) => {
//     try {
//       const result = await api.getFirstFollowSets(grammar);
//       console.log("FIRST and FOLLOW Sets:", result);
//       setFirstFollowSets(result);
//     } catch (err) {
//       console.error("Error fetching FIRST and FOLLOW sets:", err);
//       setError("Failed to fetch FIRST and FOLLOW sets");
//     }
//   };

//   const fetchCanonicalCollection = async (grammar: GrammarStructure) => {
//     try {
//       const result = await api.getCanonicalCollection(grammar);
//       console.log("Canonical Collection:", result);
//       let temp: { [key: string]: { items: any; transitions: any } } = {};
//       result.canonical_collection.map((collection: { [key: string]: any }) => {
//         Object.keys(collection).map((state) => {
//           temp[state] = {
//             items: collection[state].items,
//             transitions: collection[state].transitions,
//           };
//         });
//       });
//       console.log(temp);
//       setCanonicalCollection(temp);
//     } catch (err) {
//       console.error("Error fetching canonical collection:", err);
//       setError("Failed to fetch canonical collection");
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const newGrammar = e.target.value;
//     setGrammer(newGrammar);

//     if (!validateGrammar(newGrammar)) {
//       setError("Invalid grammar format. Please check your input.");
//     } else {
//       setError(null);
//     }
//     console.log({ newGrammarvalid: validateGrammar(newGrammar) });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (errorMessage) {
//       return;
//     }

//     try {
//       const parsedGrammar = parseGrammar(grammer);
//       initialize(parsedGrammar);
//       fetchFirstFollowSets(parsedGrammar);
//       fetchCanonicalCollection(parsedGrammar);
//     } catch (error) {
//       setError(String(error));
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     console.log(canonicalCollection);
//   }, [canonicalCollection]);

//   return (
//     <div className="flex flex-col">
//       <div className="flex flex-col">
//         <form
//           className="flex w-full flex-col justify-center gap-3 px-8 sm:w-[30rem]"
//           onSubmit={handleSubmit}
//         >
//           {" "}
//           <label
//             htmlFor="github-repo-link"
//             className={` block text-sm font-medium ${
//               errorMessage
//                 ? "text-red-700 dark:text-red-500"
//                 : "text-text-light dark:text-text-dark"
//             }`}
//           >
//             {"Enter the Grammer here"}
//           </label>
//           <textarea
//             rows={6}
//             value={grammer}
//             onChange={handleChange}
//             className={`border ${
//               errorMessage
//                 ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:text-red-500 dark:placeholder-red-500"
//                 : "border-gray-300 bg-gray-50 text-text-light placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:text-text-dark dark:placeholder-gray-500"
//             } block w-full rounded-lg p-2.5 text-sm dark:bg-gray-700`}
//             placeholder={placeholder}
//           ></textarea>
//           {errorMessage && (
//             <div className="mt-2 text-red-500 text-sm">{errorMessage}</div>
//           )}
//           <ActionButton text="Get going &rarr;" onClick={() => {}} />
//         </form>
//         <div className="text-sm text-gray-500 dark:text-gray-500 flex flex-row justify-center ">
//           Getting problem with Grammer:{"  "}
//           <div
//             onClick={() => setShowModal(true)}
//             className="font-bold text-blue-400 underline"
//           >
//             See Rules and Examples{" "}
//           </div>
//           <GrammerRuleModal
//             isShow={showModal}
//             closeModal={() => setShowModal(false)}
//           />
//         </div>
//       </div>
//       <div className="p-4">
//         <hr className="my-8 h-[2px] border-0 bg-gray-300 dark:bg-gray-600" />
//         <h1
//           className={`${styles.sectionHeadText} text-center text-text-light dark:text-text-dark`}
//         >
//           <Highlight className="text-black dark:text-white">
//             First and Follow of given Grammer
//           </Highlight>{" "}
//         </h1>
//         <FirstAndFollowTable {...firstFollowSets} />{" "}
//         <hr className="my-8 h-[2px] border-0 bg-gray-300 dark:bg-gray-600" />
//         <h1
//           className={`${styles.sectionHeadText} text-center text-text-light dark:text-text-dark`}
//         >
//           <Highlight className="text-black dark:text-white">
//             Canonical Collection of CLR(1) Parsing
//           </Highlight>{" "}
//         </h1>
//         {Object.keys(canonicalCollection).length > 0 && (
//           <StateGraph states={canonicalCollection} />
//         )}
//       </div>
//     </div>
//   );
// };
