import { sql } from "@vercel/postgres";

export type Rsvp = {
  id: number;
  name: string;
  attending: boolean;
  guest_count: number;
  message: string | null;
  created_at: string;
};

export async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS rsvps (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      attending BOOLEAN NOT NULL,
      guest_count INTEGER NOT NULL DEFAULT 1,
      message TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function insertRsvp(input: {
  name: string;
  attending: boolean;
  guest_count: number;
  message: string | null;
}) {
  await ensureSchema();
  await sql`
    INSERT INTO rsvps (name, attending, guest_count, message)
    VALUES (${input.name}, ${input.attending}, ${input.guest_count}, ${input.message})
  `;
}

export async function listRsvps(): Promise<Rsvp[]> {
  await ensureSchema();
  const { rows } = await sql<Rsvp>`
    SELECT id, name, attending, guest_count, message, created_at
    FROM rsvps
    ORDER BY created_at DESC
  `;
  return rows;
}
