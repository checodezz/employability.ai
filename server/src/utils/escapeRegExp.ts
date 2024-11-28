// src/utils/escapeRegExp.ts

/**
 * Escapes special characters in a string to be used in a regex.
 * @param string - The string to escape.
 * @returns The escaped string.
 */
export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};
