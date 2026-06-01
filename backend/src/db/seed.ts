import { db, client } from "./index";
import { users } from "./schema";
import seedData from "../data/users.json"
import type { User } from "../types";

async function main() {
  console.log("⏳ Seeding database with user data...");

  // First, clean up existing users to avoid duplicates if re-running
  console.log("🧹 Cleaning existing users...");
  await db.delete(users);

  console.log(`🌱 Inserting ${seedData.length} users...`);
  const insertedUsers = await db.insert(users).values(seedData as User[]).returning();

  console.log("✅ Database seeded successfully!");
  console.table(
    insertedUsers.map((u) => ({
      ID: u.id,
      Name: u.name,
      Role: u.role,
      City: u.city,
      Available: u.isAvailable,
      "Pay Rate": u.basePayRate,
    }))
  );

  // Close connection pool
  await client.end();
  process.exit(0);
}

main().catch(async (err) => {
  console.error("❌ Seeding failed:");
  console.error(err);
  await client.end();
  process.exit(1);
});
