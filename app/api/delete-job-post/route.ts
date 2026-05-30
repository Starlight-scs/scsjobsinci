import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/db";
import { auth } from "@/app/utils/auth";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json();
  const { id, confirmDelete } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing job post ID." }, { status: 400 });
  }

  if (!confirmDelete) {
    return NextResponse.json({ error: "Delete not confirmed." }, { status: 400 });
  }

  try {
    const jobPost = await prisma.jobPost.findFirst({
      where: {
        id,
        Company: {
          userId: session.user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (!jobPost) {
      return NextResponse.json({ error: "Job post not found." }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.savedJobPost.deleteMany({ where: { jobPostId: id } }),
      prisma.jobApplication.deleteMany({ where: { jobPostId: id } }),
      prisma.application.deleteMany({ where: { jobPostId: id } }),
      prisma.jobPost.delete({ where: { id } }),
    ]);

    return NextResponse.json({ message: "Job post and related applications deleted." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
