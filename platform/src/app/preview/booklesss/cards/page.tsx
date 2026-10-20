import type { Metadata } from "next";
import Link from "next/link";
import { Urbanist } from "next/font/google";
import base from "../../preview.module.css";
import b from "../booklesss.module.css";
import { VARIANTS } from "../_cards";
import { Back, COURSES } from "../_ui";

/* Seven versions of the Booklesss course card, side by side with what each
 * shows, what its buttons do, and why it exists. All keep the CRM card's
 * structure (notch top-right, identity slot top-left, title, line, footer);
 * the variable is the information and the actions. Placeholder data. */

const urbanist = Urbanist({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-urbanist" });

export const metadata: Metadata = { title: "Course card versions", robots: { index: false, follow: false } };

export default async function CardVersions({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const light = (await searchParams).theme === "light";
  const q = light ? "?theme=light" : "";

  return (
    <main className={`${urbanist.variable} ${base.page} ${b.root}`} data-theme={light ? "light" : "dark"} style={{ paddingBottom: 64 }}>
      <div className={base.col}>
        <header className={`${base.between} ${base.top}`}>
          <Link href={`/preview/booklesss${q}`} className={base.circle} style={{ width: 44, height: 44 }} aria-label="Back to the app preview">
            <Back />
          </Link>
          <Link href={light ? "/preview/booklesss/cards" : "/preview/booklesss/cards?theme=light"} className={b.wordmark} aria-label="Switch theme">
            Bklsss
          </Link>
        </header>

        <div className={b.intro}>
          <h1>Course card</h1>
          <p>
            Seven versions of one card. Each keeps the notch, the slot top-left, the title and the two-part footer.
            What changes is what the card tells you about the videos inside and what its buttons let you do.
          </p>
        </div>

        {VARIANTS.map((v, i) => (
          <section key={v.name} className={b.variant}>
            <div className={b.vhead}>
              <span className={b.vnum}>{String(i + 1).padStart(2, "0")}</span>
              <span className={b.vname}>{v.name}</span>
            </div>
            <v.Card c={COURSES[v.course]} {...(v.name === "Progress" ? { size: { height: 206 } } : {})} />
            <div className={b.notes}>
              <div><b>Shows</b>{v.shows}</div>
              <div><b>Buttons</b>{v.buttons}</div>
              <div><b>Why</b>{v.why}</div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
