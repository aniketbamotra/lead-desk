import Image from "next/image"
import { Inter_Tight } from "next/font/google"
import type { TemplateProps } from "../_shared/content"
import { PopoverMenu } from "../_shared/popover-menu"
import { bookHref, cityLine, directionsUrl, formatPhone, hoursRows, mapEmbedUrl, phoneHref } from "../_shared/practice"
import { TodayBadge } from "../_shared/today"
import { CompareSlider } from "./compare-slider"
import { dentists, faqs, insurers, parking, payment, reviews, steps, treatmentGroups } from "./sample"
import s from "./harlow.module.css"

const inter = Inter_Tight({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

const NAV = [
  { label: "Treatments", href: "#treatments" },
  { label: "Results", href: "#results" },
  { label: "About", href: "#about" },
  { label: "Visit", href: "#visit" },
]

// Harlow: quiet luxury for cosmetic and restorative work. Dark, light type.
export default function Harlow({ content }: TemplateProps) {
  const p = content.practice
  const phone = formatPhone(p.phone)
  const tel = phoneHref(p.phone)
  const book = bookHref(p)

  const headline = content.headline ?? "Natural-looking dental work, planned with care."
  const intro = content.intro ?? `Cosmetic and restorative dentistry in ${p.city}, with general care for the whole mouth.`

  return (
    <div className={`${s.page} ${inter.className}`}>
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
            <a href={tel} className={s.navLink}>
              {phone}
            </a>
            <a href={book} className={s.btnLight}>
              Book a consultation
            </a>
          </div>
          <div className={s.navCompact}>
            <a href={book} className={`${s.btnLight} ${s.hideSmall}`}>
              Book a consultation
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
        <section aria-labelledby="hero-h" className={s.hero}>
          <div className={s.heroPhoto}>
            <Image
              src="/demos/harlow/hero.webp"
              alt="Close-up of a natural, confident smile against a dark background"
              width={2000}
              height={1333}
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
            />
          </div>
          <div className={s.heroText}>
            <h1 id="hero-h" className={s.h1}>
              {headline}
            </h1>
            <p className={s.heroLead}>{intro}</p>
            <div className={s.heroActions}>
              <a href={book} className={`${s.btnLight} ${s.btnLarge}`}>
                Book a consultation
              </a>
              <a href={tel} className={s.linkCall}>
                Call {phone}
              </a>
            </div>
          </div>
        </section>

        <section aria-label="Our approach" className={`${s.wrap} ${s.section}`}>
          <div className={s.approach}>
            <p className={s.approachText}>
              We aim for results that look like your own teeth, only healthier. Before any treatment, you&apos;ll see a digital preview, a
              written plan and the full cost.
            </p>
            <ul className={s.markList}>
              <li>Free cosmetic consultations</li>
              <li>Payment plans available</li>
              <li>New patients welcome</li>
            </ul>
          </div>
        </section>

        <section id="treatments" aria-labelledby="treat-h" className={`${s.wrap} ${s.sectionTight}`}>
          <h2 id="treat-h" className={s.h2}>
            Treatments
          </h2>
          {treatmentGroups.map((g) => (
            <div key={g.title} className={s.treatGroup}>
              <h3 className={s.groupTitle}>{g.title}</h3>
              <ul className={s.treatList}>
                {g.items.map(([name, desc]) => (
                  <li key={name}>
                    <span className={s.treatName}>{name}</span>
                    <span className={s.muted}>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section id="results" aria-labelledby="results-h" className={s.results}>
          <div className={s.resultsHead}>
            <h2 id="results-h" className={s.h2}>
              Results
            </h2>
            <p className={s.mutedDark}>Drag the handle, or focus it and use the arrow keys, to compare.</p>
          </div>
          <figure className={s.resultsFigure}>
            <CompareSlider src="/demos/harlow/hero.webp" width={2000} height={1333} alt="The same smile after treatment" />
            <figcaption className={s.resultsCaption}>
              <span>Porcelain veneers on six upper teeth, completed in three visits.</span>
              <span className={s.mutedDark}>Example case. Before-and-after photos of your own patients go here.</span>
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby="how-h" className={`${s.wrap} ${s.section}`}>
          <h2 id="how-h" className={s.h2}>
            How it works
          </h2>
          <ol className={s.steps}>
            {steps.map(([title, text], i) => (
              <li key={title}>
                <p className={s.stepNumber}>Step {i + 1}</p>
                <h3 className={s.stepTitle}>{title}</h3>
                <p className={s.muted}>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="about" aria-labelledby="about-h" className={`${s.wrap} ${s.sectionTight}`}>
          <h2 id="about-h" className={s.h2}>
            {dentists.length > 1 ? "Meet the dentists" : "Meet the dentist"}
          </h2>
          {dentists.map((d) => (
            <article key={d.name} className={s.dentist}>
              <div className={s.portrait}>
                <Image src={d.photo.src} alt={`Portrait of ${d.name}`} width={d.photo.width} height={d.photo.height} sizes="(min-width: 900px) 45vw, 100vw" />
              </div>
              <div>
                <h3 className={s.dentistName}>{d.name}</h3>
                <p className={s.muted}>{d.role}</p>
                <p className={s.bio}>{d.bio}</p>
                <ul className={s.creds}>
                  {d.creds.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>

        <section aria-labelledby="reviews-h" className={s.stoneBand}>
          <div className={s.wrapInner}>
            <h2 id="reviews-h" className={s.h2}>
              What patients say
            </h2>
            <div className={s.reviews}>
              {reviews.map((r) => (
                <figure key={r.who} className={s.review}>
                  <blockquote>“{r.quote}”</blockquote>
                  <figcaption>{r.who}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="faq-h" className={`${s.wrap} ${s.section}`}>
          <div className={s.faqGrid}>
            <div>
              <h2 id="faq-h" className={s.h2}>
                Questions and costs
              </h2>
              <p className={s.payment}>{payment}</p>
              <h3 className={s.groupTitle}>Insurance plans we accept</h3>
              <ul className={s.insurers}>
                {insurers.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            <div className={s.faq}>
              {faqs.map((f) => (
                <details key={f.q} name="faq" className={s.faqItem}>
                  <summary className={s.faqQ}>
                    <span>{f.q}</span>
                    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16">
                      <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.25" />
                    </svg>
                  </summary>
                  <p className={s.faqA}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="visit" aria-labelledby="visit-h" className={s.stoneBand}>
          <div className={s.wrapInner}>
            <h2 id="visit-h" className={s.h2}>
              Visit us
            </h2>
            <div className={s.visitGrid}>
              <div className={s.visitBlock}>
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
                <p className={s.muted}>{parking}</p>
                <div className={s.contact}>
                  <a href={tel}>{phone}</a>
                  {p.email && <a href={`mailto:${p.email}`}>{p.email}</a>}
                  <a href={directionsUrl(p)}>Get directions</a>
                </div>
              </div>
              <div className={s.visitBlock}>
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
          </div>
        </section>

        <section id="book" aria-labelledby="close-h" className={s.closing}>
          <div className={s.closingInner}>
            <div>
              <h2 id="close-h" className={s.closingTitle}>
                Start with a conversation.
              </h2>
              <p className={s.mutedDark}>Cosmetic consultations are free and take about 45 minutes.</p>
            </div>
            <div className={s.heroActions}>
              {p.bookUrl && (
                <a href={p.bookUrl} className={`${s.btnLight} ${s.btnLarge}`}>
                  Book a consultation
                </a>
              )}
              <a href={tel} className={p.bookUrl ? s.linkCall : `${s.btnLight} ${s.btnLarge}`}>
                Call {phone}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footerInner}>
          <span>
            © {new Date().getFullYear()} {p.name}
          </span>
          <span>
            {p.street}, {cityLine(p)}
          </span>
        </div>
      </footer>

      <div className={s.mobileBar}>
        <a href={tel} className={s.btnOutlineLight}>
          Call
        </a>
        <a href={book} className={s.btnLight}>
          Book
        </a>
      </div>
    </div>
  )
}
