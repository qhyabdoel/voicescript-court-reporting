import { Job } from "types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function getJobs(limit: number = 10, offset: number = 0) {
  const response = await fetch(
    `${API_URL}/jobs?limit=${limit}&offset=${offset}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch jobs: ${response.statusText}`);
  }
  return response.json();
}

export async function createJob(jobData: Job) {
  const response = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to create job");
  }

  return data;
}

export async function getJobById(id: string) {
  console.log({ id });
  const response = await fetch(`${API_URL}/jobs/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch job: ${response.statusText}`);
  }
  return response.json();
}
