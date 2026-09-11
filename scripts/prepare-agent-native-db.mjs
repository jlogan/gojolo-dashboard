import postgres from "postgres";

const rawDatabaseUrl = process.env.DATABASE_URL;
const schema = process.env.AGENT_NATIVE_DB_SCHEMA || "agent_native";

if (!rawDatabaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

if (!/^[a-z_][a-z0-9_]*$/i.test(schema)) {
  console.error("AGENT_NATIVE_DB_SCHEMA must be a simple PostgreSQL identifier");
  process.exit(1);
}

const admin = postgres(rawDatabaseUrl, {
  max: 1,
  idle_timeout: 1,
  connect_timeout: 10,
  prepare: false,
});

try {
  await admin.unsafe(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
} finally {
  await admin.end({ timeout: 5 });
}

const scoped = new URL(rawDatabaseUrl);
scoped.searchParams.set("options", `--search_path=${schema},public`);
process.stdout.write(scoped.toString());
