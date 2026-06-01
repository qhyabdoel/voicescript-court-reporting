import { FastifyInstance } from "fastify";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";

export async function editorRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    // Get all editors
    const editors = await db.select().from(users).where(eq(users.role, "EDITOR"));
    return editors;
  });
}