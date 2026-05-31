import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// 1. Rigorous System Enums enforced via TypeScript strings
export const JOB_STATUSES = [
  "DRAFT",
  "ASSIGNED",
  "TRANSCRIBING",
  "IN_REVIEW",
  "COMPLETED",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const JOB_TYPES = ["PHYSICAL", "REMOTE"] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const ASSIGNMENT_TYPES = ["PHYSICAL_MATCH", "REMOTE_OVERRIDE"] as const;

/**
 * REPORTERS TABLE
 * Stores court reporter information, physical location, and availability metrics.
 */
export const reporters = sqliteTable("reporters", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(), // Required for "Same City" smart matching logic
  isAvailable: integer("is_available", { mode: "boolean" })
    .default(true)
    .notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});

/**
 * EDITORS TABLE
 * Track legal editors responsible for the review phase post-transcription.
 */
export const editors = sqliteTable("editors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  isAvailable: integer("is_available", { mode: "boolean" })
    .default(true)
    .notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});

/**
 * JOBS TABLE
 * Core operational ledger mapping job execution states, pricing metadata, and assignments.
 */
export const jobs = sqliteTable("jobs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),

  // Workflow Architecture
  type: text("type", { enum: JOB_TYPES }).notNull(), // PHYSICAL or REMOTE
  status: text("status", { enum: JOB_STATUSES }).default("DRAFT").notNull(),
  city: text("city").notNull(), // The venue city (maps against reporter.city if physical)

  // Relations / Assignments
  reporterId: text("reporter_id").references(() => reporters.id),
  editorId: text("editor_id").references(() => editors.id),
  reporterAssignmentType: text("reporter_assignment_type", {
    enum: ASSIGNMENT_TYPES,
  }),

  // Financial Metrics (Automated Payout Tracker)
  audioDurationMinutes: real("audio_duration_minutes").default(0.0).notNull(),
  baseRatePerMinute: real("base_rate_per_minute").default(2.5).notNull(), // Custom contract baseline
  calculatedPayout: real("calculated_payout").default(0.0).notNull(), // Generated via route calculator
  isPaid: integer("is_paid", { mode: "boolean" }).default(false).notNull(),

  // Auditing
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP").notNull(),
});
