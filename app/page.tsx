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
import {
  GrammarStructure,
  TParsingResult,
  TableData,
  TFirstAndFollow,
} from "@/types";
import GrammerRuleModal from "@/components/GrammerRuleModal";
import ParsingTable, { TParsingTable } from "@/components/ParsingTable";
import ParseStringTable from "@/components/ParseStringTable";
import InputField from "@/components/InputField";

export default function HeroHighlightDemo() {
  const [grammer, setGrammer] = useState<string>(
    "S->L = R\nS->R\nL-> * R\nL->id\nR->L"
  );
  const [testString, setTestString] = useState<string>("id = id * id");
  const [errorMessage, setError] = useState<string | null>(null);
  const [errorMessageTestString, setErrorTestString] = useState<
    string | undefined
  >(undefined);
  const [firstFollowSets, setFirstFollowSets] = useState<TFirstAndFollow>({
    FIRST: {},
    FOLLOW: {},
  });
  const [canonicalCollection, setCanonicalCollection] = useState<{
    [key: string]: any;
  }>({});
  const [parsingTable, setParsingTable] = useState<TParsingTable>();
  const [parsingStringResult, setParsingStringResult] =
    useState<TParsingResult>();

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
      setParsingTable(result.combined_table);
    } catch (err) {
      setError("Failed to fetch FIRST and FOLLOW sets");
    }
  }, []);

  const fetchPraseStringResult = useCallback(
    async (grammar: GrammarStructure, inputstr: string) => {
      try {
        const result = await api.getPraseStringResult(grammar, inputstr);
        console.log(result);
        setParsingStringResult(result);
        // setParsingTable(result.combined_table);
      } catch (err) {
        setError("Failed to fetch FIRST and FOLLOW sets");
      }
    },
    []
  );

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
    console.log({ parsingTable });
    console.log({ parsingStringResult });
  }, [firstFollowSets, canonicalCollection, parsingTable, parsingStringResult]);

  const handleSubmitTestString = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (errorMessageTestString) return;

    try {
      const parsedGrammar = parseGrammar(grammer);
      await fetchPraseStringResult(parsedGrammar, testString);
    } catch (error) {
      setErrorTestString("Error processing test string");
    }
  };

  return (
    <div className="grid min-h-screen items-center ">
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
            {parsingTable && (
              <div className="mt-10 flex flex-col w-full justify-center mb-40">
                <hr className="my-8 h-[2px] border-0 bg-gray-300 dark:bg-gray-600" />
                <h1
                  className={`${styles.sectionHeadText} text-center text-text-light dark:text-text-dark`}
                >
                  <Highlight className="text-black dark:text-white">
                    Test the string
                  </Highlight>
                </h1>
                <div className="mt-10 flex w-full justify-center">
                  <StringTestForm
                    errorMessageTestString={errorMessageTestString}
                    handleSubmit={handleSubmitTestString}
                    setErrorTestString={setErrorTestString}
                    setTestString={setTestString}
                    testString={testString}
                  />
                </div>
                {parsingStringResult && (
                  <ParseStringTable parseStringResult={parsingStringResult} />
                )}
              </div>
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

type StringTestFormProps = {
  errorMessageTestString: string | null | undefined;
  setErrorTestString: Dispatch<SetStateAction<string | undefined>>;
  testString: string;
  setTestString: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

const StringTestForm: React.FC<StringTestFormProps> = ({
  errorMessageTestString,
  setErrorTestString,
  testString,
  setTestString,
  handleSubmit,
}) => {
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState<string>("");

  const validateGrammar = useCallback((input: string): boolean => {
    const grammarRules = input.split("\n").filter((line) => line.trim() !== "");
    const rulePattern = /^[A-Z]\s*->\s*.+$/;
    return grammarRules.every((rule) => rulePattern.test(rule.trim()));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTestString = e.target.value;
    setTestString(newTestString);
    // if (!validateGrammar(newTestString)) {
    //   setErrorTestString("Invalid grammar format. Please check your input.");
    // } else {
    //   setErrorTestString(null);
    // }
  };

  return (
    <div className="flex flex-col">
      <form
        className="flex w-full flex-col justify-center gap-3 px-8 sm:w-[30rem]"
        onSubmit={handleSubmit}
      >
        <InputField
          label="Enter the string to test"
          value={testString}
          onChange={handleChange}
          errorMessage={errorMessageTestString ?? undefined}
          placeholder="id = id * id"
        />

        <ActionButton text="Get going &rarr;" onClick={() => {}} />
      </form>
    </div>
  );
};
