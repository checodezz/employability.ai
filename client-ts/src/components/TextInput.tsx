// components/TextInput.tsx
import React from "react";
import { Input } from "./ui/input";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  error?: string; // Add error prop to handle error messages
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder = "",
  error,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full mt-1 p-2 border rounded ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        placeholder={placeholder}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}{" "}
      {/* Display error below input */}
    </div>
  );
};

export default TextInput;
