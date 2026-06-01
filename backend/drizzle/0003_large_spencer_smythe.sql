ALTER TYPE "public"."job_type" RENAME TO "assignment_type";--> statement-breakpoint
ALTER TABLE "jobs" RENAME COLUMN "type" TO "assignment_type";