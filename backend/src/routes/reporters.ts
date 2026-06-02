import { FastifyInstance } from "fastify";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";

export async function reporterRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const { city } = request.query as { city?: string };

    // Get all reporters
    const reporters = await db.select().from(users).where(eq(users.role, "REPORTER"));

    // If city query exists, sort reporters with matching city first
    if (city) {
      reporters.sort((a, b) => {
        const aMatch = a.city.toLowerCase() === city.toLowerCase();
        const bMatch = b.city.toLowerCase() === city.toLowerCase();
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
    }

    return reporters;
  });
}

export async function editorRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    // Get all editors
    const editors = await db.select().from(users).where(eq(users.role, "EDITOR"));
    return editors;
  });
}