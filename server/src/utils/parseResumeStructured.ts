import OpenAI from "openai";
// import { ResumeSchema } from "./schemas/resumeSchema"; // Path to your schema
import { ResumeSchema } from "../models/resumeSchema";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();

export const parseResumeWithOpenAI = async (resumeText: string) => {
  try {
    // Create a chat-based request to OpenAI with the system instruction to extract the resume data
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06", // Specify the correct model you are using
      messages: [
        {
          role: "system",
          content:
            "Extract the resume information in a structured format using the following schema but try to extract the exact info from the resume like name email and all, don't give random names and mail ids.",
        },
        { role: "user", content: resumeText }, // The resume text you want to parse
      ],
      response_format: zodResponseFormat(ResumeSchema, "resume"), // Using your ResumeSchema to parse the data
    });

    const parsedResume = completion.choices[0].message.parsed;
    console.log("Parsed Resume:", parsedResume); // Log the parsed result

    return parsedResume;
  } catch (error) {
    console.error(
      "Error parsing resume with OpenAI Structured Outputs:",
      error
    );
    throw new Error("Failed to parse resume using OpenAI.");
  }
};
