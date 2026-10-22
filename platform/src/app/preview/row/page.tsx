import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import r from "./row.module.css";

/* ONE ROW OF COURSE CARDS (owner, 2026-10-22: "get that live for me to see,
 * just that").
 *
 * The card is the Paper card the owner built step by step: "Booklesss
 * Platform" > "Final course card", boards "Course row · 1440 / 1024 / 768 /
 * 390". It started as the dark Free UI card, then took the Details button's
 * style for its button and for its own border, and its name and role became
 * "Financial Management" / "Alex Turner". Every value below is Paper's.
 * Only the card and the row: no header, no filters, nothing else yet.
 *
 * ⚠️ Placeholder content throughout. Not indexed, not linked from anywhere. */

const inter = Inter({ subsets: ["latin"], weight: ["500", "600"], variable: "--row-inter" });
const rubik = Rubik({ subsets: ["latin"], weight: ["500"], variable: "--row-rubik" });

export const metadata: Metadata = { title: "Course row preview", robots: { index: false, follow: false } };

function Card() {
  return (
    <article className={r.card}>
      <div className={r.bevel}>
        <div className={r.body}>
          <div className={r.top}>
            <div className={r.banner} />
            <div className={r.avatar} />
            <span className={r.online} />
            <span className={r.pill}>
              <span className={r.logo}>
                <svg width="9" height="8" viewBox="0 0 10 9" aria-hidden>
                  <path d="M3.6 0H0v9L3.6 0zM6.4 0H10v9L6.4 0zM5 3.3L7.3 9H5.8L5.1 7.2H3.4L5 3.3z" fill="#FFFFFF" />
                </svg>
              </span>
              Adobe Co.
            </span>
          </div>

          <div className={r.nameRow}>
            <div className={r.names}>
              <h3 className={r.title}>Financial Management</h3>
              <p className={r.role}>Alex Turner</p>
            </div>
            <button type="button" className={r.save} aria-label="Save Financial Management">
              <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M13.5 2.06C13.03 2.02 12.53 2 12 2C7.76 2 5.64 2 4.32 3.33C3 4.67 3 6.81 3 11.1v4.99c0 3.1 0 4.65.73 5.32c.35.32.79.53 1.26.58c.99.11 2.14-.91 4.45-2.95c1.020-.9 1.530-1.350 2.120-1.470c.29-.06.59-.06.88 0c.59.12 1.1.57 2.12 1.47c2.3 2.04 3.46 3.06 4.45 2.95c.47-.05.91-.26 1.26-.58c.73-.67.73-2.22.73-5.32V10.5A5.5 5.5 0 0 1 13.5 2.06z"
                  fill="#A0A0A0"
                />
                <path d="M18.5 2v6M15.5 5h6" stroke="#A0A0A0" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className={r.stats}>
            <div className={r.stat}>
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M9.153 5.408C10.42 3.136 11.053 2 12 2s1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182s.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776c.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18c-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506s-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452s-.674.15-1.328.452l-.596.274c-2.303 1.06-3.455 1.59-4.22 1.01c-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116 0-1.46c-.106-.345-.345-.624-.821-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882S3.58 8.328 6.04 7.772l.636-.144c.699-.158 1.048-.237 1.329-.45s.46-.536.82-1.182z"
                  fill="#F5B50A"
                />
              </svg>
              <span className={r.statText}>
                <strong>5.0</strong>
                <span>Rating</span>
              </span>
            </div>
            <div className={r.stat}>
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M5.75 1a.75.75 0 0 1 .75.75V3.6l1.72-.344a8.7 8.7 0 0 1 4.925.452l.204.081a8 8 0 0 0 4.91.334a1.2 1.2 0 0 1 1.491 1.164v7.367c0 .644-.439 1.206-1.064 1.362l-.214.053a8.68 8.68 0 0 1-5.327-.361a8.7 8.7 0 0 0-4.924-.452L6.5 13.6v8.15a.75.75 0 0 1-1.5 0v-20A.75.75 0 0 1 5.75 1"
                  fill="#3B82F6"
                />
              </svg>
              <span className={r.statText}>
                <strong>$160</strong>
                <span>hours</span>
              </span>
            </div>
            <div className={r.stat}>
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                <circle cx="12" cy="12" r="10" fill="#A855F7" />
                <path d="M12 8v4l2.5 2.5" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className={r.statText}>
                <strong>24</strong>
                <span>Month</span>
              </span>
            </div>
          </div>

          {/* the Details button's construction: dark rim, bevel ring, raised pill */}
          <button type="button" className={r.cta}>
            <span className={r.ctaBevel}>
              <span className={r.ctaPill}>Get In Touch</span>
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function RowPreview() {
  return (
    <main className={`${inter.variable} ${rubik.variable} ${r.page}`}>
      <div className={r.row}>
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i} />
        ))}
      </div>
    </main>
  );
}
