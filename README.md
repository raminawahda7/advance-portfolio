# Rami Nawahda — Portfolio

Single-page developer portfolio with a private admin panel. Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma** (SQLite for local dev, Postgres/Supabase for production).

The public page renders live from the database, so any edit made in the admin panel appears immediately.

---

## Design system — "Interactive Blueprint / Technical Editorial"

- Deep charcoal background (`#0D0E11`), terminal-neon-green accent (`#00FF66`), electric-blue hover (`#2563EB`).
- `Space Grotesk` headers, `JetBrains Mono` for code/labels.
- Visible structural grid lines, terminal-style glowing tech pills, sharp corners only.
- Experience/education cards reveal a **blueprint grid + JSON metadata micro-drawer** on hover.
- Fully responsive; the grid collapses to a single column under 768px.

---

## Quick start (local)

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env
#    Edit .env: set ADMIN_PASSWORD. DATABASE_URL defaults to SQLite (file:./dev.db).

# 3. Create the database schema + seed the initial data
npm run db:push
npm run db:seed

# 4. Run the dev server
npm run dev
```

- Public site: <http://localhost:3000>
- Admin panel: <http://localhost:3000/admin> (log in with `ADMIN_PASSWORD`)

---

## Scripts

| Script             | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `npm run dev`      | Start the Next.js dev server                           |
| `npm run build`    | `prisma generate` + production build                   |
| `npm run start`    | Serve the production build                             |
| `npm run db:push`  | Create/update DB schema from `prisma/schema.prisma`    |
| `npm run db:seed`  | Insert the seed data (profile, experience, skills)     |
| `npm run db:reset` | Drop, recreate, and re-seed the database               |
| `npm run db:studio`| Open Prisma Studio to inspect data                     |
| `npm run lint`     | Lint                                                   |

---

## Admin panel

- Route: `/admin` (protected by a session cookie; `/admin/login` is public).
- Auth: a **single password** in `ADMIN_PASSWORD`. On successful login an httpOnly session cookie is set (an HMAC of the password — the password itself is never stored in the cookie). Rotating `ADMIN_PASSWORD` invalidates existing sessions.
- Manage **Experience** and **Education** entries (same model, `kind` field): full create / edit / delete.
- Fields: title, company, location, start date, end date (empty = **Present**), description (one bullet per line), tech stack (comma-separated), display order (empty = auto-computed from start date).
- On save the list re-sorts by **start date descending**, with `Present` (null end date) entries floated to the top. The public page reflects the change immediately.

---

## Data model

`prisma/schema.prisma`:

- **Profile** — singleton row (name, title, tagline, summary, location, email, github, linkedin).
- **Entry** — `kind: "experience" | "education"`, title, company, location, startDate, endDate (nullable), description, techStack, displayOrder.
- **SkillGroup** — name + comma-separated skills.

All fields use portable types (String / DateTime / Int), so the same schema compiles on SQLite and Postgres. `kind` is a plain String (not a native Prisma enum) specifically so SQLite is supported.

---

## Swapping to Postgres / Supabase for production

The schema is designed to move to Postgres with minimal change:

1. In `prisma/schema.prisma`, change the datasource provider:

   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. Set `DATABASE_URL` to your Postgres/Supabase connection string. For Supabase use the **pooled** connection string (port `6543`) for the app; migrations can use the direct string (port `5432`).

3. Apply the schema and seed:

   ```bash
   npx prisma db push
   npm run db:seed
   ```

No model changes are required — only the provider line and the env var.

---

## Deploying to Vercel + Supabase

1. **Create a Supabase project** and copy its Postgres connection string (Project → Settings → Database).
2. In `prisma/schema.prisma`, set `provider = "postgresql"` (see above) and commit.
3. **Push this repo to GitHub**, then **import it into Vercel**.
4. In Vercel → Project → Settings → **Environment Variables**, add:
   - `DATABASE_URL` = your Supabase pooled connection string.
   - `ADMIN_PASSWORD` = a strong secret.
5. The `build` script runs `prisma generate` automatically. After the first deploy, apply the schema and seed once (from your machine, pointed at the production DB):

   ```bash
   # .env DATABASE_URL temporarily set to the Supabase connection string
   npx prisma db push
   npm run db:seed
   ```

6. Visit your Vercel URL. `/admin` is live; log in with `ADMIN_PASSWORD`. Because the public page uses `dynamic = "force-dynamic"`, admin edits are reflected immediately without a redeploy.

> **Security note:** `ADMIN_PASSWORD` is a single shared secret. Use a long, random value in production and rotate it if exposed. Sessions are httpOnly + `secure` in production.

---

## Project structure

```
prisma/
  schema.prisma        # data model (SQLite → Postgres portable)
  seed.ts              # seed script (profile, experience, education, skills)
src/
  app/
    page.tsx           # public single-page site (server component, live data)
    layout.tsx         # fonts + globals
    globals.css        # design tokens + component classes
    admin/
      login/page.tsx   # password login
      page.tsx         # dashboard (auth-guarded server component)
      AdminDashboard.tsx / EntryForm.tsx
    api/admin/         # login, logout, entries CRUD (auth-guarded)
  components/          # Hero, Section, EntryCard, SkillsGroup, pills, icons
  lib/                 # db (Prisma client), auth (session), format, sort
  middleware.ts        # redirect unauthenticated /admin → /admin/login
  types.ts
```
