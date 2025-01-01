/** @format */

const InputField = ({
  label,
  value,
  onChange,
  errorMessage,
  placeholder = "https://github.com/",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  placeholder?: string;
}) => {
  return (
    <div>
      <label
        htmlFor={`input-${placeholder}`}
        className={`mb-2 block text-sm font-medium ${
          errorMessage
            ? "text-red-700 dark:text-red-500"
            : "text-text-light dark:text-text-dark"
        }`}
      >
        {label}
      </label>
      <input
        type="text"
        id={`input-${placeholder}`}
        value={value}
        onChange={onChange}
        className={`border ${
          errorMessage
            ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:text-red-500 dark:placeholder-red-500"
            : "border-gray-300 bg-gray-50 text-text-light placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:text-text-dark dark:placeholder-gray-500"
        } block w-full rounded-lg p-2.5 text-sm dark:bg-gray-700`}
        placeholder={placeholder}
      />
      {errorMessage && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          <span className="font-medium">{errorMessage}</span>
        </p>
      )}
    </div>
  );
};
export default InputField;
