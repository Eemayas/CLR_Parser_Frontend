/** @format */

import { CircleX } from "lucide-react";

const GrammarRuleModal = ({
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

export default GrammarRuleModal;
