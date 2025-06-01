"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitApplication } from "@/app/utils/submitApplication";
import { GeneralSubmitButton } from "@/components/general/SubmitButtons";

interface ApplyNowFormProps {
  jobId: string;
  employmentType: string;
  resume: string;
  coverLetter: string;
  name?: string | null;
  jobTitle?: string;
}

export function ApplyNowForm({
  jobId,
  employmentType,
  resume,
  coverLetter,
}: ApplyNowFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const result = await submitApplication({
          jobId,
          employmentType,
          resume,
          coverLetter,
        });

        if (result.success) {
          toast.success("Application submitted successfully!");
          router.push("/my-applications");
        } else {
          toast.error(result.error || "Failed to submit application.");
        }
      } catch (err) {
        toast.error("Something went wrong submitting your application.");
        console.error(err);
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="jobId" value={jobId} />
      <GeneralSubmitButton text={isPending ? "Submitting..." : "Apply Now"}  />
    </form>
  );
}
