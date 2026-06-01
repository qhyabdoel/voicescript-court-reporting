import { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { jobs } from "../db/schema.js";
import type { Job } from "../types.js";
import { createJobSchema } from "../schemas/job.schema.js";

export async function jobRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    // Get all jobs
    const jobsData = await db.select().from(jobs);
    return jobsData;
  });

  app.post<{ Body: Job }>(
    "/",
    { schema: createJobSchema },
    async (request, reply) => {
      try {
        // Create a new job and return the inserted row
        const insertedJobs = await db.insert(jobs).values(request.body).returning();
        const newJob = insertedJobs[0];

        return reply.status(201).send({
          success: true,
          message: "Job created successfully",
          data: {
            id: newJob.id,
            caseName: newJob.caseName,
            durationMinutes: newJob.durationMinutes,
            type: newJob.type,
            city: newJob.city,
            status: newJob.status,
          },
        });
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({
          success: false,
          message: "Failed to create job",
          error: error instanceof Error ? error.message : "Unknown error",
        });
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
