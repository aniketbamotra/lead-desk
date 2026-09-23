# Lead Desk

A private dashboard for running a freelance web and UX prospecting pipeline. Automated workflows (n8n) fill a Supabase database with local businesses; Lead Desk is where each lead gets researched, called and moved through a sales pipeline.

The first market is US dental practices. The app is built so other markets can be added with a config file rather than new screens.

## What it does (v0.1)

- **Leads table** of practices from the `lead_queue` view, sorted by quality score, with search and filters for state, city, website status, review status, pipeline stage and score. Dental adds "hide DSOs and duplicates" and specialty.
- **Detail drawer** beside the table:
  - Phone number with a Call link and Copy
  - Research links: Google the name, trading name and phone; Google Maps; the website when known
  - Review actions: has website (paste the URL), no website, disqualify (with a note), skip. The drawer moves on to the next lead after each one.
  - Pipeline stage, and the market's own details (for dental: NPPES specialty, NPI, recency, group size)
- **Keyboard first**: `/` search, `J` / `K` next and previous lead, `1`–`4` review actions, `C` copy phone, `Esc` close.

Single user. Runs locally for now.

## Stack

- Next.js 16 (App Router), React 19, TypeScript (strict)
- Supabase (Postgres + Auth) via `@supabase/ssr`, with cookie-based sessions
- TanStack Query for data and optimistic updates, TanStack Table v9 for the grid
- Tailwind CSS v4, shadcn/ui primitives restyled to the project's own design tokens, lucide icons

## Getting started

Requires Node 20.9 or newer.

```sh
npm install
cp .env.example .env.local   # then fill in the two values
npm run dev                  # http://localhost:3000
```

`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Only these two values are public; the data is protected by row-level security. Any other key (Linear, an AI provider, n8n webhooks) belongs in server-only code under `app/api/` and must never get the `NEXT_PUBLIC_` prefix. Never use the Supabase service role key in this app.

### Supabase setup

1. **Tables and policies.** Run the "Database setup checklist" SQL from [`CLAUDE.md`](CLAUDE.md) in the Supabase SQL Editor. It adds the `vertical`, `next_follow_up` and `stage_updated_at` columns, the `lead_activities` table, and RLS policies that let a signed-in user read and update leads.
2. **The `lead_queue` view** must exist and select from `leads`. After adding columns to `leads`, recreate the view so they show up in it.
3. **Your user.** In Authentication → Users → Add user, create your account with a password and tick "Auto confirm user". Keep public sign-ups disabled.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |

## How the code is organised

```
app/            routes: sign-in, the protected desk, api/ for server-only calls
proxy.ts        refreshes the session and redirects signed-out visitors
domain/         the Lead type and the status vocabularies shared by every market
verticals/      one config per market (dental.ts): wording, detail fields, filters
data/           the only code that talks to Supabase; adapters/ maps rows to Lead
features/       desk, filters, table, drawer, keyboard
components/ui/  restyled shadcn primitives and small shared pieces
lib/            Supabase clients, formatting, research links
```

Components work with the `Lead` type and the vertical config, never with raw database rows or hardcoded market wording. If the schema changes, only `data/adapters/` changes.

[`CLAUDE.md`](CLAUDE.md) is the working brief: schema, design tokens, decisions and current state.

## Troubleshooting

**Signing in succeeds but you land back on the sign-in page, and the dev terminal shows `[auth] Couldn't verify the session: fetch failed`.** The Next.js server can't reach Supabase. On networks that inspect HTTPS traffic (corporate proxies such as Zscaler), Node doesn't trust the proxy's certificate even though the browser does. Export the proxy's root certificate to a file and point `NODE_EXTRA_CA_CERTS` at it before starting the dev server. Don't set `NODE_TLS_REJECT_UNAUTHORIZED=0`; that turns off certificate checking entirely.
