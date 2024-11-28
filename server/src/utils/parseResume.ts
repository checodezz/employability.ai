// src/utils/parseResume.ts

import fs from "fs";
import pdfParse from "pdf-parse";

/**
 * Interface representing the parsed data from the resume.
 */
interface ParsedData {
  fullText: string; // Complete text extracted from the resume PDF
}

/**
 * Parses a resume PDF to extract its full text.
 *
 * @param filePath - The path to the uploaded PDF file.
 * @returns An object containing the extracted full text.
 * @throws Will throw an error if the file cannot be read or parsed.
 */
export const parseResume = async (filePath: string): Promise<ParsedData> => {
  try {
    // Read the PDF file as a buffer
    const dataBuffer = fs.readFileSync(filePath);

    // Parse the PDF buffer to extract text
    const data = await pdfParse(dataBuffer);
    const text = data.text;
    // console.log(text);

    // Construct the parsed data object
    const parsedData: ParsedData = {
      fullText: text,
    };

    console.log(parsedData);
    return parsedData;
  } catch (error) {
    console.error("Error during resume parsing:", error);
    throw new Error(
      "Failed to parse resume. Please ensure the PDF is not corrupted and follows standard formatting."
    );
  }
};
