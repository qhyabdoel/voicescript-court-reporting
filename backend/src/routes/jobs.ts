import { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { jobs } from "../db/schema.js";
import type { Job } from "../types.js";
import { createJobSchema } from "../schemas/job.schema.js";
import { sendSuccess, sendError } from "../utils/response.js";

export async function jobRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    try {
      const jobsData = await db.select().from(jobs);
      return sendSuccess(reply, jobsData, "Jobs fetched successfully");
    } catch (error) {
      return sendError(reply, request, error, "Failed to get jobs");
    }
  });

  app.post<{ Body: Job }>(
    "/",
    { schema: createJobSchema },
    async (request, reply) => {
      try {
        const [newJob] = await db.insert(jobs).values(request.body).returning();
        return sendSuccess(reply, newJob, "Job created successfully", 201);
      } catch (error) {
        return sendError(reply, request, error, "Failed to create job");
      }
    }
  );

  app.post<{ Params: { id: number }, Body: { reporterId: number } }>(
    "/:id/assign-reporter",
    async (request) => {
      return {
        jobId: request.params.id,
        reporterId: request.body.reporterId,
      }
    }
  )
}
