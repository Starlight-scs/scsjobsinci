// server/actions/submitApplication.ts
"use server";

import { prisma } from "@/app/utils/db";
import { z } from "zod";
import { requireUser } from "@/app/utils/requireUser";

const applicationSchema = z.object({
  jobId: z.string().min(1),
  employmentType: z.string().min(1),
  resume: z.string().url(),
  coverLetter: z.string().url(), // changed to .url() for PDF consistency
});

export async function submitApplication(data: z.infer<typeof applicationSchema>) {
  const user = await requireUser();
  const validated = applicationSchema.parse(data);

  try {
    await prisma.jobApplication.create({
      data: {
        jobPost: { connect: { id: validated.jobId } },
        user: { connect: { id: user.id } },
        employmentType: validated.employmentType,
        resume: validated.resume,
        coverLetter: validated.coverLetter,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit application:", error);
    return { success: false, error: "Something went wrong." };
  }
}
