import fs from "fs";
import path from "path";
import pg from "pg";

const outDir = path.resolve("graphify-out");
fs.mkdirSync(outDir, { recursive: true });

const oldUrl = process.env.OLD_DATABASE_URL;
const newUrl = process.env.NEW_DATABASE_URL;

if (!oldUrl || !newUrl) {
  console.error("Set OLD_DATABASE_URL and NEW_DATABASE_URL");
  process.exit(1);
}

async function dump(client, label) {
  const tables = await client.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='public'`,
  );
  console.log(`${label} tables:`, tables.rows.map((r) => r.table_name));

  let siteContent = [];
  let submissions = [];

  try {
    const content = await client.query(
      `SELECT id, data, "updatedAt" FROM "SiteContent"`,
    );
    siteContent = content.rows;
    console.log(`${label} SiteContent rows:`, content.rowCount);
  } catch (e) {
    console.log(`${label} SiteContent:`, e.message);
  }

  try {
    const subs = await client.query(
      `SELECT id, name, email, service, message, read, "createdAt" FROM "Submission" ORDER BY "createdAt"`,
    );
    submissions = subs.rows;
    console.log(`${label} Submission rows:`, subs.rowCount);
  } catch (e) {
    console.log(`${label} Submission:`, e.message);
  }

  return { siteContent, submissions };
}

const oldClient = new pg.Client({
  connectionString: oldUrl,
  ssl: { rejectUnauthorized: false },
});
const newClient = new pg.Client({
  connectionString: newUrl,
  ssl: { rejectUnauthorized: false },
});

await oldClient.connect();
const data = await dump(oldClient, "OLD");
await oldClient.end();

fs.writeFileSync(
  path.join(outDir, "old-sitecontent.json"),
  JSON.stringify(data.siteContent, null, 2),
);
fs.writeFileSync(
  path.join(outDir, "old-submissions.json"),
  JSON.stringify(data.submissions, null, 2),
);

if (!data.siteContent.length && !data.submissions.length) {
  console.error("No data found on old DB — nothing to migrate.");
  process.exit(2);
}

await newClient.connect();
await dump(newClient, "NEW(before)");

for (const row of data.siteContent) {
  await newClient.query(
    `INSERT INTO "SiteContent" (id, data, "updatedAt")
     VALUES ($1, $2::jsonb, $3)
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, "updatedAt" = EXCLUDED."updatedAt"`,
    [row.id, JSON.stringify(row.data), row.updatedAt],
  );
}
console.log(`Upserted ${data.siteContent.length} SiteContent row(s)`);

for (const row of data.submissions) {
  await newClient.query(
    `INSERT INTO "Submission" (id, name, email, service, message, read, "createdAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       email = EXCLUDED.email,
       service = EXCLUDED.service,
       message = EXCLUDED.message,
       read = EXCLUDED.read,
       "createdAt" = EXCLUDED."createdAt"`,
    [
      row.id,
      row.name,
      row.email,
      row.service,
      row.message,
      row.read,
      row.createdAt,
    ],
  );
}
console.log(`Upserted ${data.submissions.length} Submission row(s)`);

await dump(newClient, "NEW(after)");
await newClient.end();
console.log("Migration complete.");
