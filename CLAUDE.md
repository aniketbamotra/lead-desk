# Lead Desk — prospecting dashboard

A private dashboard for running a freelance web/UX prospecting pipeline. It sits on top of a Supabase database that n8n workflows fill with local businesses. The dashboard is where leads get researched, called, and moved through a sales pipeline.

The first market is US dental practices. Other markets (other business categories) will follow once dental is saturated, using the same dashboard. See **Built for more than one market** below — this shapes how everything is built.

Two users: the owner (a UX engineer) and a teammate who does the research. See **Team and workflow**. Being deployed so the teammate can use it; see Current state.

Read this whole file before starting work. At the end of every session, update **Current state** at the bottom.

---

## Team and workflow

- **Teammate: research (the groundwork).** Works through the leads one by one. When automation found no website (or couldn't verify one), she searches for the business by name and decides: has website (with the URL), no website, disqualify, or skip. Most of the research is done by her.
- **Owner: calling and outreach.** Once a good batch is researched, the owner calls the reviewed leads, logs calls, notes and follow-ups, and moves them through the pipeline.
- This runs for a few weeks until the leads are properly enriched. **Later, the teammate may also start outreach.** When that happens, consider: who owns a lead for calling (an assignee field and a "mine" filter), and whether both of you might call the same lead. Attribution is already in place (`reviewed_by`, `lead_activities.created_by`).
- Implications for the app: both users see each other's work (leads refresh every minute and on returning to the tab); review saves are guarded so a second review can't silently overwrite the first; every review and activity records who did it. Sign-ups stay off: the owner creates each account in Supabase.

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
| `possible_trading_name`, `possible_website` | entity only: an unconfirmed trading name seen at the address, and its website if found. Written by a person, never by automation |
| `site_condition` | a person's assessment of the website: `broken`, `outdated`, `not_mobile`, `thin`, `social_only`, `directory_only`, `template`, `decent`, `modern`, or null (not assessed). Keys and labels in `domain/site-condition.ts` |
| `site_condition_score` | points for that assessment, copied from config when it's saved (provisional, see **Site condition**) |
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
- `pending` (default), `has_website`, `no_website`, `disqualified`, `skipped`, `entity_only`
- `entity_only` means the registered entity has no findable web presence, and the practice at that address may trade under a different name. It's neither `no_website` (a prime lead) nor `disqualified` (dead): it's an unresolved identity, settled by phoning the practice and hearing the trading name in the greeting. A call-first group, not a research backlog.

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

- **Sign in** with email and password (Supabase Auth). A small team with accounts created by the owner, so no magic link: it added redirect URLs, an email template, a confirm route and email rate limits for no benefit.
- **Leads table** reading `lead_queue`
  - Columns: business (name, trading/DBA name underneath if present), city/state, phone, website status, site condition (short label, full label on hover), review status, stage, score, contact
  - Core filters (all verticals): state, city, website status, review status, stage, site condition (including "not assessed": has a website nobody has assessed), score range
  - Dental config adds: "hide DSOs and duplicates" (on by default), specialty
  - Default sort: `qual_score` desc, then `site_condition_score` desc with unassessed last, then name; global text search
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
    - **Mark as entity only** (`5`) → optional trading name seen at the address and its website, plus notes (pre-filled with what's saved) → `review_status='entity_only'`, `possible_trading_name`, `possible_website`, `review_notes`, `reviewed_at`. Leaves `website` and `website_status` alone (automation owns them). The table shows the possible trading name as "Possibly …" under the business name, in place of the trading name.
  - **Site condition** (`S` focuses it): a single select in the review card, shown when the lead has a website (`found`, `unverified`, or a URL on record) or a URL has been typed into the Website field. Writes `site_condition`, `site_condition_score` (from config) and `reviewed_at`; optimistic, undoable with `Z`. It doesn't move to the next lead, so the site can be assessed before pressing `1`.
  - Call: copy phone number, and a `tel:` link
  - Stage selector (writes `status`, `stage_updated_at`)
- **Keyboard**: `J`/`K` next/previous lead within the current filtered set, `1`–`5` review actions, `C` copy phone, `/` focus search, `Esc` close drawer, `Z` undo the last review, `L` log a call, `?` shortcuts sheet (also the keyboard button in the header).

URL formats:
- `https://www.google.com/search?q=${encodeURIComponent(query)}`
- `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

### v0.2 — pipeline (built in session 2)

- Log a call from the drawer: outcome + note → `lead_activities`, optional `next_follow_up` (quick picks: tomorrow, in 3 days, next week, or a date)
- Activity timeline in the drawer; stage changes are logged there automatically
- "Due" filter chip in the list header: leads where `next_follow_up <= today`, within the other filters. Follow-up dates also show under the stage in the table (coral when due)
- Board view grouped by stage (Table / Board switch in the list header, `?view=board`). No drag and drop: stages change in the drawer

### v0.3 — audit and automation

- Show PageSpeed scores once the audit workflow populates them
- When `performance_score`, `accessibility_score` and `seo_score` arrive, compare them with the manual site condition assessments before trusting either: they're an automated check on the same question
- Buttons that trigger n8n workflows via webhook, called from a route handler under `app/api/` so the webhook auth header stays on the server.
- Note: n8n runs on `localhost:5679`, so workflow triggers only work while the dashboard runs locally. If the app is deployed, this feature needs n8n hosted somewhere reachable from the deployment.

### Later / not now

- Vertical switcher, once a second market exists
- Outreach message drafting
- Project management happens in **Linear**. Don't build it. A later "won → create Linear project" handoff is the most that belongs here.

---

## Site condition

Answers "do they need what I sell", while `qual_score` answers "is this the kind of business I want". Two separate columns, combined only when sorting. Never fold site condition into `qual_score`.

The options and points live in `domain/site-condition.ts`, ordered best prospect first. **The points are provisional**: a first guess, to be tuned after real calls. The control, the table, the filter and the stored score all read that one list.

The score is stored when an assessment is saved, so after changing points, refresh existing rows to match (edit the numbers to the new config):

```sql
update public.leads set site_condition_score = case site_condition
  when 'broken' then 30 when 'outdated' then 25 when 'not_mobile' then 25
  when 'thin' then 20 when 'social_only' then 20 when 'directory_only' then 20
  when 'template' then 15 when 'decent' then 5 when 'modern' then 0
end
where site_condition is not null;
```

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
- Motion only in response to actions: the drawer opening (150ms ease-out), its contents fading in when it switches lead (200ms), a status change confirming (600ms coral-tint row flash). Off under reduced motion.
- Never switch leads silently. After a review action the drawer shows the result ("Has website") for 700ms with review actions locked, then moves to the next lead; `J` skips the wait. An undo bar ("<name>: <result> · Undo Z") restores every review field exactly, including automation's website fields, and returns to that lead.
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

_Last updated: end of session 2 (2026-09-23)._

### Built

- **v0.1 (research and first calls):** complete.
  - Email + password sign-in (`@supabase/ssr` cookie sessions, `proxy.ts` refresh and redirect, `(desk)` layout re-checks with `getClaims`).
  - Leads table: title-cased registry text, fixed column widths (Business 300px, Contact takes the rest), sort by score with name as tie-break, sort hints, uniform 48px rows.
  - Filter rail: dental "hide DSOs and duplicates" (on by default), state, city, website, review, stage, score range, specialty. Filters, the selected lead and the view live in the URL.
  - Detail drawer: call card, research links, review card (1–4, website pre-filled for unverified leads), stage select, activity, details. Resizable, width remembered.
  - Review feedback: 700ms confirmation with actions locked before moving to the next lead (`J` skips), fade on lead switch, row flash, undo bar (`Z`) that restores every review field.
  - Keyboard: `/`, `J`/`K`, `1`–`4`, `C`, `L`, `Z`, `Esc`, `?` (shortcuts sheet). Ignored while typing and inside popovers and dialogs.
- **v0.2 (pipeline):** complete, not yet used in a real session.
  - Log a call (`L`): outcome, note, follow-up date. Activity timeline in the drawer; stage changes logged automatically.
  - Due chip in the list header; follow-up dates under the stage in the table (coral when due).
  - Board view grouped by stage (`?view=board`), 50 cards per column then "Show more"; stages change in the drawer, no drag and drop.

### Database (all scripts in `supabase/sql/`, all run by the owner)

- `001_lead_queue_new_columns.sql`: `vertical`, `next_follow_up`, `stage_updated_at` on `leads`; `lead_queue` recreated with them. The adapter filters by vertical.
- `002_qual_score_grading.sql`: graded `qual_score` (max 43, was 30). Before grading the spread was 55 leads at 30, 53 at 25, 344 at 20, 275 at 15, the rest lower (DSOs and duplicates excluded). Also fixed the case-sensitive "management" rule and the area-code rule that penalised leads with no contact phone.
- `003_lead_activities.sql`: `lead_activities` table, index and RLS policy.
- RLS read and update on `leads` work (reviews save).
- Keep view SQL in `supabase/sql/`, not only in chat: chat formatting strips `*`.

### Decisions worth remembering

- Moved from Vite to Next.js for server-side secrets (see Stack). Magic link replaced by password: single user, no benefit.
- Design direction changed in session 1 from the flat proposal to the owner's reference (soft grey shell, rounded panels, pills, coral accent).
- Count circles under the header were built and then removed: they duplicated the filters and the table count.
- Instant auto-advance caused mis-clicks on the next lead; hence the confirmation, lock and undo. Never switch leads silently.
- `cn` must come from `@/lib/utils` (see Stack).
- The owner's machine is behind HTTPS inspection; `NODE_EXTRA_CA_CERTS` is set up (see Local environment).

### Two-person changes (session 3, not yet deployed)

- `supabase/sql/004_attribution.sql` (owner to run): `leads.reviewed_by` set by a trigger when `review_status` changes (cleared when undone to pending), `lead_activities.created_by` defaulting to the signed-in email, `lead_queue` recreated with `reviewed_by`. Both come from `auth.jwt()`, not the browser.
- Review and undo saves only apply if `review_status` still matches what the screen showed (`useUpdateLead`); otherwise the drawer says who reviewed it first and the list refreshes.
- Leads refresh every 60s and on window focus. A successful save re-applies its change so a refresh that landed mid-save can't undo it on screen.
- The drawer shows "Reviewed Sep 23 by Priya" / "by you" and "by …" on each activity (`lib/people.ts`).

### Entity only (session 3)

- Fifth review status `entity_only` ("Entity only", key `5`), end to end: domain vocabulary, `Lead.possibleTradingName` / `possibleWebsite`, adapter read and write, entity-only form in the review card (`features/drawer/entity-only-form.tsx`), undo restores both fields, filter rail and URL filters, "Possibly …" in the table, board, drawer header and details (`components/ui/possible-name.tsx`), a research link for the possible name, search matches it, shortcuts sheet.
- Database: the owner ran `supabase/sql/005_entity_only.sql` (named 005 because 004 was taken by attribution; it recreates `lead_queue` from the 004 view with the two columns appended, since the view lists columns by name rather than `l.*`).
- If saving "Entity only" fails with a check-constraint error, `review_status` has a constraint listing allowed values that needs `entity_only` added.

### Site condition (session 3)

- Built end to end: `domain/site-condition.ts` (options, short labels, provisional points), `Lead.siteCondition` / `siteConditionScore`, adapter, `site_condition` LeadChange (undo restores both fields), the select in the review card (`features/drawer/site-condition-field.tsx`, key `S`), a "Site" column, the default sort, the filter (including "not assessed") and its URL key `site`, and the shortcuts sheet.
- Database: `supabase/sql/006_site_condition.sql` adds the two columns and recreates `lead_queue` from the 005 view with them appended. Named 006 because 005 was taken.
- Incident: the first run added the columns but the view kept the 005 definition, so assessments saved to `leads` but read back as empty (the value vanished after the next refresh). `useLeads` now selects an explicit column list (`READ_COLUMNS` in the adapter, kept in step with `LeadQueueRow`), so a view missing a column fails loudly instead. After any view change, check the API sees the column: `lead_queue?select=<column>&limit=1` with the anon key returns `[]` if it exists and error 42703 if not.

### Known gaps

- `J`/`K` follow the table's sort order in board view too.
- Undo covers the last review only, not calls or follow-ups.
- Logging a call doesn't move a lead from New to Contacted automatically (owner to decide).
- No tests yet (Vitest would need the owner's approval).
- Nothing checked visually by Claude since the drawer: its browser isn't signed in. The owner reviews in their browser.

### Next step

Owner runs `006_site_condition.sql`; then deploy to Vercel (env vars, Supabase site URL, the teammate's account) and the teammate starts research. Candidates after that: tests, auto-moving New to Contacted on a logged call, lead ownership when the teammate starts outreach, v0.3 (PageSpeed scores, n8n triggers via `app/api/`).
