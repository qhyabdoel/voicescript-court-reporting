import {
  pgTable,
  varchar,
  boolean,
  numeric,
  timestamp,
  integer,
  pgEnum,
  serial
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const jobStatusEnum = pgEnum("job_status", [
  "NEW",
  "ASSIGNED",
  "TRANSCRIBED",
  "REVIEWED",
  "COMPLETED"
]);

export const roleEnum = pgEnum("role", ["REPORTER", "EDITOR"]);
export const assignmentTypeEnum = pgEnum('assignment_type', ["PHYSICAL", "REMOTE"])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  role: roleEnum('role').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  basePayRate: numeric('base_pay_rate').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  caseName: varchar('case_name', { length: 255 }).notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  assignmentType: assignmentTypeEnum('assignment_type').notNull(),
  city: varchar('city', { length: 100 }), // nullable for remote jobs
  status: jobStatusEnum('status').notNull().default('NEW'),

  // Assignments
  reporterId: integer('reporter_id').references(() => users.id),
  editorId: integer('editor_id').references(() => users.id),

  // Financial snapshots
  reporterRateApplied: numeric('reporter_rate_applied'),
  editorFeeApplied: numeric('editor_fee_applied'),
  totalPayout: numeric('total_payout'),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const jobStatusLogs = pgTable('job_status_logs', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  previousStatus: jobStatusEnum('previous_status'),
  newStatus: jobStatusEnum('new_status'),
  changedAt: timestamp('changed_at', { withTimezone: true }).defaultNow().notNull(),
})

export const userRelations = relations(users, ({ many }) => ({
  reporterJobs: many(jobs, { relationName: 'reporter' }),
  editorJobs: many(jobs, { relationName: 'editor' }),
}))

export const jobRelations = relations(jobs, ({ one, many }) => ({
  reporter: one(users, {
    fields: [jobs.reporterId],
    references: [users.id],
    relationName: 'reporter'
  }),
  editor: one(users, {
    fields: [jobs.editorId],
    references: [users.id],
    relationName: 'editor'
  }),
  statusLogs: many(jobStatusLogs)
}))

export const jobStatusLogsRelations = relations(jobStatusLogs, ({ one }) => ({
  job: one(jobs, {
    fields: [jobStatusLogs.jobId],
    references: [jobs.id]
  })
}))
