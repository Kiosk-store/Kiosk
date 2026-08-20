import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const sql = postgres(process.env.DATABASE_URL || "", { prepare: false });

async function main() {
  try {
    console.log("Migrating database for multi-method scheduled invoicing...");

    // 1. Update tenants table
    await sql`
      ALTER TABLE tenants 
      ADD COLUMN IF NOT EXISTS "billingStatus" text DEFAULT 'ACTIVE' NOT NULL;
    `;
    await sql`
      ALTER TABLE tenants 
      ADD COLUMN IF NOT EXISTS "currentPeriodEnd" timestamp;
    `;
    await sql`
      ALTER TABLE tenants 
      ADD COLUMN IF NOT EXISTS "gracePeriodEnd" timestamp;
    `;
    console.log("✓ Updated tenants table with billing fields");

    // 2. Create invoices table
    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id text PRIMARY KEY,
        "invoiceNumber" text NOT NULL UNIQUE,
        "tenantId" text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        "userId" text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan text NOT NULL,
        "billingCycle" text DEFAULT 'monthly' NOT NULL,
        type text DEFAULT 'RECURRING_HOSTING' NOT NULL,
        amount integer NOT NULL,
        currency text DEFAULT 'USD' NOT NULL,
        status text DEFAULT 'PENDING' NOT NULL,
        "paymentLink" text,
        "txRef" text UNIQUE,
        "paymentMethod" text,
        "dueDate" timestamp NOT NULL,
        "gracePeriodEnd" timestamp NOT NULL,
        "paidAt" timestamp,
        "remindersSent" integer DEFAULT 0 NOT NULL,
        "createdAt" timestamp DEFAULT now() NOT NULL,
        "updatedAt" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log("✓ Created invoices table in Neon PostgreSQL");

    const invoiceCols = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'invoices';
    `;
    console.log("INVOICE COLUMNS:", invoiceCols.map(c => c.column_name));
  } catch (err) {
    console.error("MIGRATION ERROR:", err);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

main();
