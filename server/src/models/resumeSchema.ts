import { z } from "zod";

export const ResumeSchema = z.object({
  name: z.string(),
  contact: z.object({
    email: z.string(),
    phone: z.string(),
    linkedin: z.string().optional(),
    address: z.string().optional(),
    github: z.string().optional(), // GitHub profile URL
    portfolio: z.string().optional(), // Portfolio URL
  }),
  summary: z.string().optional(),
  skills: z.array(z.string()),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      location: z.string(),
      graduationYear: z.number().optional(),
    })
  ),
  experience: z.array(
    z.object({
      jobTitle: z.string(),
      company: z.string(),
      location: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      responsibilities: z.array(z.string()),
    })
  ),
  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string(),
        dateObtained: z.string(),
        expiryDate: z.string().optional(),
      })
    )
    .optional(),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        technologies: z.array(z.string()),
        link: z.string().optional(),
      })
    )
    .optional(),
  languages: z
    .array(
      z.object({
        language: z.string(),
        proficiency: z.string(),
      })
    )
    .optional(),
  awards: z
    .array(
      z.object({
        title: z.string(),
        issuer: z.string(),
        date: z.string(),
        description: z.string().optional(),
      })
    )
    .optional(),
  interests: z.array(z.string()).optional(),
}); 

export type Resume = z.infer<typeof ResumeSchema> | null;
