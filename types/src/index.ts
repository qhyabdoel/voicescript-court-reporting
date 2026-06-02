export type User = {
  id: number;
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
  status?: JobStatus;
  reporterId?: number;
  editorId?: number;
  reporterRateApplied?: string;
  editorFeeApplied?: string;
  totalPayout?: string;
  createdAt?: Date;
  reporter: User;
  editor?: User;
};

export type JobStatus = "NEW" | "ASSIGNED" | "TRANSCRIBED" | "REVIEWED" | "COMPLETED";
