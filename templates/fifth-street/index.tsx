import Image from "next/image"
import { Bricolage_Grotesque } from "next/font/google"
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
  streetName,
} from "../_shared/practice"
import { TodayBadge } from "../_shared/today"
import { serviceGroups, serviceIcons } from "./icons"
import { faqs, insurers, parking, priceNote, prices, reviews, steps, team } from "./sample"
import s from "./fifth-street.module.css"

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "500", "700", "800"] })

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Team", href: "#team" },
  { label: "Prices", href: "#prices" },
  { label: "Visit", href: "#visit" },
]

// Fifth Street: bold, friendly, a little playful. Yellow, black, outlines.
export default function FifthStreet({ content }: TemplateProps) {
  const p = content.practice
  const phone = formatPhone(p.phone)
  const tel = phoneHref(p.phone)
  const book = bookHref(p)
  const facts = hoursFacts(p.hours)

  const hoursClaim = facts.lateDays.length
    ? `Open late ${pluralDays(facts.lateDays)}`
    : facts.saturday
      ? "Open Saturdays"
      : "Same-day emergencies"
  const hoursWhy =
    facts.lateDays.length || facts.saturday
      ? {
          title: [facts.lateDays.length ? `Late ${pluralDays(facts.lateDays)}` : null, facts.saturday ? "Saturday mornings" : null]
            .filter(Boolean)
            .join(" and ") + ".",
          text: "Appointments outside school and work hours, so you don't have to miss either.",
        }
      : { title: "Same-day emergency visits.", text: "Call first thing with tooth pain and we'll do our best to see you that day." }
  const why = [
    { title: "Appointments that run on time.", text: "We don't overbook, so you're in the chair when you expected to be." },
    { title: "Costs explained before treatment.", text: "You'll see the price, and what your insurance covers, before we start anything." },
    hoursWhy,
  ]
  const headline = content.headline ?? `${p.city}'s friendly neighborhood dentist.`
  const intro =
    content.intro ?? `Checkups, fillings and same-day emergency care for the whole family, right here on ${streetName(p)}.`

  return (
    <div className={`${s.page} ${bricolage.className}`}>
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
            <a href={book} className={s.btnInk}>
              Book a visit
            </a>
          </div>
          <div className={s.navCompact}>
            <a href={book} className={`${s.btnInk} ${s.hideSmall}`}>
              Book a visit
            </a>
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
        <section aria-labelledby="hero-h" className={`${s.wrap} ${s.hero}`}>
          <h1 id="hero-h" className={s.h1}>
            {headline}
          </h1>
          <div className={s.heroRow}>
            <p className={s.lead}>{intro}</p>
            <div className={s.actions}>
              <a href={book} className={`${s.btnInk} ${s.btnLarge}`}>
                Book a visit
              </a>
              <a href={tel} className={`${s.btnYellow} ${s.btnLarge}`}>
                <span>Call</span>
                <span>{phone}</span>
              </a>
            </div>
          </div>
          <div className={s.heroPhoto}>
            <Image
              src="/demos/fifth-street/hero.webp"
              alt="A dentist talking with a smiling patient in a bright treatment room"
              width={1920}
              height={1440}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1368px) 1320px, 100vw"
            />
            <span className={`${s.sticker} ${s.stickerA}`}>{hoursClaim}</span>
            <span className={`${s.sticker} ${s.stickerB}`}>New patients welcome</span>
          </div>
        </section>

        <section id="services" aria-labelledby="services-h" className={`${s.wrap} ${s.section}`}>
          <div className={s.sectionHead}>
            <h2 id="services-h" className={s.h2}>
              What we do
            </h2>
            <p className={s.sectionIntro}>Everyday dentistry for kids and grown-ups, plus the bigger jobs, all under one roof.</p>
          </div>
          {serviceGroups.map((group) => (
            <div key={group.title} className={s.serviceGroup}>
              <h3 className={s.groupTitle}>{group.title}</h3>
              <ul className={s.serviceGrid}>
                {group.items.map((item) => (
                  <li key={item.name} className={s.serviceCard}>
                    {serviceIcons[item.icon]}
                    <h4 className={s.serviceName}>{item.name}</h4>
                    <p className={s.muted}>{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section id="prices" aria-labelledby="prices-h" className={s.prices}>
          <div className={s.wrapInner}>
            <h2 id="prices-h" className={s.h2Loud}>
              Straight-up prices
            </h2>
            <div className={s.priceGrid}>
              {prices.map((x) => (
                <div key={x.label} className={s.priceCard}>
                  <h3 className={s.priceLabel}>{x.label}</h3>
                  <p className={s.price}>{x.price}</p>
                </div>
              ))}
            </div>
            <p className={s.priceNote}>{priceNote}</p>
          </div>
        </section>

        <section aria-labelledby="why-h" className={`${s.wrap} ${s.section}`}>
          <h2 id="why-h" className={s.h2}>
            Why neighbors pick us
          </h2>
          <div className={s.why}>
            {why.map((w) => (
              <div key={w.title} className={s.whyRow}>
                <h3 className={s.whyTitle}>{w.title}</h3>
                <p className={s.whyText}>{w.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="team" aria-labelledby="team-h" className={s.tintBand}>
          <div className={s.wrapInner}>
            <h2 id="team-h" className={s.h2}>
              Meet the team
            </h2>
            <div className={s.teamGrid}>
              {team.map((d) => (
                <article key={d.name} className={s.teamCard}>
                  <div className={s.teamPhoto}>
                    <Image src={d.photo.src} alt={`Portrait of ${d.name}`} width={d.photo.width} height={d.photo.height} sizes="(min-width: 900px) 50vw, 100vw" />
                  </div>
                  <div className={s.teamBody}>
                    <h3 className={s.teamName}>{d.name}</h3>
                    <p className={s.rolePill}>{d.role}</p>
                    <p className={s.teamBio}>{d.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="reviews-h" className={`${s.wrap} ${s.section}`}>
          <h2 id="reviews-h" className={s.h2}>
            From the neighborhood
          </h2>
          <div className={s.reviews}>
            {reviews.map((r) => (
              <figure key={r.who} className={s.review}>
                <blockquote>“{r.quote}”</blockquote>
                <figcaption>
                  {r.who}
                  <span>, {p.city}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section aria-labelledby="first-h" className={s.tintBand}>
          <div className={`${s.wrapInner} ${s.firstGrid}`}>
            <div>
              <h2 id="first-h" className={s.h2}>
                Your first visit
              </h2>
              <p className={s.sectionIntroTop}>Plan on about an hour. Here&apos;s how it goes.</p>
              <ol className={s.steps}>
                {steps.map(([title, text], i) => (
                  <li key={title}>
                    <span className={s.stepNumber} aria-hidden>
                      {i + 1}
                    </span>
                    <div>
                      <h3 className={s.stepTitle}>
                        <span className={s.srOnly}>Step {i + 1}: </span>
                        {title}
                      </h3>
                      <p className={s.muted}>{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <aside aria-labelledby="ins-h" className={s.insurance}>
              <h3 id="ins-h" className={s.insTitle}>
                Insurance we take
              </h3>
              <p className={s.muted}>We&apos;re in network with these plans and file the claims for you.</p>
              <ul className={s.chips}>
                {insurers.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <p className={s.muted}>Don&apos;t see yours? Give us a call and we&apos;ll check.</p>
            </aside>
          </div>
        </section>

        <section aria-labelledby="faq-h" className={`${s.faqWrap} ${s.section}`}>
          <h2 id="faq-h" className={s.h2}>
            Good questions
          </h2>
          <div className={s.faq}>
            {faqs.map((f, i) => (
              <details key={f.q} name="faq" className={s.faqItem} open={i === 0}>
                <summary className={s.faqQ}>
                  <span>{f.q}</span>
                  <span className={s.faqMark} aria-hidden>
                    <svg width="16" height="16" viewBox="0 0 16 16">
                      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className={s.faqA}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="visit" aria-labelledby="visit-h" className={`${s.wrap} ${s.visitSection}`}>
          <h2 id="visit-h" className={s.h2}>
            Come find us
          </h2>
          <div className={s.visitGrid}>
            <div className={s.visitInfo}>
              <address className={s.address}>
                {p.street}
                {p.suite ? `, ${p.suite}` : ""}
                <br />
                {cityLine(p)}
              </address>
              <p className={s.muted}>{parking}</p>
              <div className={s.contact}>
                <a href={tel}>{phone}</a>
                {p.email && <a href={`mailto:${p.email}`}>{p.email}</a>}
                <a href={directionsUrl(p)}>Get directions</a>
              </div>
            </div>
            <div className={s.hoursCard}>
              <table className={s.hours}>
                <caption>Hours</caption>
                <tbody>
                  {hoursRows(p.hours).map((h) => (
                    <tr key={h.label} data-late={h.late}>
                      <th scope="row">
                        {h.label}
                        <TodayBadge days={h.days} className={s.pill} />
                      </th>
                      <td>
                        {h.time}
                        {h.late && <span className={s.pill}>Late</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <iframe title={`Map showing ${p.name}`} src={mapEmbedUrl(p)} className={s.map} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </section>

        <section id="book" aria-labelledby="close-h" className={s.closing}>
          <div className={s.wrapInner}>
            <h2 id="close-h" className={s.closingTitle}>
              Let&apos;s find you a time.
            </h2>
            <p className={s.closingText}>
              {p.bookUrl
                ? "Book online in a couple of minutes, or call and talk to a real person at the front desk."
                : "Call and talk to a real person at the front desk. We'll find a time that works."}
            </p>
            <div className={s.actions}>
              {p.bookUrl && (
                <a href={p.bookUrl} className={`${s.btnInk} ${s.btnLarge}`}>
                  Book online
                </a>
              )}
              <a href={tel} className={`${p.bookUrl ? s.btnPaper : s.btnInk} ${s.btnLarge}`}>
                <span>Call</span>
                <span>{phone}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footerInner}>
          <span className={s.footerName}>{p.name}</span>
          <span>
            {p.street}, {cityLine(p)}
          </span>
          <a href={tel}>{phone}</a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>

      <div className={s.mobileBar}>
        <a href={tel} className={s.btnYellow}>
          Call
        </a>
        <a href={book} className={s.btnInk}>
          Book
        </a>
      </div>
    </div>
  )
}
