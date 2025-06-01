// app/api/delete-job-post/route.ts (or pages/api/delete-job-post.ts for older versions)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/db"; // adjust if needed

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, confirmDelete } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing job post ID." }, { status: 400 });
  }

  if (!confirmDelete) {
    return NextResponse.json({ error: "Delete not confirmed." }, { status: 400 });
  }

  try {
    const jobPost = await prisma.jobPost.findUnique({ where: { id } });

    if (!jobPost) {
      return NextResponse.json({ error: "Job post not found." }, { status: 404 });
    }

    // Delete associated applications first
    await prisma.jobApplication.deleteMany({
      where: { jobPostId: id },
    });

    // Then delete the job post
    await prisma.jobPost.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Job post and related applications deleted." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
