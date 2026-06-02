import { Job, JobStatus } from "types";

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
  // console.log({ id });
  const response = await fetch(`${API_URL}/jobs/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch job: ${response.statusText}`);
  }
  return response.json();
}

export async function getReporters(city?: string) {
  const url = city ? `${API_URL}/reporters?city=${encodeURIComponent(city)}` : `${API_URL}/reporters`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch reporters: ${response.statusText}`);
  }
  return response.json();
}

export async function assignReporter(jobId: string, reporterId: number) {
  const response = await fetch(`${API_URL}/jobs/${jobId}/assign-reporter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reporterId }),
  });

  const data = await response.json();

  console.log({ data });

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to assign reporter");
  }

  return data;
}

export async function getEditors() {
  const response = await fetch(`${API_URL}/editors`);
  if (!response.ok) {
    throw new Error(`Failed to fetch editors: ${response.statusText}`);
  }
  return response.json();
}

export async function assignEditor(jobId: string, editorId: number) {
  const response = await fetch(`${API_URL}/jobs/${jobId}/assign-editor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ editorId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to assign editor");
  }

  return data;
}

export async function updateJobStatus(jobId: string, status: JobStatus) {
  const response = await fetch(`${API_URL}/jobs/${jobId}/update-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to update job status");
  }

  return data;
}
