/** @format */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "";

if (!connectionString) {
	console.warn("DATABASE_URL environment variable is not defined.");
}

// prepare: false is required for Neon PgBouncer transaction pooling
const client = postgres(connectionString, { max: 10, prepare: false });
export const db = drizzle(client, { schema });
