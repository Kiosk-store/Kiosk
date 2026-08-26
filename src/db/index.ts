/** @format */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "";

if (!connectionString) {
	console.warn("DATABASE_URL environment variable is not defined.");
}

// prepare: false is required for Neon PgBouncer transaction pooling
// ssl: "require" is required for Neon AWS cloud connections
const client = postgres(connectionString, {
	max: process.env.NODE_ENV === "production" ? 5 : 10,
	prepare: false,
	ssl: "require",
	connect_timeout: 10,
});

export const db = drizzle(client, { schema });
