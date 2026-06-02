export type User = {
  name: string;
  role: "REPORTER" | "EDITOR";
  city: string;
  isAvailable: boolean;
  basePayRate: string;
};

export type Job = {
  id?: number;
  caseName: string;
  durationMinutes: number;
  assignmentType: "PHYSICAL" | "REMOTE";
  city?: string;
  status?: "NEW" | "ASSIGNED" | "TRANSCRIBED" | "REVIEWED" | "COMPLETED";
  reporterId?: number;
  editorId?: number;
  reporterRateApplied?: string;
  editorFeeApplied?: string;
  totalPayout?: string;
  createdAt?: Date;
};
