/** @format */

const fs = require("fs");
const path = require("path");
const postgres = require("postgres");

const envPath = path.resolve(process.cwd(), ".env.local");
let dbUrl = "";

if (fs.existsSync(envPath)) {
	const lines = fs.readFileSync(envPath, "utf8").split("\n");
	for (const line of lines) {
		const trimmed = line.trim();
		if (trimmed.startsWith("DATABASE_URL=")) {
			dbUrl = trimmed.substring("DATABASE_URL=".length).replace(/^["']|["']$/g, "");
			break;
		}
	}
}

const sql = postgres(dbUrl, { max: 1, ssl: "require", prepare: false });

async function check() {
	console.log("--- USERS ---");
	const users = await sql`SELECT id, name, email, role FROM users`;
	console.log(users);

	console.log("--- TENANTS ---");
	const tenants = await sql`SELECT id, "ownerId", name, slug, plan, "billingStatus" FROM tenants`;
	console.log(tenants);

	console.log("--- PROJECTS ---");
	const projects = await sql`SELECT id, "tenantId", name, type, status, progress, "publishedUrl" FROM projects`;
	console.log(projects);

	console.log("--- SUBSCRIPTIONS ---");
	const subs = await sql`SELECT id, "tenantId", "planId", "billingCycle", status FROM subscriptions`;
	console.log(subs);

	await sql.end();
}

check();
