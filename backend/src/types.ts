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
  type: "PHYSICAL" | "REMOTE";
  city?: string;
  status?: "NEW" | "ASSIGNED" | "TRANSCRIBED" | "REVIEWED" | "COMPLETED";
  reporterId?: number;
  editorId?: number;
  reporterRateApplied?: string;
  editorFeeApplied?: string;
  totalPayout?: string;
}