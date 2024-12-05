import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Skill {
  name: string;
  rating: number;
}

interface SkillsSectionProps {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  skillsList: string[];
  parsedDataSkills: string[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills = [], // Provide default empty array
  setSkills,
  skillsList = [], // Provide default empty array
  parsedDataSkills = [], // Provide default empty array
}) => {
  // Create a map of normalized skills to their original form
  const skillsMap = React.useMemo(() => {
    const map = new Map<string, string>();
    // Remove duplicates by only keeping the first occurrence
    [...new Set(skillsList)].forEach((skill) => {
      if (skill) {
        // Add null check
        const normalized = skill.toLowerCase().trim();
        if (!map.has(normalized)) {
          map.set(normalized, skill);
        }
      }
    });
    return map;
  }, [skillsList]);

  useEffect(() => {
    // Add null checks and verify arrays exist
    if (
      Array.isArray(skills) &&
      Array.isArray(parsedDataSkills) &&
      skills.length === 0 &&
      parsedDataSkills.length > 0
    ) {
      // Create a Set of unique normalized parsed skills
      const uniqueParsedSkills = new Set(
        parsedDataSkills
          .filter((skill) => skill) // Filter out null/undefined values
          .map((skill) => skill.toLowerCase().trim())
      );

      // Match against our skills map and create skill objects
      const matchedSkills = Array.from(uniqueParsedSkills)
        .filter((skill) => skillsMap.has(skill))
        .map((skill) => ({
          name: skill,
          rating: 3,
        }));

      if (matchedSkills.length > 0) {
        setSkills(matchedSkills);
      }
    }
  }, [parsedDataSkills, skillsMap, skills, setSkills]);

  const getAvailableSkills = (currentIndex: number) => {
    if (!Array.isArray(skills)) return [];

    // Get currently selected skills except for the current index
    const selectedSkills = new Set(
      skills
        .filter((_, i) => i !== currentIndex)
        .filter((skill) => skill?.name) // Add null check
        .map((skill) => skill.name.toLowerCase().trim())
    );

    // Return only unselected skills
    return Array.from(skillsMap.entries())
      .filter(([normalized]) => !selectedSkills.has(normalized))
      .sort((a, b) => a[1].localeCompare(b[1])); // Sort by display name
  };

  const handleSkillChange = (index: number, value: string) => {
    if (!Array.isArray(skills)) return;

    const updatedSkills = [...skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      name: value.toLowerCase().trim(),
    };
    setSkills(updatedSkills);
  };

  const handleRatingChange = (index: number, value: number) => {
    if (!Array.isArray(skills)) return;

    const updatedSkills = [...skills];
    updatedSkills[index] = { ...updatedSkills[index], rating: value };
    setSkills(updatedSkills);
  };

  const addSkill = () => {
    if (!Array.isArray(skills)) return;

    // Only add if we haven't reached the maximum number of unique skills
    if (skills.length < skillsMap.size) {
      setSkills([...skills, { name: "", rating: 3 }]);
    }
  };

  const removeSkill = (index: number) => {
    if (!Array.isArray(skills)) return;
    setSkills(skills.filter((_, i) => i !== index));
  };

  const formatDisplayName = (name: string): string => {
    if (!name) return "";

    // Special cases (acronyms)
    const specialCases = ["aws", "ios", "macos", "css", "html", "php"];
    if (specialCases.includes(name.toLowerCase())) {
      return name.toUpperCase();
    }

    // Handle .js cases
    if (name.toLowerCase().endsWith(".js")) {
      const baseName = name.slice(0, -3);
      return baseName.charAt(0).toUpperCase() + baseName.slice(1) + ".js";
    }

    // Default case: capitalize each word
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Add null check for rendering
  if (!Array.isArray(skills)) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Skills</h3>
        <Button
          onClick={addSkill}
          disabled={skills.length >= skillsMap.size}
          className="ml-4"
        >
          Add Skill
        </Button>
      </div>

      <div className="space-y-4">
        {skills.map((skill, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Skill</label>
                  <select
                    value={skill?.name || ""} // Add null check
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    className="w-full rounded-md border border-gray-200 p-2"
                  >
                    {!skill?.name && <option value="">Select a skill</option>}
                    {getAvailableSkills(index).map(([normalized, original]) => (
                      <option key={normalized} value={normalized}>
                        {formatDisplayName(original)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Proficiency Level
                  </label>
                  <select
                    value={skill?.rating || 3} // Add null check and default value
                    onChange={(e) =>
                      handleRatingChange(index, Number(e.target.value))
                    }
                    className="w-full rounded-md border border-gray-200 p-2"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} -{" "}
                        {rating === 1
                          ? "Beginner"
                          : rating === 2
                          ? "Basic"
                          : rating === 3
                          ? "Intermediate"
                          : rating === 4
                          ? "Advanced"
                          : "Expert"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                onClick={() => removeSkill(index)}
                variant="destructive"
                size="sm"
                className="w-full md:w-auto"
              >
                Remove Skill
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
