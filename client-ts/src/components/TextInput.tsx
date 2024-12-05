// components/TextInput.tsx
import React from "react";
import { Input } from "./ui/input";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  placeholder?: string; // Add placeholder here
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder = "", // Default to empty string if no placeholder
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full mt-1 p-2 border border-gray-300 rounded"
        placeholder={placeholder} // Ensure placeholder is passed here
      />
    </div>
  );
};

export default TextInput;
