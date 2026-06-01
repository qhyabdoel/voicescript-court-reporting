CREATE TYPE "public"."job_status" AS ENUM('DRAFT', 'ASSIGNED', 'TRANSCRIBING', 'IN_REVIEW', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('PHYSICAL', 'REMOTE');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('REPORTER', 'EDITOR');--> statement-breakpoint
CREATE TABLE "job_status_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"previous_status" "job_status",
	"new_status" "job_status",
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"case_name" varchar(255) NOT NULL,
	"duration_minutes" integer NOT NULL,
	"job_type" "job_type" NOT NULL,
	"city" varchar(100),
	"status" "job_status" DEFAULT 'DRAFT' NOT NULL,
	"reporter_id" integer,
	"editor_id" integer,
	"reporter_rate_applied" numeric,
	"editor_fee_applied" numeric,
	"total_payout" numeric,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" "role" NOT NULL,
	"city" varchar(100) NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"base_pay_rate" numeric NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "job_status_logs" ADD CONSTRAINT "job_status_logs_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_editor_id_users_id_fk" FOREIGN KEY ("editor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;