-- Add support for vetted external jobs that are listed on-platform but applied to on employer sites.
CREATE TYPE "JobApplicationMode" AS ENUM ('INTERNAL', 'EXTERNAL');

ALTER TABLE "JobPost"
ADD COLUMN "applicationMode" "JobApplicationMode" NOT NULL DEFAULT 'INTERNAL',
ADD COLUMN "externalApplyUrl" TEXT,
ADD COLUMN "isVetted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "sourceLabel" TEXT;
