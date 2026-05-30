"use client";

import Link from "next/link";
import { Card, CardHeader } from "../ui/card";
import { ExternalLink, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";
import { motion } from "framer-motion";

interface iAppProps {
  job: {
    id: string;
    createdAt: Date;
    Company: {
      about: string;
      name: string;
      location: string;
      logo: string;
    };
    jobTitle: string;
    employmentType: string;
    location: string;
    salaryFrom: number;
    salaryTo: number;
    applicationMode: "INTERNAL" | "EXTERNAL";
    externalApplyUrl: string | null;
    isVetted: boolean;
    sourceLabel: string | null;
  };
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function JobCard({ job }: iAppProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5 }}
    >
      <Link href={`/job/${job.id}`}>
        <Card className="hover:shadow-xl transition-all duration-300 hover:border-primary/50 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <Image
                src={job.Company.logo}
                alt={job.Company.name}
                width={48}
                height={48}
                className="size-12 rounded-lg"
              />

              <div>
                <h1 className="text-xl md:text-2xl font-bold">{job.jobTitle}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {job.Company.name}
                  </p>
                  <span className="hidden md:inline text-muted-foreground">
                    *
                  </span>
                  <Badge className="rounded-full" variant="secondary">
                    {job.employmentType}
                  </Badge>
                  <span className="hidden md:inline text-muted-foreground">
                    *
                  </span>
                  <Badge className="rounded-full">{job.location}</Badge>
                  {job.isVetted && (
                    <Badge className="rounded-full gap-1" variant="outline">
                      <ShieldCheck className="size-3" />
                      Vetted
                    </Badge>
                  )}
                  {job.applicationMode === "EXTERNAL" && (
                    <Badge className="rounded-full gap-1" variant="secondary">
                      <ExternalLink className="size-3" />
                      Employer site
                    </Badge>
                  )}

                  <span className="hidden md:inline text-muted-foreground">
                    *
                  </span>

                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(job.salaryFrom)} -{" "}
                    {formatCurrency(job.salaryTo)}
                  </p>
                </div>
              </div>

              <div className="md:ml-auto text-right">
                <div className="flex items-center gap-2 justify-end">
                  <MapPin className="size-4" />
                  <h1 className="text-sm font-medium">{job.location}</h1>
                </div>

                <p className="text-sm text-muted-foreground md:text-right">
                  {formatRelativeTime(job.createdAt)}
                </p>
                {job.sourceLabel && (
                  <p className="text-xs text-muted-foreground md:text-right">
                    {job.sourceLabel}
                  </p>
                )}
              </div>
            </div>

            <p className="text-base text-muted-foreground line-clamp-2 !mt-5">
              {job.Company.about}
            </p>
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  );
}
