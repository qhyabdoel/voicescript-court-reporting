import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://admin:password@localhost:5432/court-reporting";

export const client = postgres(connectionString);
export const db = drizzle(client, { schema });
