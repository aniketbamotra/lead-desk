# Lead Desk — prospecting dashboard

A private dashboard for running a freelance web/UX prospecting pipeline. It sits on top of a Supabase database that n8n workflows fill with local businesses. The dashboard is where leads get researched, called, and moved through a sales pipeline.

The first market is US dental practices. Other markets (other business categories) will follow once dental is saturated, using the same dashboard. See **Built for more than one market** below — this shapes how everything is built.

Single user (the owner, a UX engineer). Runs locally for now.

Read this whole file before starting work. At the end of every session, update **Current state** at the bottom.

---

## How the data gets here (context, not part of this repo)

Two n8n workflows run on the owner's Mac (self-hosted, Docker, `http://localhost:5679`):

1. **Lead Discovery** — pulls dental organisations from the NPPES NPI Registry API (paginated, up to 1,200 per query), normalises them, and upserts into `public.leads` (conflict key: `npi`).
2. **Website Enrichment** — takes 200 unchecked leads per run, guesses `.com` domains from the business name / DBA name, probes them, and verifies ownership by finding the practice's phone number on the page. Writes `website`, `website_status`, `website_source`, `domain_checked_at`.

Automated website discovery finds a site for roughly 15–20% of leads. Everything else is resolved by hand in this dashboard. That manual research step is the dashboard's first job.

Planned later: a PageSpeed audit workflow that fills `performance_score`, `accessibility_score`, `seo_score` for leads with a website.

Other markets will have their own discovery workflows and data sources (NPPES only covers healthcare).

---

## Built for more than one market

Dental is the first market ("vertical"), not the only one. The interface — table, filters, detail drawer, research links, review actions, calling, pipeline — must work unchanged for any local-business vertical. How the database handles multiple verticals isn't final yet, so the code must not depend on today's schema details beyond one layer.

Rules:

- **No market-specific wording in components.** Say "practice" or "business" only through vertical config, never hardcoded. The app name, navigation and empty states are market-neutral.
- **A generic `Lead` type in the UI.** Components work with a `Lead` domain model (name, trading name, phone, address, contact, website, website status, review status, stage, score, notes, and a `details` bag for market-specific fields). They never touch raw database rows.
- **One adapter per data source.** A mapping layer converts database rows into `Lead` and writes changes back. Today there is one adapter for `lead_queue` / `leads`. If a new vertical lands in a different table, or the schema changes, only the adapter changes.
- **Vertical config object.** Each vertical is defined in one config file: display name, singular/plural nouns ("practice/practices"), which market-specific fields to show in the drawer and how to label them, extra filters (e.g. dental specialty), and any market-specific research links. Adding a market means adding a config, not editing screens.
- **Market-specific signals stay in their config.** Things like NPPES taxonomy, `official_org_count` (DSO detection) and the current `qual_score` rules are dental-specific. Show them through the dental config's drawer fields and filters, not as core UI.
- **Core stays shared.** Review statuses, website statuses, pipeline stages and activity logging are the same across every vertical.

Current recommendation for the database (not yet decided): one `leads` table with a `vertical` column, core columns shared by all markets, and market-specific data in dedicated columns or a `jsonb` column. Build the adapter so this can change without touching the UI.

In v0.1 there is only one vertical, so the vertical switcher isn't needed in the UI yet, but everything should read the active vertical from config so adding a switcher later is small.

---

## Database

Supabase (Postgres). RLS is enabled. The dashboard uses the **anon/publishable key** plus Supabase Auth. Never use or commit the service/secret key.

### `public.leads`

