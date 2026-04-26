import "dotenv/config";
import { sql } from "@vercel/postgres";

const before = await sql`SELECT id, name, attending, guest_count, created_at FROM rsvps ORDER BY created_at DESC`;
console.log(`Before: ${before.rowCount} row(s)`);
for (const r of before.rows) {
  console.log(`  #${r.id} ${r.name} attending=${r.attending} guests=${r.guest_count} (${new Date(r.created_at).toISOString()})`);
}

const result = await sql`DELETE FROM rsvps`;
console.log(`Deleted: ${result.rowCount} row(s)`);

const after = await sql`SELECT COUNT(*)::int AS count FROM rsvps`;
console.log(`After: ${after.rows[0].count} row(s)`);
