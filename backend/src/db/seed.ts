import { db, client } from "./index";
import { users } from "./schema";

async function main() {
  console.log("⏳ Seeding database with user data...");

  // First, clean up existing users to avoid duplicates if re-running
  console.log("🧹 Cleaning existing users...");
  await db.delete(users);

  // Insert mock data for reporters and editors
  const seedData = [
    {
      name: "Sarah Jenkins",
      role: "REPORTER" as const,
      city: "New York",
      isAvailable: true,
      basePayRate: "150.00",
    },
    {
      name: "David Chen",
      role: "REPORTER" as const,
      city: "Los Angeles",
      isAvailable: true,
      basePayRate: "165.50",
    },
    {
      name: "Maria Rodriguez",
      role: "REPORTER" as const,
      city: "Chicago",
      isAvailable: false,
      basePayRate: "155.00",
    },
    {
      name: "James Wilson",
      role: "REPORTER" as const,
      city: "Houston",
      isAvailable: true,
      basePayRate: "145.00",
    },
    {
      name: "Emily Taylor",
      role: "EDITOR" as const,
      city: "New York",
      isAvailable: true,
      basePayRate: "85.00",
    },
    {
      name: "Michael Brown",
      role: "EDITOR" as const,
      city: "Chicago",
      isAvailable: true,
      basePayRate: "90.00",
    },
    {
      name: "Jessica Davis",
      role: "EDITOR" as const,
      city: "Los Angeles",
      isAvailable: false,
      basePayRate: "88.50",
    },
  ];

  console.log(`🌱 Inserting ${seedData.length} users...`);
  const insertedUsers = await db.insert(users).values(seedData).returning();

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
