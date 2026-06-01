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
    async (request) => {
      // Create a new job
      const job = await db.insert(jobs).values(request.body);
      return job;
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
