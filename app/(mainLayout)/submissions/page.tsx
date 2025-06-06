// app/(mainLayout)/submissions/page.tsx

import { requireUser } from "@/app/utils/requireUser";
import { prisma } from "@/app/utils/db";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {Avatar, AvatarImage} from "@/components/ui/avatar";

export default async function SubmissionsPage() {
  const session = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      userType: true,
      id: true,
    },
  });

  if (user?.userType !== "COMPANY") {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <p className="text-center text-muted-foreground">
          You are not authorized to view this page.
        </p>
      </div>
    );
  }

  const company = await prisma.company.findFirstOrThrow({
    where: { userId: user.id },
    select: { id: true },
  });

  const applications = await prisma.jobApplication.findMany({
    where: {
      jobPost: {
        companyId: company.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          JobSeeker: {
            select: {
              about: true,
              resume: true,
              coverLetter: true,
            },
          },
        },
      },
      jobPost: {
        select: {
          jobTitle: true,
          employmentType: true,
        },
      },
    },
  });


  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {applications.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No applications have been submitted yet.
            </p>
          ) : (
            applications.map((app: typeof applications[0]) => (
              <div
                key={app.id}
                className="border border-border p-4 rounded-lg shadow-sm bg-card space-y-3"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                   <AvatarImage src={app.user.image || "/default-profile.png"} alt="Profile Image" />
                   </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {app.user.name || "Anonymous"}
                    </h3>
                    <Badge variant="secondary" className="mt-1">
                      {app.jobPost.jobTitle} • {app.jobPost.employmentType}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Bio:</span>{" "}
                  {app.user.JobSeeker?.about || "N/A"}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  {app.user.JobSeeker?.resume && (
                    <Link
                      href={app.user.JobSeeker.resume}
                      target="_blank"
                      className="text-primary underline text-sm"
                    >
                      View Resume
                    </Link>
                  )}
                  {app.user.JobSeeker?.coverLetter && (
                    <Link
                      href={app.user.JobSeeker.coverLetter}
                      target="_blank"
                      className="text-primary underline text-sm"
                    >
                      View Cover Letter
                    </Link>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Applied on{" "}
                  {new Date(app.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
