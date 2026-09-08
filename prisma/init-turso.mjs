import { createClient } from "@libsql/client";
import { readFile } from "node:fs/promises";

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error("TURSO_DATABASE_URL ve TURSO_AUTH_TOKEN gereklidir.");
}
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
try {
  const existing = await client.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_litestream_%'"
  );
  if (existing.rows.length) {
    throw new Error("Veritabanı boş değil. İlk kurulum yalnızca boş veritabanında çalıştırılabilir.");
  }
  const sql = await readFile(new URL("./turso-init.sql", import.meta.url), "utf8");
  const statements = sql.split(";").map((item) => item.trim()).filter(Boolean);
  await client.migrate(statements);
  console.log("Turso tabloları oluşturuldu.");
} finally {
  client.close();
}
