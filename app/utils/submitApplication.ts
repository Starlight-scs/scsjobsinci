// Create a schema for form validation with zod (recommended with shadcn)
// lib/schemas/application-schema.js
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const applicationSchema = z.object({
  resume: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Resume is required")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must be less than 5MB"
    )
    .refine(
      (file) => file.type === "application/pdf",
      "Only PDF files are accepted"
    ),
  coverLetter: z.string().optional(),
});
