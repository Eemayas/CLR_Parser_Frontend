/** @format */

import { cn } from "@/lib/utils";

const ActionButton = ({
  onClick,
  text,
  className,
  innerClassName,
}: {
  onClick: () => void;
  text: string;
  className?: string;
  innerClassName?: string;
}) => (
  <button
    className={cn(
      `group/button relative mb-2 me-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-green-400 to-blue-600 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-200 group-hover/button:from-green-400 group-hover/button:to-blue-600 dark:text-white dark:focus:ring-green-800 ${className}`,
    )}
    onClick={onClick}
  >
    <span
      className={cn(
        `relative w-full rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover/button:bg-opacity-0 dark:bg-gray-900 ${innerClassName}`,
      )}
    >
      {text}
    </span>
  </button>
);
export default ActionButton;
