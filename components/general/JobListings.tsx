import { prisma } from "@/app/utils/db";
import { EmptyState } from "./EmptyState";
import { JobCard } from "./JobCard";
import { MainPagination } from "./MainPagination";
import { JobPostStatus } from "@prisma/client";
import { AnimatedList } from "./AnimatedList";

async function getData({
  page = 1,
  pageSize = 5,
  jobTypes = [],
  location = "",
}: {
  page: number;
  pageSize: number;
  jobTypes: string[];
  location: string;
}) {
  const skip = (page - 1) * pageSize;

  const where = {
    status: JobPostStatus.ACTIVE,
    ...(jobTypes.length > 0 && {
      employmentType: {
        in: jobTypes,
      },
    }),
    ...(location &&
      location !== "worldwide" && {
        location: location,
      }),
  };

  const [data, totalCount] = await Promise.all([
    prisma.jobPost.findMany({
      where: where,
      take: pageSize,
      skip: skip,
      select: {
        jobTitle: true,
        id: true,
        salaryFrom: true,
        salaryTo: true,
        employmentType: true,
        location: true,
        createdAt: true,
        applicationMode: true,
        externalApplyUrl: true,
        isVetted: true,
        sourceLabel: true,
        Company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.jobPost.count({
      where: where,
    }),
  ]);

  return {
    jobs: data,
    totalPages: Math.ceil(totalCount / pageSize),
    isDatabaseUnavailable: false,
  };
}

export async function JobListings({
  currentPage,
  jobTypes,
  location,
}: {
  currentPage: number;
  jobTypes: string[];
  location: string;
}) {
  const { jobs, totalPages, isDatabaseUnavailable } = await getData({
    page: currentPage,
    pageSize: 6,
    jobTypes: jobTypes,
    location: location,
  }).catch((error) => {
    console.error("Failed to load job listings:", error);

    return {
      jobs: [],
      totalPages: 0,
      isDatabaseUnavailable: true,
    };
  });

  return (
    <>
      {isDatabaseUnavailable ? (
        <EmptyState
          title="Jobs are temporarily unavailable"
          description="We could not connect to the jobs database. Please refresh the page in a moment."
          buttonText="Refresh"
          href="/"
        />
      ) : jobs.length > 0 ? (
        <AnimatedList className="flex flex-col gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </AnimatedList>
      ) : (
        <EmptyState
          title="No jobs found"
          description="Try searching for a diffrent job title or location"
          buttonText="Clear all filters"
          href="/"
        />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <MainPagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      )}
    </>
  );
}
