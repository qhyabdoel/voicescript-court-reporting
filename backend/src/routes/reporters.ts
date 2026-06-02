import { FastifyInstance } from "fastify";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";

export async function reporterRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const { city } = request.query as { city?: string };

    // Get all reporters
    const reporters = await db.select().from(users).where(eq(users.role, "REPORTER"));
    return reporters;
  });
}