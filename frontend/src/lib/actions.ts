"use server";

import { redirect } from "next/navigation";
import { createJob } from "./api";
import type { Job } from "types";

export async function createJobAction(
  prevState: { error?: string, data?: Job },
  formData: FormData) {
  const caseName = formData.get("caseName") as string;
  const durationMinutes = formData.get("durationMinutes") as string;
  const assignmentType = formData.get("assignmentType") as "PHYSICAL" | "REMOTE";
  const city = formData.get("city") as string;

  const jobData = {
    caseName,
    durationMinutes: parseInt(durationMinutes),
    assignmentType,
    city: city || undefined,
  };

  if (!caseName || !durationMinutes || !assignmentType) {
    return { error: "Missing required fields", data: jobData };
  }

  try {
    const response = await createJob(jobData);
    console.log("Create Job Response:", response);
    if (!response.success) {
      const errorMsg = response.error || "Failed to create job";
      return { error: errorMsg, data: jobData };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to create job:", errorMessage);
    return { error: errorMessage, data: jobData };
  }

  redirect("/jobs");
}
