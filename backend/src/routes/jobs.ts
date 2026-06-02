import { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { jobs } from "../db/schema.js";
import { sql, eq } from "drizzle-orm";
import type { Job } from "types";
import { createJobSchema } from "../schemas/job.schema.js";
import { sendSuccess, sendError } from "../utils/response.js";

export async function jobRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { limit?: string; offset?: string } }>(
    "/",
    async (request, reply) => {
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

  app.post<{ Body: Job }>(
    "/",
    { schema: createJobSchema },
    async (request, reply) => {
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

  app.get<{ Params: { id: number } }>(
    "/:id",
    async (request, reply) => {
      try {
        const [job] = await db.select().from(jobs).where(eq(jobs.id, request.params.id)).limit(1);
        return sendSuccess(reply, job, "Job fetched successfully");
      } catch (error) {
        return sendError(reply, request, error, "Failed to get job");
      }
    },
  );

  app.post<{ Params: { id: number }; Body: { reporterId: number } }>(
    "/:id/assign-reporter",
    async (request) => {
      return {
        jobId: request.params.id,
        reporterId: request.body.reporterId,
      };
    },
  );
}
