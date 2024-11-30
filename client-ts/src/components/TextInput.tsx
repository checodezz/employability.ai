// components/TextInput.tsx
import React from "react";
// import { Input } from "@shadcn/ui";
import { Input } from "./ui/input";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  required,
  type = "text",
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
      />
    </div>
  );
};

export default TextInput;
