// app/(mainLayout)/my-applications/page.tsx

import { requireUser } from "@/app/utils/requireUser";
import { prisma } from "@/app/utils/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import Link from "next/link";

export default async function MyApplicationsPage() {
  const user = await requireUser();

  const applications = await prisma.jobApplication.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      jobPost: {
        select: {
          jobTitle: true,
          employmentType: true,
          location: true,
          Company: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <h1 className="text-3xl font-bold">My Applications</h1>

      {applications.length === 0 ? (
        <p className="text-muted-foreground">
          You have not submitted any job applications yet.
        </p>
      ) : (
        <ul className="space-y-6">
          {applications.map((app: {
            id: string;
            createdAt: Date;
            resume: string;
            coverLetter: string;
            jobPost: {
              jobTitle: string;
              employmentType: string;
              location: string;
              Company: {
                name: string;
              };
            };
          }) => (
            <li
              key={app.id}
              className="bg-card border border-border rounded-lg p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-semibold">
                    {app.jobPost.jobTitle}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {app.jobPost.Company.name} • {app.jobPost.location}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {app.jobPost.employmentType}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="text-destructive hover:text-destructive"
                  >
                    <Link href={`/my-applications/${app.id}/delete`}>
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </Link>
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                Submitted on{" "}
                {new Date(app.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <a
                  href={app.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  View Resume
                </a>
                <a
                  href={app.coverLetter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  View Cover Letter
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}