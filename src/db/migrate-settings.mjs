import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const sql = postgres(process.env.DATABASE_URL || "", { prepare: false });

async function main() {
  try {
    console.log("Checking and updating database schema for settings...");

    // 1. Add phone column to users table if not exists
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS phone text;
    `;
    console.log("✓ Checked/added phone column on users table");

    // 2. Add emailNotifications column to users table if not exists
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "emailNotifications" boolean DEFAULT true NOT NULL;
    `;
    console.log("✓ Checked/added emailNotifications column on users table");

    // 3. Add projectUpdates column to users table if not exists
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "projectUpdates" boolean DEFAULT true NOT NULL;
    `;
    console.log("✓ Checked/added projectUpdates column on users table");

    const userCols = await sql`
      SELECT column_name, data_type, column_default, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `;
    console.log("UPDATED USERS COLUMNS:", userCols.map(c => c.column_name));

  } catch (err) {
    console.error("DB SCHEMA UPDATE ERROR:", err);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

main();
