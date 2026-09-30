import Image from "next/image"
import { DM_Serif_Display, Karla } from "next/font/google"
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
  pluralDays,
} from "../_shared/practice"
import { TodayBadge } from "../_shared/today"
import { BookingForm } from "./booking-form"
import { comforts, firstVisit, insurers, parking, reviews, services, team } from "./sample"
import s from "./brightwater.module.css"

const serif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--bw-serif" })
const karla = Karla({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Our team", href: "#team" },
  { label: "New patients", href: "#new-patients" },
  { label: "Visit", href: "#visit" },
]

// Brightwater: warm, editorial, unhurried. Cream and navy, a serif voice.
export default function Brightwater({ content }: TemplateProps) {
  const p = content.practice
  const phone = formatPhone(p.phone)
  const tel = phoneHref(p.phone)
  const book = bookHref(p)
  const facts = hoursFacts(p.hours)

  const hoursCell = facts.saturday
    ? { title: "Open Saturdays", note: facts.lateDays.length ? `Plus late ${pluralDays(facts.lateDays)}` : "Weekday appointments too" }
    : facts.lateDays.length
      ? { title: `Open late ${pluralDays(facts.lateDays)}`, note: "Appointments after work" }
      : { title: "Same-day emergencies", note: "Call first thing and we'll fit you in" }
  const headline = content.headline ?? `Unhurried care for every smile in ${p.city}.`
  const intro =
    content.intro ??
    "Checkups, fillings, whitening and emergency visits in a quiet neighborhood practice. We explain everything before we start, and we never rush."

  return (
    <div className={`${s.page} ${karla.className} ${serif.variable}`}>
      <div className={s.emergencyBar}>
        <span>Toothache or broken tooth? Same-day emergency visits.</span>
        <a href={tel}>Call {phone}</a>
      </div>

      <header className={s.header}>
        <div className={s.headerInner}>
          <a href="#top" className={s.brand}>
            <span className={s.brandMark} aria-hidden />
            <span>{p.name}</span>
          </a>
          <nav aria-label="Main" className={s.navWide}>
            {NAV.map((l) => (
              <a key={l.href} href={l.href} className={s.navLink}>
                {l.label}
              </a>
            ))}
            <a href={book} className={s.btnPrimary}>
              Book a visit
            </a>
          </nav>
          <div className={s.navCompact}>
            <PopoverMenu
              links={NAV}
              classNames={{ button: s.menuButton, panel: s.menuPanel, link: s.menuLink }}
              footer={
                <a href={tel} className={s.menuLink}>
                  Call {phone}
                </a>
              }
            />
          </div>
        </div>
      </header>

      <main id="top">
        <section aria-labelledby="hero-h" className={s.hero}>
          <h1 id="hero-h" className={s.h1}>
            {headline}
          </h1>
          <p className={s.lead}>{intro}</p>
          <div className={s.heroActions}>
            <a href={book} className={`${s.btnPrimary} ${s.btnLarge}`}>
              Book an appointment
            </a>
            <a href={tel} className={`${s.btnOutline} ${s.btnLarge}`}>
              Call {phone}
            </a>
          </div>
          <div className={s.heroPhoto}>
            <Image
              src="/demos/brightwater/hero.webp"
              alt="A dentist in navy scrubs showing a patient her treatment plan on a tablet in a sunny treatment room"
              width={1916}
              height={821}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1248px) 1200px, 100vw"
            />
          </div>
        </section>

        <section aria-label="At a glance" className={s.wrap}>
          <ul className={s.glance}>
            <li>
              <span className={s.glanceTitle}>Accepting new patients</span>
              <span className={s.glanceNote}>Kids and adults welcome</span>
            </li>
            <li>
              <span className={s.glanceTitle}>{hoursCell.title}</span>
              <span className={s.glanceNote}>{hoursCell.note}</span>
            </li>
            <li>
              <span className={s.glanceTitle}>Most PPO plans</span>
              <span className={s.glanceNote}>We file claims for you</span>
            </li>
          </ul>
        </section>

        <section id="services" aria-labelledby="services-h" className={s.band}>
          <div className={s.wrapInner}>
            <div className={s.sectionHead}>
              <h2 id="services-h" className={s.h2}>
                Everything your teeth need, under one roof.
              </h2>
              <p className={s.sectionIntro}>From a child&apos;s first visit to a full crown, you&apos;ll see the same small team every time.</p>
            </div>
            <ul className={s.services}>
              {services.map(([name, slug, desc]) => (
                <li key={slug}>
                  <Image src={`/demos/brightwater/icons/${slug}.webp`} alt="" width={72} height={72} className={s.serviceIcon} />
                  <h3 className={s.serviceName}>{name}</h3>
                  <p className={s.body}>{desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="calm-h" className={`${s.wrap} ${s.split}`}>
          <div className={`${s.splitPhoto} ${s.reveal}`}>
            <Image
              src="/demos/brightwater/waiting-area.webp"
              alt="A calm waiting area with a cushioned oak bench, armchairs, a round coffee table and plants in natural light"
              width={1000}
              height={875}
              sizes="(min-width: 960px) 50vw, 100vw"
            />
          </div>
          <div>
            <h2 id="calm-h" className={s.h2}>
              Nervous about the dentist? You set the pace.
            </h2>
            <ul className={s.comforts}>
              {comforts.map(([title, text]) => (
                <li key={title}>
                  <span className={s.dot} aria-hidden />
                  <p>
                    <strong>{title}</strong> {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="team" aria-labelledby="team-h" className={s.teamBand}>
          <div className={s.wrapInner}>
            <h2 id="team-h" className={s.h2}>
              Meet the dentists.
            </h2>
            <div className={s.teamGrid}>
              {team.map((d) => (
                <article key={d.name}>
                  <div className={s.portrait}>
                    <Image src={d.photo} alt={`Portrait of ${d.name}`} width={800} height={1000} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                  </div>
                  <h3 className={s.teamName}>{d.name}</h3>
                  <p className={s.teamRole}>{d.role}</p>
                  <p className={s.teamBio}>{d.bio}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-label="What patients say" className={`${s.wrap} ${s.reviewsSection}`}>
          <div className={s.reviews}>
            {reviews.map((r) => (
              <figure key={r.who} className={s.review}>
                <blockquote>“{r.quote}”</blockquote>
                <figcaption>{r.who}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="new-patients" aria-labelledby="first-h" className={s.band}>
          <div className={`${s.wrapInner} ${s.firstGrid}`}>
            <div>
              <h2 id="first-h" className={s.h2}>
                Your first visit.
              </h2>
              <p className={s.sectionIntroTight}>Plan on about 75 minutes. Bring your insurance card, a photo ID and a list of any medications.</p>
              <ol className={s.firstList}>
                {firstVisit.map((item, i) => (
                  <li key={item}>
                    <span className={s.firstNumber} aria-hidden>
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
            <div className={s.insuranceCard}>
              <h3 className={s.cardTitle}>Insurance and payment</h3>
              <p className={s.body}>We&apos;re in network with most PPO plans and file claims on your behalf.</p>
              <ul className={s.chips}>
                {insurers.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <p className={s.noInsurance}>
                <strong>No insurance?</strong> Our membership plan covers two cleanings, exams and X-rays each year for $329,
                with 15% off other treatment.
              </p>
            </div>
          </div>
        </section>

        <section id="book" aria-labelledby="book-h" className={s.bookSection}>
          <div className={s.bookInner}>
            <h2 id="book-h" className={`${s.h2} ${s.center}`}>
              Request an appointment.
            </h2>
            <p className={`${s.sectionIntro} ${s.center}`}>Pick a time that suits you. We&apos;ll call within one business day to confirm.</p>
            <div className={s.bookCard}>
              <BookingForm hours={p.hours} phone={phone} />
            </div>
            {p.bookUrl && (
              <p className={`${s.formNote} ${s.center}`}>
                Prefer to book yourself? <a href={p.bookUrl}>Book online</a>
              </p>
            )}
          </div>
        </section>

        <section id="visit" aria-labelledby="visit-h" className={s.band}>
          <div className={`${s.wrapInner} ${s.visitGrid}`}>
            <div>
              <h2 id="visit-h" className={s.h2}>
                Visit us.
              </h2>
              <address className={s.address}>
                {p.street}
                {p.suite ? `, ${p.suite}` : ""}
                <br />
                {cityLine(p)}
              </address>
              <p className={s.body}>{parking}</p>
              <div className={s.contact}>
                <a href={tel} className={s.strong}>
                  {phone}
                </a>
                {p.email && <a href={`mailto:${p.email}`}>{p.email}</a>}
                <a href={directionsUrl(p)}>Get directions</a>
              </div>
            </div>
            <div>
              <h3 className={s.hoursTitle}>Hours</h3>
              <table className={s.hours}>
                <tbody>
                  {hoursRows(p.hours).map((h) => (
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
            <iframe title={`Map showing ${p.name}`} src={mapEmbedUrl(p)} className={s.map} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <span>
          © {new Date().getFullYear()} {p.name}
        </span>
        <span>
          {p.street}, {cityLine(p)}
        </span>
      </footer>

      <div className={s.mobileBar}>
        <a href={tel} className={s.btnOutline}>
          Call
        </a>
        <a href={book} className={s.btnPrimary}>
          Book
        </a>
      </div>
    </div>
  )
}
