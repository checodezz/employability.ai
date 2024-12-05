// utils/skills.ts
import { Skill } from "@/pages/CompleteProfile"; // Assuming you have a Skill interface defined

export const getAvailableSkills = (
  skills: Skill[],
  skillsList: string[]
): [string, string][] => {
  // Create a map of normalized skills to their original form
  const skillsMap = new Map<string, string>();
  // Remove duplicates by only keeping the first occurrence
  [...new Set(skillsList)].forEach((skill) => {
    if (skill) {
      // Add null check
      const normalized = skill.toLowerCase().trim();
      if (!skillsMap.has(normalized)) {
        skillsMap.set(normalized, skill);
      }
    }
  });

  // Get currently selected skills
  const selectedSkills = new Set(
    skills
      .filter((skill) => skill?.name) // Add null check
      .map((skill) => skill.name.toLowerCase().trim())
  );

  // Return only unselected skills
  return Array.from(skillsMap.entries()).filter(
    ([normalized]) => !selectedSkills.has(normalized)
  );
};

export const formatDisplayName = (name: string): string => {
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
