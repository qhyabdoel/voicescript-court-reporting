export type User = {
  name: string;
  role: "REPORTER" | "EDITOR";
  city: string;
  isAvailable: boolean;
  basePayRate: string;
}

export type Job = {
  caseName: string;
  durationMinutes: number;
  jobType: "PHYSICAL" | "REMOTE";
  city?: string;
  status?: "DRAFT" | "ASSIGNED" | "TRANSCRIBING" | "IN_REVIEW" | "COMPLETED";
  reporterId?: number;
  editorId?: number;
  reporterRateApplied?: string;
  editorFeeApplied?: string;
  totalPayout?: string;
}