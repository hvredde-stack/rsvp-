# Housewarming RSVP

A small Next.js + Vercel Postgres app for collecting RSVPs.

- Public landing page at `/` — invite copy + RSVP form
- Admin view at `/admin` — list of responses, gated by HTTP basic auth

## Stack

- Next.js 16 (App Router, Server Actions)
- Tailwind CSS v4
- `@vercel/postgres` for storage
- `zod` for input validation

## Editing event details

All event copy lives in [src/lib/event.ts](src/lib/event.ts). Edit the strings in the `EVENT` object (hosts, date, time, address, etc.) and the landing page updates automatically.

## Local development

1. `npm install`
2. Copy `.env.local.example` → `.env.local` and fill in:
   - `POSTGRES_URL` (and friends) — pull from your Vercel Postgres store with `vercel env pull .env.local`, or run a local Postgres and set `POSTGRES_URL=postgres://user:pass@localhost:5432/rsvp`
   - `ADMIN_USER` / `ADMIN_PASS` — credentials for the `/admin` page
3. `npm run dev` and open http://localhost:3000

The `rsvps` table is created automatically on the first request (`ensureSchema()` in [src/lib/db.ts](src/lib/db.ts)).

## Deploying to Vercel

1. Push the repo to GitHub.
2. In the Vercel dashboard: **Add New → Project**, import the repo.
3. **Storage tab → Create → Postgres** (or Neon). Connect it to the project — Vercel will inject the `POSTGRES_*` env vars automatically.
4. **Settings → Environment Variables**, add:
   - `ADMIN_USER` — pick any username
   - `ADMIN_PASS` — pick a strong password
5. Deploy. The first visit to any page will provision the `rsvps` table.

That's it — share the production URL with guests, and watch responses roll into `/admin`.

## Project layout

| Path | Purpose |
| --- | --- |
| [src/app/page.tsx](src/app/page.tsx) | Public invite + RSVP form |
| [src/app/rsvp-form.tsx](src/app/rsvp-form.tsx) | Client form component |
| [src/app/actions.ts](src/app/actions.ts) | Server action that validates + inserts |
| [src/app/admin/page.tsx](src/app/admin/page.tsx) | Admin list view |
| [src/proxy.ts](src/proxy.ts) | Basic-auth gate for `/admin/*` |
| [src/lib/db.ts](src/lib/db.ts) | Postgres helpers + schema |
| [src/lib/event.ts](src/lib/event.ts) | Event copy (edit me!) |
