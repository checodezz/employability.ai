// src/components/SkillsSection.tsx

import React from "react";
import TextInput from "./TextInput";
import { Button } from "@/components/ui/button";

interface Skill {
  name: string;
  rating: number;
}

interface SkillsSectionProps {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, setSkills }) => {
  // Handle changes to a specific skill's name or rating
  const handleSkillChange = (
    index: number,
    field: keyof Skill,
    value: string | number
  ) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setSkills(updatedSkills);
  };

  // Add a new empty skill
  const addSkill = () => {
    setSkills([...skills, { name: "", rating: 1 }]);
  };

  // Remove a skill by index
  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Skills</h3>
      {skills.map((skill, index) => (
        <div
          key={index}
          className="mb-4 p-4 border border-gray-300 rounded flex flex-col"
        >
          <TextInput
            label={`Skill ${index + 1}`}
            value={skill.name}
            onChange={(e) => handleSkillChange(index, "name", e.target.value)}
            placeholder="e.g., JavaScript"
          />
          <label className="block text-gray-700 mt-2">Rating (out of 5)</label>
          <select
            value={skill.rating}
            onChange={(e) =>
              handleSkillChange(index, "rating", Number(e.target.value))
            }
            className="w-full border border-gray-300 rounded p-2 mt-1"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <Button
            onClick={() => removeSkill(index)}
            variant="destructive"
            size="sm"
            className="mt-2"
          >
            Remove Skill
          </Button>
        </div>
      ))}
      <Button onClick={addSkill} variant="default" className="w-full">
        Add Skill
      </Button>
    </div>
  );
};

export default SkillsSection;
