import { sql } from "@vercel/postgres";

export type Rsvp = {
  id: number;
  name: string;
  attending: boolean;
  guest_count: number;
  message: string | null;
  created_at: string;
};

export type EventSettings = {
  hosts: string;
  title: string;
  date: string;
  time: string;
  meal: string;
  address: string;
  maps_url: string;
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
  await sql`
    CREATE TABLE IF NOT EXISTS event_settings (
      id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      hosts TEXT NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      meal TEXT NOT NULL,
      address TEXT NOT NULL,
      maps_url TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS admin_settings (
      id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      password_hash TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

export async function getEventSettings(): Promise<EventSettings | null> {
  await ensureSchema();
  const { rows } = await sql<EventSettings>`
    SELECT hosts, title, date, time, meal, address, maps_url
    FROM event_settings
    WHERE id = 1
  `;
  return rows[0] ?? null;
}

export async function upsertEventSettings(input: EventSettings): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO event_settings (id, hosts, title, date, time, meal, address, maps_url, updated_at)
    VALUES (1, ${input.hosts}, ${input.title}, ${input.date}, ${input.time}, ${input.meal}, ${input.address}, ${input.maps_url}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      hosts = EXCLUDED.hosts,
      title = EXCLUDED.title,
      date = EXCLUDED.date,
      time = EXCLUDED.time,
      meal = EXCLUDED.meal,
      address = EXCLUDED.address,
      maps_url = EXCLUDED.maps_url,
      updated_at = NOW()
  `;
}

export async function getAdminPasswordHash(): Promise<string | null> {
  await ensureSchema();
  const { rows } = await sql<{ password_hash: string }>`
    SELECT password_hash FROM admin_settings WHERE id = 1
  `;
  return rows[0]?.password_hash ?? null;
}

export async function setAdminPasswordHash(hash: string): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO admin_settings (id, password_hash, updated_at)
    VALUES (1, ${hash}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      updated_at = NOW()
  `;
}
