-- Recreate lead_queue with the columns added by the setup checklist:
-- vertical, next_follow_up, stage_updated_at.
--
-- The scoring rules are unchanged from the current view. New columns are
-- appended at the end, which CREATE OR REPLACE VIEW allows, so nothing needs
-- to be dropped.
--
-- Run in the Supabase SQL Editor. Copy it from this file, not from a chat:
-- chat formatting strips the `*` characters.

-- 1. Columns on leads (safe to run again if they already exist).
alter table public.leads
  add column if not exists vertical text not null default 'dental',
  add column if not exists next_follow_up date,
  add column if not exists stage_updated_at timestamptz;

create index if not exists leads_vertical_idx on public.leads (vertical);

-- 2. The view.
create or replace view public.lead_queue
with (security_invoker = true)
as
with base as (
  select
    l.id, l.npi, l.business_name, l.specialty, l.phone, l.address, l.address_2,
    l.city, l.state, l.zip, l.website, l.website_status, l.performance_score,
    l.accessibility_score, l.seo_score, l.lead_score, l.lead_reason,
    l.contact_name, l.contact_email, l.contact_linkedin, l.outreach_message,
    l.status, l.source, l.created_at, l.updated_at, l.dba_name, l.taxonomy_code,
    l.taxonomy_group, l.contact_phone, l.contact_title, l.npi_status,
    l.enumeration_date, l.last_updated_nppes, l.years_since_update,
    l.review_status, l.review_notes, l.reviewed_at, l.website_source,
    regexp_replace(coalesce(l.phone, ''), '\D', '', 'g') as phone_digits,
    regexp_replace(coalesce(l.contact_phone, ''), '\D', '', 'g') as contact_digits,
    case
      when trim(both from coalesce(l.contact_name, '')) = '' then ''
      else upper(split_part(trim(both from l.contact_name), ' ', 1)) || '|'
        || soundex(regexp_replace(trim(both from l.contact_name), '^.*\s', ''))
    end as official_key,
    -- new columns
    l.vertical, l.next_follow_up, l.stage_updated_at
  from leads l
),
official_counts as (
  select official_key, count(*) as official_org_count
  from base
  where official_key <> ''
  group by official_key
),
ranked as (
  select
    b.*,
    coalesce(oc.official_org_count, 1::bigint) as official_org_count,
    row_number() over (partition by b.phone_digits order by b.id) as phone_rank
  from base b
  left join official_counts oc using (official_key)
)
select
  id, npi, business_name, specialty, phone, address, address_2, city, state, zip,
  website, website_status, performance_score, accessibility_score, seo_score,
  lead_score, lead_reason, contact_name, contact_email, contact_linkedin,
  outreach_message, status, source, created_at, updated_at, dba_name,
  taxonomy_code, taxonomy_group, contact_phone, contact_title, npi_status,
  enumeration_date, last_updated_nppes, years_since_update, review_status,
  review_notes, reviewed_at, website_source, phone_digits, contact_digits,
  official_key, official_org_count, phone_rank,
  phone_rank > 1 as is_duplicate,
  case when official_org_count >= 3 then -50 else 0 end
  + case when contact_title ~* '(credential|billing|compliance|payor|insurance|operations|revenue|\mcoo\M)' then -30 else 0 end
  + case when contact_title ~* '(administrator|business office)' then -10 else 0 end
  + case when business_name ~* '^\d+ .*(professional|services)' and coalesce(dba_name, '') <> '' then -15 else 0 end
  + case when business_name ~ '\mmanagement\M' then -15 else 0 end
  + case when address ~* '\mAPT\M' then -10 else 0 end
  + case when left(phone_digits, 3) <> left(contact_digits, 3) then -5 else 0 end
  + case when years_since_update >= 15 then -5 else 0 end
  + case when contact_title ~* '(owner|dentist|dds|dmd|president|member|partner|office manager|proprietor|doctor)' then 15 else 0 end
  + case when years_since_update <= 2 then 10 else 0 end
  + case when taxonomy_group ~~* '%single specialty%' then 5 else 0 end
  as qual_score,
  -- new columns, appended so existing columns keep their positions
  vertical, next_follow_up, stage_updated_at
from ranked r;
