import Image from "next/image"
import { Figtree } from "next/font/google"
import type { TemplateProps } from "../_shared/content"
import { PopoverMenu } from "../_shared/popover-menu"
import {
  bookHref,
  cityLine,
  directionsUrl,
  formatPhone,
  hoursFacts,
  hoursRows,
  mapEmbedUrl,
  phoneHref,
} from "../_shared/practice"
import { TodayBadge } from "../_shared/today"
import { HoursToday } from "./hours-today"
import { illustrations } from "./illustrations"
import { faqs, insurers, modern, parking, reviews, serviceGroups, steps, team } from "./sample"
import s from "./clearview.module.css"

const figtree = Figtree({ subsets: ["latin"], weight: ["400", "500", "600"] })

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Team", href: "#team" },
  { label: "New patients", href: "#new-patients" },
  { label: "Insurance", href: "#insurance" },
  { label: "Visit", href: "#visit" },
]

// Clearview: clean, clinical and straightforward. Teal accent, one sans.
export default function Clearview({ content }: TemplateProps) {
  const p = content.practice
  const phone = formatPhone(p.phone)
  const tel = phoneHref(p.phone)
  const book = bookHref(p)
  const facts = hoursFacts(p.hours)
  const rows = hoursRows(p.hours)

  const scheduleClaim =
    facts.earlyMornings && facts.saturday
      ? "Early mornings and Saturdays"
      : facts.earlyMornings
        ? "Early morning appointments"
        : facts.saturday
          ? "Open Saturdays"
          : "Accepting new patients"
  const headline = content.headline ?? `Straightforward dental care in ${p.city}, on your schedule.`
  const intro =
    content.intro ??
    "Checkups, repairs and emergency visits for the whole family, with written costs before any treatment starts."
  const [featured, ...moreReviews] = reviews

  return (
    <div className={`${s.page} ${figtree.className}`}>
      <header className={s.header}>
        <div className={s.headerInner}>
          <a href="#top" className={s.brand}>
            {p.name}
          </a>
          <div className={s.navWide}>
            <nav aria-label="Main" className={s.navLinks}>
              {NAV.map((l) => (
                <a key={l.href} href={l.href} className={s.navLink}>
                  {l.label}
                </a>
              ))}
            </nav>
            <a href={tel} className={s.headerPhone}>
              {phone}
            </a>
            <a href={book} className={s.btnPrimary}>
              Book a visit
            </a>
          </div>
          <div className={s.navCompact}>
            <a href={book} className={`${s.btnPrimary} ${s.hideSmall}`}>
              Book a visit
            </a>
            <PopoverMenu
              links={NAV}
              classNames={{ button: s.menuButton, panel: s.menuPanel, link: s.menuLink }}
              footer={
                <a href={tel} className={s.menuPhone}>
                  Call {phone}
                </a>
              }
            />
          </div>
        </div>
      </header>

      <main id="top">
        <section aria-labelledby="hero-h" className={`${s.wrap} ${s.hero}`}>
          <div className={s.heroText}>
            <h1 id="hero-h" className={s.h1}>
              {headline}
            </h1>
            <p className={s.lead}>{intro}</p>
            <div className={s.actions}>
              <a href={book} className={`${s.btnPrimary} ${s.btnLarge}`}>
                Book a visit
              </a>
              <a href={tel} className={`${s.btnSecondary} ${s.btnLarge}`}>
                Call {phone}
              </a>
            </div>
            <ul className={s.trust}>
              <li>
                <ClockIcon />
                {scheduleClaim}
              </li>
              <li>
                <PhoneIcon />
                Same-day emergency visits
              </li>
              <li>
                <ShieldIcon />
                Most insurance accepted
              </li>
            </ul>
          </div>
          <div className={s.heroPhoto}>
            <Image
              src="/demos/clearview/hero.webp"
              alt="A bright, empty treatment room with a white dental chair beside a window"
              width={1200}
              height={1800}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <HoursToday hours={p.hours} tel={tel} phone={phone} />
          </div>
        </section>

        <section id="services" aria-labelledby="services-h" className={`${s.wrap} ${s.section}`}>
          <div className={s.sectionHead}>
            <h2 id="services-h" className={s.h2}>
              Services
            </h2>
            <p className={s.sectionIntro}>Routine care, repairs and a few extras, all handled in one office by the same team.</p>
          </div>
          <div className={s.serviceGroups}>
            {serviceGroups.map((group) => (
              <div key={group.title} className={s.serviceGroup}>
                <h3 className={s.groupTitle}>{group.title}</h3>
                <ul className={s.serviceList}>
                  {group.items.map(([name, desc, icon]) => (
                    <li key={name}>
                      {illustrations[icon]}
                      <div>
                        <h4 className={s.serviceName}>{name}</h4>
                        <p className={s.muted}>{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <aside aria-label="Emergency care" className={s.emergency}>
            {illustrations.emergency}
            <div className={s.emergencyBody}>
              <p className={s.emergencyTitle}>Tooth pain, swelling or a broken tooth?</p>
              <p className={s.emergencyText}>Call as early as you can. We keep time free every day for emergency visits.</p>
            </div>
            <a href={tel} className={`${s.btnPrimary} ${s.btnLarge}`}>
              Call {phone}
            </a>
          </aside>
        </section>

        <section aria-labelledby="modern-h" className={`${s.wrap} ${s.section}`}>
          <h2 id="modern-h" className={s.h2}>
            Modern care, in plain words
          </h2>
          <div className={s.modernGrid}>
            {modern.map((m) => (
              <article key={m.title}>
                <div className={s.photo43}>
                  <Image src={m.photo.src} alt={m.photo.alt} width={m.photo.width} height={m.photo.height} sizes="(min-width: 1024px) 33vw, 100vw" />
                </div>
                <h3 className={s.h3Large}>{m.title}</h3>
                <p className={s.body}>{m.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="team" aria-labelledby="team-h" className={`${s.wrap} ${s.section}`}>
          <h2 id="team-h" className={s.h2}>
            Meet the team
          </h2>
          <div className={s.teamGrid} data-count={team.length}>
            {team.map((d) => (
              <article key={d.name}>
                <div className={s.photo45}>
                  <Image src={d.photo.src} alt={`Portrait of ${d.name}`} width={d.photo.width} height={d.photo.height} sizes="(min-width: 1024px) 33vw, (min-width: 720px) 50vw, 100vw" />
                </div>
                <h3 className={s.h3Large}>{d.name}</h3>
                <p className={s.role}>{d.role}</p>
                <p className={s.body}>{d.bio}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="reviews-h" className={`${s.wrap} ${s.section}`}>
          <h2 id="reviews-h" className={s.h2}>
            What patients say
          </h2>
          <div className={s.reviews}>
            <figure className={s.reviewFeatured}>
              <blockquote>“{featured.quote}”</blockquote>
              <figcaption>{featured.who}</figcaption>
            </figure>
            <div className={s.reviewStack}>
              {moreReviews.map((r) => (
                <figure key={r.who} className={s.review}>
                  <blockquote>“{r.quote}”</blockquote>
                  <figcaption>{r.who}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="new-patients" aria-labelledby="first-h" className={s.band}>
          <div className={s.wrapInner}>
          <h2 id="first-h" className={s.h2}>
            Your first visit
          </h2>
          <p className={s.sectionIntro}>Plan on about an hour, start to finish.</p>
          <ol className={s.steps}>
            {steps.map(([title, text], i) => (
              <li key={title} className={s.step}>
                <span className={s.stepNumber} aria-hidden>
                  {i + 1}
                </span>
                <h3 className={s.h3}>
                  <span className={s.srOnly}>Step {i + 1}: </span>
                  {title}
                </h3>
                <p className={s.body}>{text}</p>
              </li>
            ))}
          </ol>
          <aside id="insurance" aria-labelledby="ins-h" className={s.insurance}>
            <div>
              <h3 id="ins-h" className={s.insTitle}>
                Insurance we accept
              </h3>
              <p className={s.insText}>We&apos;re in network with these plans and file claims for you.</p>
            </div>
            <div>
              <ul className={s.chips}>
                {insurers.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <p className={s.insText}>
                <strong>No insurance?</strong> Our membership plan covers two cleanings, exams and X-rays each year for
                one monthly fee.
              </p>
            </div>
          </aside>
          </div>
        </section>

        <section aria-labelledby="faq-h" className={`${s.wrap} ${s.sectionAfterBand}`}>
          <h2 id="faq-h" className={s.h2}>
            Frequently asked questions
          </h2>
          <div className={s.faq}>
            {faqs.map((f) => (
              <details key={f.q} name="faq" className={s.faqItem}>
                <summary className={s.faqQ}>
                  <span>{f.q}</span>
                  <ChevronIcon />
                </summary>
                <p className={s.faqA}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="visit" aria-labelledby="visit-h" className={s.visit}>
          <div className={s.wrapInner}>
            <h2 id="visit-h" className={s.h2}>
              Visit us
            </h2>
            <div className={s.visitGrid}>
              <div className={s.visitInfo}>
                <address className={s.address}>
                  {p.street}
                  {p.suite && (
                    <>
                      <br />
                      {p.suite}
                    </>
                  )}
                  <br />
                  {cityLine(p)}
                </address>
                <p className={s.body}>{parking}</p>
                <div className={s.contactLinks}>
                  <a href={tel}>{phone}</a>
                  {p.email && <a href={`mailto:${p.email}`}>{p.email}</a>}
                  <a href={directionsUrl(p)}>Get directions</a>
                </div>
              </div>
              <div className={s.hoursCard}>
                <table className={s.hours}>
                  <caption>Opening hours</caption>
                  <tbody>
                    {rows.map((h) => (
                      <tr key={h.label}>
                        <th scope="row">
                          {h.label}
                          <TodayBadge days={h.days} className={s.today} />
                        </th>
                        <td>{h.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <iframe
                title={`Map showing ${p.name}`}
                src={mapEmbedUrl(p)}
                className={s.map}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        <section id="book" aria-labelledby="close-h" className={`${s.wrap} ${s.closing}`}>
          <div className={s.closingCard}>
            <div>
              <h2 id="close-h" className={s.closingTitle}>
                Book your next visit at {p.name}.
              </h2>
              <p className={s.closingText}>
                {p.bookUrl ? "Pick a time online, or call and we'll find one with you." : "Call and we'll find a time that works for you."}
              </p>
            </div>
            <div className={s.actions}>
              {p.bookUrl && (
                <a href={p.bookUrl} className={`${s.btnPrimary} ${s.btnLarge}`}>
                  Book online
                </a>
              )}
              <a href={tel} className={`${p.bookUrl ? s.btnWhite : s.btnPrimary} ${s.btnLarge}`}>
                Call {phone}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footerInner}>
          <div>
            <p className={s.footerName}>{p.name}</p>
            <p>
              {[p.street, p.suite, cityLine(p)].filter(Boolean).join(", ")}
            </p>
          </div>
          <p>
            © {new Date().getFullYear()} {p.name}
          </p>
        </div>
      </footer>

      <div className={s.mobileBar}>
        <a href={tel} className={s.btnSecondary}>
          Call
        </a>
        {p.bookUrl ? (
          <a href={p.bookUrl} className={s.btnPrimary}>
            Book
          </a>
        ) : (
          <a href={directionsUrl(p)} className={s.btnPrimary}>
            Directions
          </a>
        )}
      </div>
    </div>
  )
}

function Icon({ d }: { d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

function ClockIcon() {
  return <Icon d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2" />
}

function PhoneIcon() {
  return <Icon d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
}

function ShieldIcon() {
  return <Icon d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1zM9 12l2 2 4-4" />
}

function ChevronIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}