| Column | Notes |
|---|---|
| `id` | bigint PK |
| `npi` | unique, from NPPES |
| `business_name` | cleaned legal name |
| `dba_name` | "doing business as" name; often the real trading name |
| `specialty`, `taxonomy_code`, `taxonomy_group` | from NPPES |
| `phone` | practice phone, formatted `907-481-3567` |
| `address`, `address_2`, `city`, `state`, `zip` | practice location |
| `contact_name`, `contact_title`, `contact_phone` | NPPES authorized official |
| `contact_email`, `contact_linkedin` | empty for now |
| `npi_status`, `enumeration_date`, `last_updated_nppes`, `years_since_update` | recency signals |
| `website` | URL or `''` |
| `website_status` | automated result, see below |
| `website_source` | `domain_guess` or `manual` |
| `domain_checked_at` | set when enrichment finishes a lead |
| `review_status` | manual research result, see below |
| `review_notes`, `reviewed_at` | |
| `status` | **sales pipeline stage**, see below |
| `performance_score`, `accessibility_score`, `seo_score` | 0–100, empty until audit workflow exists |
| `lead_score`, `lead_reason`, `outreach_message` | reserved for later |
| `next_follow_up` | date |
| `stage_updated_at` | timestamptz |
| `created_at`, `updated_at` | |

### Status vocabularies

Keep these three separate. They answer different questions.

**`website_status`** — what automation found (written by n8n; the dashboard only writes it when a human confirms a site)
- `found` — domain verified by phone number on the page
- `unverified` — a real site exists at `website` but blocked the automated check (Cloudflare challenge, geo-block, 403). Needs a human to confirm.
- `retry` — temporary failure; n8n will try again
- `not_found` — no guessable domain
- `null` — not checked yet

**`review_status`** — what a human decided
- `pending` (default), `has_website`, `no_website`, `disqualified`, `skipped`

**`status`** — sales pipeline stage
- `new` (default) → `contacted` → `follow_up` → `interested` → `proposal_sent` → `won` / `lost`

### `public.lead_queue` (view, `security_invoker = true`)

All `leads` columns plus:
- `qual_score` — deterministic lead quality score. High = owner-run independent practice. Negative = DSO/corporate, duplicate, or corporate-titled contact.
- `official_org_count` — how many organisations share this authorized official (≥3 means a dental group/DSO)
- `is_duplicate` — same practice phone as an earlier lead
- helper columns: `phone_digits`, `contact_digits`, `official_key`, `phone_rank`

**The dashboard reads from `lead_queue` and writes to `leads`.**

Default useful filter: `not is_duplicate and official_org_count < 3`, sorted by `qual_score desc`.

### `public.lead_activities`

| Column | Notes |
|---|---|
| `id` | PK |
| `lead_id` | FK → leads, cascade delete |
| `type` | `call`, `email`, `note`, `stage_change` |
| `outcome` | `no_answer`, `voicemail`, `spoke`, `interested`, `not_interested` |
| `note` | free text |
| `created_at` | |

### Database setup checklist

Confirm these exist before building features that depend on them (run in Supabase SQL Editor):

```sql
-- leads: market + follow-up fields
alter table public.leads
  add column if not exists vertical text not null default 'dental',
  add column if not exists next_follow_up date,
  add column if not exists stage_updated_at timestamptz;

create index if not exists leads_vertical_idx on public.leads (vertical);

-- activity log
create table if not exists public.lead_activities (
  id bigint generated by default as identity primary key,
  lead_id bigint references public.leads(id) on delete cascade,
  type text not null,
  outcome text,
  note text,
  created_at timestamptz default now()
);
alter table public.lead_activities enable row level security;

-- RLS: signed-in user can read and update leads, manage activities
create policy "authenticated read leads" on public.leads
  for select to authenticated using (true);
create policy "authenticated update leads" on public.leads
  for update to authenticated using (true);
create policy "authenticated manage activities" on public.lead_activities
  for all to authenticated using (true) with check (true);
```

In Supabase Auth settings: disable public sign-ups, and create the owner's user manually.

Note: `lead_queue` selects `l.*`, but Postgres fixes a view's columns when the view is created. After adding columns to `leads` (like `vertical`), drop and recreate `lead_queue` so they show up in it. Ask the owner for the current view definition before recreating it.

---

## Stack

