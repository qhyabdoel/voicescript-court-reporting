import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { db } from "../db/index.js";
import { jobs, users } from "../db/schema.js";
import { sql, eq } from "drizzle-orm";
import type { Job } from "types";
import { createJobSchema } from "../schemas/job.schema.js";
import { sendSuccess, sendError } from "../utils/response.js";

type GetJobsRequest = FastifyRequest<{ Querystring: { limit?: string; offset?: string } }>;
type AssignReporterRequest = FastifyRequest<{ Params: { id: number }; Body: { reporterId: number } }>;

export async function jobRoutes(app: FastifyInstance) {
  app.get(
    "/",
    async (request: GetJobsRequest, reply: FastifyReply) => {
      try {
        const limit = Math.min(parseInt(request.query.limit || "10"), 100);
        const offset = Math.max(parseInt(request.query.offset || "0"), 0);

        const [jobsData, [{ count }]] = await Promise.all([
          db.select().from(jobs).limit(limit).offset(offset),
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
}
