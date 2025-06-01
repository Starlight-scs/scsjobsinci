"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/components/general/UploadThingReexported";
import { XIcon } from "lucide-react";
import Image from "next/image";
import PdfImage from "@/public/pdf.png";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// --- Schema ---
const applicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  employmentType: z.string().min(1, "Employment type is required"),
  resume: z.string().url("Resume upload is required"),
  coverLetter: z.string().min(10, "Please provide a brief cover letter"),
});

type ApplicationSchema = z.infer<typeof applicationSchema>;

// --- Replace with your server action ---
async function submitApplication(data: ApplicationSchema) {
  // Send to your server or action route
  console.log("Submitting application:", data);
}

export function JobApplicationForm({
  jobId,
  employmentType,
}: {
  jobId: string;
  employmentType: string;
}) {
  const form = useForm<ApplicationSchema>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      jobId,
      employmentType,
      resume: "",
      coverLetter: "",
    },
  });

  const [pending, setPending] = useState(false);

  async function onSubmit(data: ApplicationSchema) {
    try {
      setPending(true);
      await submitApplication(data);
      // Optionally redirect or toast on success
    } catch (error) {
      console.error("Application failed", error);
    } finally {
      setPending(false);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your short cover letter..."
                  {...field}
                  className="min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume (PDF)</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={PdfImage}
                        alt="Uploaded Resume"
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2"
                        onClick={() => field.onChange("")}
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="resumeUploader"
                      onClientUploadComplete={(res) =>
                        field.onChange(res[0].url)
                      }
                      onUploadError={() =>
                        console.log("Upload failed. Try again.")
                      }
                      className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 border-primary"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Submitting Application..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  );
}