- **Next.js App Router + TypeScript (strict)**
- **Supabase:** `@supabase/supabase-js` with `@supabase/ssr` for cookie-based sessions. There's a browser client, a server client, and middleware that refreshes the session on each request. Session tokens live in cookies, not localStorage.
- TanStack Table v9 (grid and sorting; v9 uses `useTable` + `tableFeatures`, not v8's `useReactTable`. Its bundled skills are in `node_modules/@tanstack/*/skills/`), TanStack Query (data fetching, caching, optimistic updates)
- Tailwind CSS v4
- shadcn/ui (`radix-nova` style, Radix base) for behaviour and accessibility primitives (dialog, popover, command, select). **Restyle every added component to the design tokens.** Stock shadcn styling is exactly the look to avoid. It brings `radix-ui`, `class-variance-authority`, `cn` (shadcn's own replacement for clsx + tailwind-merge) and `tw-animate-css`. **Always import `cn` from `@/lib/utils`**, which is configured with our type scale. The bare `cn` package treats `text-control` etc. as colours and silently drops classes like `text-white`. shadcn's CLI writes `import { cn } from "cn"` into new components: change it after every `shadcn add`.
- lucide-react for icons
- Font: Hanken Grotesk via `next/font/google` (self-hosted at build time, no extra package)

**Why Next.js, not Vite.** The app will need server-side secrets: a Linear API key, an LLM key for outreach drafting, a VoIP token, and an auth header on n8n webhooks. Those belong in route handlers, not in a client bundle. This is still a dashboard. Most components are client components (`"use client"`), with TanStack Query doing the fetching. Next is here for route handlers, cookie-based auth and deployment, not for server-rendering the leads table.

Tokens live in `app/globals.css`. Our palette has its own utilities (`bg-shell`, `bg-panel`, `text-ink`, `text-ink-muted`, `bg-coral`, `border-line` …), and shadcn's semantic variables (`primary`, `secondary`, `muted`, `accent`, `border`, `input`, `ring`) are mapped onto the same palette. shadcn owns the name `accent`, so the brief's accent colour is called `coral` in code. The type scale is exposed as `text-label`, `text-body`, `text-control`, `text-heading`, `text-title`, `text-count` and `text-phone`, and `tnum` sets tabular figures.

Env vars in `.env.local` (never committed). Only these two are public, and they're safe in the browser because RLS protects the data:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
Every other key (Linear, LLM, VoIP, n8n webhook auth) has no `NEXT_PUBLIC_` prefix and is read only in server code. See **Secrets and server code**.

1,200 rows is small enough for client-side filtering. Filtering is plain predicate code in `features/filters/apply-filters.ts`, not TanStack's filter feature, because vertical filters (like "hide DSOs") are functions over `Lead`. To move to server-side filtering, translate that file into the `useLeads` query; nothing else changes.

Next.js 16 notes: middleware is now `proxy.ts`. Next ships version-matched docs in `node_modules/next/dist/docs/`; read them before using an API you're unsure of.

### Code layout

```
app/                 routes only: (auth)/sign-in, (desk)/ protected group, api/ (later)
proxy.ts             session refresh + redirect signed-out visitors (lib/supabase/proxy.ts)
lib/supabase/        env.ts, client.ts (browser), server.ts, proxy.ts
domain/              Lead type, LeadChange + applyLeadChange, status vocabularies and labels
verticals/           VerticalConfig type, dental.ts, index.ts (activeVertical)
data/                the only code that touches Supabase: adapters/lead-queue.ts, use-leads, use-update-lead, use-session
components/ui/       restyled shadcn primitives + our own (chip, kbd, status-mark, input)
features/            auth, desk, filters, table, drawer, keyboard
```

Components import from `domain/`, `verticals/` and the `data/` hooks, never from `data/adapters/` or `lib/supabase/`.

### Local environment: HTTPS-inspecting networks

On a network that inspects HTTPS traffic, the proxy re-signs connections with its own root certificate. Browsers trust it through the OS keychain; Node does not, so server-side Supabase calls fail with `SELF_SIGNED_CERT_IN_CHAIN`. The symptom is signing in successfully and then being sent straight back to `/sign-in`, with `[auth] Couldn't verify the session` in the dev terminal. Fix: export the proxy's root certificate to a file and set `NODE_EXTRA_CA_CERTS` to it in the shell profile, then restart the dev server from a new terminal. Never "fix" it with `NODE_TLS_REJECT_UNAUTHORIZED=0`. This is already set up on the owner's machine.

### Supabase auth setup (one-time, in the Supabase dashboard)

- Authentication → Users → Add user: the owner's email and a long password, with "Auto confirm user" ticked.
- Keep public sign-ups disabled. No redirect URLs or email templates are needed for password sign-in.

---

## Scope

### v0.1 — research and first calls (build this first)

- **Sign in** with email and password (Supabase Auth). Single user, so no magic link: it added redirect URLs, an email template, a confirm route and email rate limits for no benefit.
- **Leads table** reading `lead_queue`
  - Columns: business (name, trading/DBA name underneath if present), city/state, phone, website status, review status, stage, score, contact
  - Core filters (all verticals): state, city, website status, review status, stage, score range
  - Dental config adds: "hide DSOs and duplicates" (on by default), specialty
  - Sort by score by default; global text search
- **Detail drawer** (opens beside the table, doesn't replace it)
  - Business info, contact, address, and the vertical's own detail fields (for dental: NPPES specialty, taxonomy group, authorized official, NPI recency)
  - Research links that open in a new tab (core set below; a vertical config can add more):
    - Google: business name + city + state
    - Google: DBA name + city (only if DBA exists)
    - Google: phone number in quotes
    - Google Maps: name + address (usually the fastest route to the real website)
    - Open website (when `website` is set)
  - Review actions:
    - **Has website** — paste URL → `website`, `website_status='found'`, `website_source='manual'`, `review_status='has_website'`, `reviewed_at=now()`
    - **No website** → `review_status='no_website'`
    - **Disqualify** with a note → `review_status='disqualified'`, `review_notes`
    - **Skip** → `review_status='skipped'`
  - Call: copy phone number, and a `tel:` link
  - Stage selector (writes `status`, `stage_updated_at`)
- **Keyboard**: `J`/`K` next/previous lead within the current filtered set, `1`–`4` review actions, `C` copy phone, `/` focus search, `Esc` close drawer. Show shortcuts somewhere discoverable.

URL formats:
- `https://www.google.com/search?q=${encodeURIComponent(query)}`
- `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

### v0.2 — pipeline

- Log a call from the drawer: outcome + note → `lead_activities`, optional `next_follow_up`
- Activity timeline in the drawer
- "Due" view: leads where `next_follow_up <= today`
- Board view grouped by stage

### v0.3 — audit and automation

- Show PageSpeed scores once the audit workflow populates them
- Buttons that trigger n8n workflows via webhook, called from a route handler under `app/api/` so the webhook auth header stays on the server.
- Note: n8n runs on `localhost:5679`, so workflow triggers only work while the dashboard runs locally. If the app is deployed, this feature needs n8n hosted somewhere reachable from the deployment.

### Later / not now

- Vertical switcher, once a second market exists
- Outreach message drafting
- Project management happens in **Linear**. Don't build it. A later "won → create Linear project" handoff is the most that belongs here.

---

## Design brief

The owner is a UX engineer and cares about the interface. The goal is a tool that feels considered and specific to this job. No flashy animation. Not a template.

**Confirmed by the owner in session 1** (token sheet: https://claude.ai/artifact/9R15yNYgbYc4rCXWh7QJd5). The direction comes from a reference the owner supplied: a soft, rounded dashboard with a grey shell, white and light-grey panels, pill controls, circular icon buttons, a coral accent, black primary pills and light-weight large numbers. It replaces the earlier flat "precise instrument" proposal. The owner's decisions override everything here.

### What the product is

A working desk for prospecting. Long sessions of reading, deciding, and calling. Dense data, fast keyboard movement, lots of small state changes. The soft visual style must not cost density: the table stays a real table.

### Tokens (light theme; dark mode deferred)

Colour. Structure comes from fill differences, not borders or shadows:
- `shell` #F6F6F5 — top bar zone
- `surface` #FFFFFF — app body, cards inside panels, selected row
- `panel` #F3F3F2 — filter rail, table panel, drawer panel, grey pills
- `line` #E8E8E6 — outlines on white pills, chips and circular buttons
- `line-strong` #929290 — text input borders only (3:1 for control boundaries)
- `ink` #141414 — text, black primary pills
- `ink-muted` #707070 — labels and secondary text (5.0:1 on white, 4.5:1 on panel). Don't go lighter.
- `accent` #B84E35 — Call pill fill, unverified status, focus ring. White text on it is 5.0:1.
- `accent-bright` #D9694F — the reference coral. Dots and marks only, never behind text (white on it is 3.4:1).
- `accent-tint` #FBEBE6 — tags, avatar, notices

Accent meaning: coral means "needs you". Its fill is reserved for the Call pill, the one bold spot.

Website status marks. Shape and label always; colour only where it means something:
- found — filled circle, `ink`
- unverified — half-filled circle, `accent` (waits on a human check)
- retry — dashed circle, `ink-muted`
- not_found — outline circle, `ink-muted`
- null — dash, "Not checked", `ink-muted`

Review status and pipeline stage have no colour. They're plain text, with weight 500 on the states that need action (pending, follow up).

Type:
- One family: **Hanken Grotesk** (Google Fonts), weights 300–600.
- Scale: phone 34/38 w300; count 22/28 w400; title 20/26 w400; heading 17/22 w400; control 14/20 w500; body 13/18 w400; label 12/16 w400.
- Titles and big numbers are light or regular weight, with slight negative tracking on 20px and up.
- `font-variant-numeric: tabular-nums` on phone, score, zip and counts. Sentence case everywhere.

Shape and controls:
- Radius: app frame 28, panels 24, cards 18, table rows 14, controls fully rounded (pills).
- No shadows. Popovers and dialogs may get one tight shadow.
- Pills: black (`ink`) for the one primary action in a group, grey (`panel`) for the rest, white with `line` outline for selects and sort. The coral fill is only for Call.
- Icon buttons are 40px circles with a `line` outline. Filters show as chips: unpressed is a white pill with a `line` outline and `ink-muted` text; pressed is an `ink` fill with white text and a remove mark (same black-fill language as the primary pill).
- Keyboard hints sit inside buttons as small round `kbd` badges.
- Focus: 2px `accent` outline, 2px offset, on every control.
- Table rows are 48px, all the same height (room for a trading name under the business name). Fixed column widths (`table-layout: fixed`): Business is 300px and truncates long names; Contact, the last column, takes the leftover space. Don't let Business absorb extra width, it balloons on wide screens. The selected row turns white on the grey panel, with an `accent-bright` dot in the left padding (names stay aligned with the header) and weight 500.
- Registry text arrives in capitals. The adapter converts all-caps names, cities and contacts to title case for display (`lib/display-case.ts`), keeping suffixes like LLC/PLLC/DDS upper case. Mixed-case text is left alone.
- Weight 500 marks only rare states that need action (stage "follow up"). Not "pending" review: it's most rows, so emphasis there is noise.

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│ (≡) (LD) Lead Desk                   ( ⌕ Search practices    / )  A  │  header panel
│          Dental practices                                            │
└──────────────────────────────────────────────────────────────────────┘
┌────────────┐ ┌─────────────────────────────────────┐ ┌───────────────┐
│ Filters    │ │ Practices 930 of 1,181              │ │ Business name │
│ ◉ Hide DSOs│ │ Business     City   Phone  Website… │ │ Trading as …  │
│ State      │ │ row                                 │ │ ┌───────────┐ │
│ City       │ │ ● row (selected, white)             │ │ │907-481-…  │ │
│ Website    │ │ row                                 │ │ │(Call)(Copy│ │
│ Review     │ │ row                                 │ │ └───────────┘ │
│ Stage      │ │                                     │ │ Research      │
│ Score      │ │                                     │ │ Review        │
│ Specialty  │ │                                     │ │ Stage         │
│            │ │                                     │ │ Details       │
└────────────┘ └─────────────────────────────────────┘ └───────────────┘
```

- Every block (header, filter rail, table, drawer) is a rounded `panel` on the white page, with a 12px gap and 12px outer margin. Nothing runs edge to edge.
- The header holds the rail toggle, the name with the vertical's display name under it (from config), the search pill with its `/` hint, and the account menu.
- No count circles. They were dropped in session 2: the filter rail and the table's "930 of 1,181" line already cover them.
- The filter rail is 240px and collapses. The drawer opens beside the table when a row is selected. It is 400px by default, resizable from 360 to 640px by drag or arrow keys, and its width is remembered. It stacks white cards in this order: call, research, review, stage, details.
- The selected lead goes in the URL (`?lead=123`).

### Principles

- Density holds. The soft styling lives in the shell and panels; rows stay aligned and scannable.
- Spend boldness in one place: the drawer's phone number and Call pill.
- Structure carries information. Fill, weight and colour mean something; nothing is there for ornament.
- Keyboard first, mouse always works. Visible focus states everywhere. `?` opens a shortcuts sheet.
- Motion only in response to actions: the drawer opening (150ms ease-out), a status change confirming (600ms row flash). Off under reduced motion.
- Copy is plain and specific: "Mark as no website", not "Submit". An action keeps the same name in its button and its confirmation.
- Empty and error states tell the user what to do next.

### Avoid

Stock shadcn look; drop shadows on cards; gradients as decoration; all-caps eyebrow labels; monospace as decoration; middle-dot meta strings; `→` appended to buttons; emoji in the UI; progress bars for scores; coral fill anywhere but Call; grey text lighter than `ink-muted`.

---

## Working agreement

- Ask before adding a dependency that isn't listed under Stack.
- **Secrets and server code.** Anything that uses a key goes in a route handler under `app/api/` (or other server-only code), never in a client component. Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are public. Never give a secret the `NEXT_PUBLIC_` prefix, and never use the Supabase service key.
- Keep components small; one component per file.
- Supabase access goes through a small data layer (hooks built on TanStack Query), not scattered calls in components.
- Components receive `Lead` objects and vertical config, never raw rows or hardcoded market wording. If something only makes sense for dental, it belongs in the dental config.
- Optimistic updates for review actions and stage changes, with rollback on error.
- Never write to n8n-owned automation fields except as described under Review actions.
- End every session by updating **Current state** below: what was built, what's in progress, known issues, and the next step.

---

## Current state

- Session 0: this file created. No code yet.
- Database: `leads` populated with ~1,180 dental practices. `lead_queue` view exists. Website enrichment in progress (running in batches of 200).
- Not yet confirmed: `vertical` column, `lead_activities` table, RLS policies, `next_follow_up` / `stage_updated_at` columns — run the setup checklist, then recreate `lead_queue`.
- Session 1: design direction and tokens confirmed (see Design brief; token sheet at https://claude.ai/artifact/9R15yNYgbYc4rCXWh7QJd5). Decided: after a review action (1–4) the drawer auto-advances to the next lead in the filtered set. Stack settled: shadcn + lucide (see Stack).
- Session 2: stack switched from Vite to Next.js 16 App Router (reasons under Stack). v0.1 scaffold built:
  - Project: Next.js 16.3, React 19.2, TS strict, Tailwind v4, shadcn (button, input, popover, switch restyled), tokens in `app/globals.css`, Hanken Grotesk via `next/font`.
  - Auth: `@supabase/ssr` browser and server clients, `proxy.ts` session refresh and redirect, email + password sign-in page, `(desk)` layout re-checks the session with `getClaims`. (First built as a magic link, then switched to password at the owner's request; `/auth/confirm` was removed.)
  - Data: `Lead` type, `LeadChange` + `applyLeadChange` for optimistic updates, `lead_queue` adapter (`toLead`, `toLeadsUpdate`), `useLeads` (pages through the 1,000-row limit), `useUpdateLead` (optimistic, rollback, and treats "0 rows updated" as an RLS failure). All review actions set `reviewed_at`, not only "Has website".
  - Dental config: detail fields, "hide DSOs and duplicates" toggle (on by default), specialty filter.
  - UI: top bar (rail toggle, name + vertical, search with `/`, account popover with sign out), count circles (pending review, unverified websites; each is a quick filter), filter rail (state, city, website, review, stage, score range, vertical filters), leads table (sort by score by default, sortable headers, selected row state, loading/error/empty states).
  - Checks: `tsc`, `eslint` and `next build` pass. Smoke-tested with placeholder env: `/` redirects to `/sign-in` and sign-in renders. Not yet run against the real database.
- Session 2 fixes after first real run: (1) invisible button text, caused by the bare `cn` package dropping `text-white` next to `text-control`; fixed with a configured `cn` in `lib/utils.ts`. (2) Sign-in and sign-out now do a full page load (`window.location.assign`), because the client router could replay a cached `/ → /sign-in` redirect and leave the owner on the sign-in page. Successful sign-in not yet confirmed by the owner. (3) `suppressHydrationWarning` on `<body>` for attributes added by browser extensions.
- Session 2, first UI review against real data (1,181 leads, 930 pending): fixed all-caps registry text, tie-break sort by name (many leads share score 30; check the qual_score rules once the view definition is shared), removed "pending" emphasis, fixed column widths, header alignment, score/contact spacing, uniform 48px rows, sort hints on hover, clickable-looking filter chips, score inputs (Min/Max + range line), Reset only when filters changed, search as one pill with the `/` hint inside, dev badge moved bottom-right. tsc and lint pass; the owner still needs to check it visually (Claude's browser isn't signed in).
- Session 2, second pass: removed the count circles; the header is now a rounded panel with outer margin like the rest. Built the detail drawer (`features/drawer/`): identity with J/K hint and close, call card (big phone number, Call `tel:` pill, Copy with `C`), research links (core set from `lib/research-links.ts` plus vertical links, and "Open <site>" when a website is set), review card (website field pre-filled with the automation's URL for unverified leads, `1`–`4` actions, disqualify asks for a note, Enter submits the URL), native stage select styled as a pill, and a details card (address, contact, website, review notes, reviewed date, vertical detail fields). Review actions auto-advance to the next lead in the on-screen order; stage changes don't. Save errors show at the top of the drawer. Keyboard: `/`, `J`/`K`, `1`–`4`, `C`, `Esc` work (`features/keyboard/use-key.ts`, ignored while typing). tsc and lint pass; not yet checked visually by Claude (its browser isn't signed in).
- Known gaps: `FILTER_BY_VERTICAL` in the adapter is `false` until `lead_queue` exposes `vertical`. Filters aren't in the URL yet. No `?` shortcuts sheet yet (keys are shown on the buttons and in the drawer header). No 600ms row flash on status change yet. Esc while a filter popover is open may also close the drawer.
- Next step: owner creates `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`), adds their user in Supabase (see Supabase auth setup), runs the database setup checklist, and shares the `lead_queue` view definition (`select pg_get_viewdef('public.lead_queue', true);`). Then the owner reviews the drawer with real data; after that, the `?` shortcuts sheet, the status-change row flash, and v0.2 (call logging, activity timeline, due view, board).
