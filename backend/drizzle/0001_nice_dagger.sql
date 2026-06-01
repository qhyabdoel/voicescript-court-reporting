ALTER TABLE "jobs" ALTER COLUMN "status" SET DEFAULT 'NEW';--> statement-breakpoint
ALTER TABLE "public"."job_status_logs" ALTER COLUMN "previous_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."job_status_logs" ALTER COLUMN "new_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."jobs" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."job_status";--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('NEW', 'ASSIGNED', 'TRANSCRIBED', 'REVIEWED', 'COMPLETED');--> statement-breakpoint
ALTER TABLE "public"."job_status_logs" ALTER COLUMN "previous_status" SET DATA TYPE "public"."job_status" USING "previous_status"::"public"."job_status";--> statement-breakpoint
ALTER TABLE "public"."job_status_logs" ALTER COLUMN "new_status" SET DATA TYPE "public"."job_status" USING "new_status"::"public"."job_status";--> statement-breakpoint
ALTER TABLE "public"."jobs" ALTER COLUMN "status" SET DATA TYPE "public"."job_status" USING "status"::"public"."job_status";