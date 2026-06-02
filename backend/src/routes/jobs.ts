import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { db } from "../db/index.js";
import { jobs, users } from "../db/schema.js";
import { sql, eq, desc } from "drizzle-orm";
import type { Job, JobStatus } from "types";
import { createJobSchema } from "../schemas/job.schema.js";
import { sendSuccess, sendError } from "../utils/response.js";

type GetJobsRequest = FastifyRequest<{ Querystring: { limit?: string; offset?: string } }>;
type AssignReporterRequest = FastifyRequest<{ Params: { id: number }; Body: { reporterId: number } }>;
type AssignEditorRequest = FastifyRequest<{ Params: { id: number }; Body: { editorId: number } }>;

export async function jobRoutes(app: FastifyInstance) {
  app.get(
    "/",
    async (request: GetJobsRequest, reply: FastifyReply) => {
      try {
        const limit = Math.min(parseInt(request.query.limit || "10"), 100);
        const offset = Math.max(parseInt(request.query.offset || "0"), 0);

        const [jobsData, [{ count }]] = await Promise.all([
          // order by id descending
          (await db.select().from(jobs).orderBy(desc(jobs.id)).limit(limit).offset(offset)),
          db.select({ count: sql<number>`count(*)` }).from(jobs),
        ]);

        return sendSuccess(
          reply,
          {
            data: jobsData,
            pagination: {
              limit,
              offset,
              total: count,
            },
          },
          "Jobs fetched successfully",
        );
      } catch (error) {
        return sendError(reply, request, error, "Failed to get jobs");
      }
    },
  );

  app.post(
    "/",
    { schema: createJobSchema },
    async (request: FastifyRequest<{ Body: Job }>, reply: FastifyReply) => {
      try {
        const { assignmentType, city } = request.body;

        if (assignmentType === 'PHYSICAL' && !city) {
          return sendError(
            reply,
            request,
            new Error("City is required for physical assignment"),
            "Failed to create job",
            400
          );
        }

        const [newJob] = await db.insert(jobs).values(request.body).returning();
        return sendSuccess(reply, newJob, "Job created successfully", 201);
      } catch (error) {
        return sendError(reply, request, error, "Failed to create job");
      }
    },
  );

  app.get(
    "/:id",
    async (request: FastifyRequest<{ Params: { id: number } }>, reply:FastifyReply) => {
      try {
        // TODO: join with users table to get reporter and editor info
        const [job] = await db.select().from(jobs).where(eq(jobs.id, request.params.id)).limit(1);
        return sendSuccess(reply, job, "Job fetched successfully");
      } catch (error) {
        return sendError(reply, request, error, "Failed to get job");
      }
    },
  );

  app.post(
    "/:id/assign-reporter",
    async (request: AssignReporterRequest, reply: FastifyReply) => {
      if (!request.body.reporterId) {
        throw new Error("Reporter ID is required");
      }

      try {
        const reporter = await db.select().from(users).where(eq(users.id, request.body.reporterId)).limit(1);
        if (!reporter) {
          throw new Error("Reporter not found");
        }

        const job = await db.update(jobs).set({
          reporterId: request.body.reporterId,
          status: 'ASSIGNED',
          reporterRateApplied: reporter[0].basePayRate
        }).where(eq(jobs.id, request.params.id)).returning();
        return sendSuccess(reply, job, "Reporter assigned successfully");
      } catch (error) {
        return sendError(reply, request, error, "Failed to assign reporter");
      }
    },
  );

  app.post(
    "/:id/assign-editor",
    async (request: AssignEditorRequest, reply: FastifyReply) => {
      if (!request.body.editorId) {
        throw new Error("Editor ID is required");
      }

      try {
        const editor = await db.select().from(users).where(eq(users.id, request.body.editorId)).limit(1);
        if (!editor) {
          throw new Error("Editor not found");
        }

        const job = await db.update(jobs).set({
          editorId: request.body.editorId,
          editorFeeApplied: editor[0].basePayRate
        }).where(eq(jobs.id, request.params.id)).returning();
        return sendSuccess(reply, job, "Editor assigned successfully");
      } catch (error) {
        return sendError(reply, request, error, "Failed to assign editor");
      }
    },
  );

  app.post(
    "/:id/update-status",
    async (request: FastifyRequest<{ Params: { id: number }; Body: { status: JobStatus } }>, reply: FastifyReply) => {
      if (!request.body.status) {
        throw new Error("Status is required");
      }

      try {
        // if status completed, calculate total payout
        let totalPayout = null;
        if (request.body.status === 'COMPLETED') {
          const job = await db.select().from(jobs).where(eq(jobs.id, request.params.id)).limit(1);

          if (!job[0]) {
            throw new Error("Job not found");
          }

          if (job[0].reporterRateApplied && job[0].editorFeeApplied) {
            totalPayout = job[0].reporterRateApplied + job[0].editorFeeApplied;
          }
        }
        const job = await db.update(jobs).set({
          status: request.body.status,
          totalPayout: totalPayout,
        }).where(eq(jobs.id, request.params.id)).returning();
        return sendSuccess(reply, job, "Status updated successfully");
      } catch (error) {
        return sendError(reply, request, error, "Failed to update status");
      }
    },
  );
}
