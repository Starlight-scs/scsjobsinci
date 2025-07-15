// server/actions/submitApplication.ts
"use server";

import { prisma } from "@/app/utils/db";
import { z } from "zod";
import { requireUser } from "@/app/utils/requireUser";
import { revalidatePath } from "next/cache";

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
    // Check if user has already applied to this job 3 times
    const existingApplicationsCount = await prisma.jobApplication.count({
      where: {
        userId: user.id,
        jobPostId: validated.jobId,
      },
    });

    if (existingApplicationsCount >= 1) {
      return {
        success: false,
        error: "You have reached the maximum number of applications (1) for this job.",
      };
    }

    // Check if job post exists and is active
    const jobPost = await prisma.jobPost.findUnique({
      where: { id: validated.jobId },
      select: {
        id: true,
        status: true,
        jobTitle: true,
      },
    });

    if (!jobPost) {
      return {
        success: false,
        error: "Job post not found.",
      };
    }

    if (jobPost.status !== "ACTIVE") {
      return {
        success: false,
        error: "This job is no longer accepting applications.",
      };
    }

    // Create the application
    await prisma.jobApplication.create({
      data: {
        jobPost: { connect: { id: validated.jobId } },
        user: { connect: { id: user.id } },
        employmentType: validated.employmentType,
        resume: validated.resume,
        coverLetter: validated.coverLetter,
      },
    });

    // Revalidate relevant paths
    revalidatePath(`/job/${validated.jobId}`);
    revalidatePath("/my-applications");

    return { success: true };
  } catch (error) {
    console.error("Failed to submit application:", error);
    return { success: false, error: "Something went wrong." };
  }
}