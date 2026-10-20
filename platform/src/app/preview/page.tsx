import type { Metadata } from "next";
import Link from "next/link";
import { Urbanist } from "next/font/google";
import type { ReactNode } from "react";
import s from "./preview.module.css";

/* A DESIGN PREVIEW, NOT A PRODUCT SURFACE (owner, 2026-10-20).
 *
 * The mobile CRM reference rebuilt from two Dribbble shots, so the owner can
 * see on a real phone how its notched cards behave before they become course
 * cards. Built 1:1 from the Paper boards "CRM · Dark 390" and "CRM · Light 390"
 * on the page "CRM Dashboard ref (built as given)" in "Booklesss Platform".
 *
 * ⚠️ Everything on it is placeholder copy from the reference (leads, deals,
 * a call). It reads no data and links nowhere real. Dark by default; the logo
 * flips to `?theme=light` and back. Not indexed. Delete this folder once the
 * cards are in the real app. */

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

/* ---------- icons: Hugeicons Free paths, stroke 1.5 on a 24 grid ---------- */

function I({ size = 18, children }: { size?: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const Arrow = ({ size }: { size?: number }) => (
  <I size={size}>
    <path d="M9 6.65032C9 6.65032 15.9383 6.10759 16.9154 7.08463C17.8924 8.06167 17.3496 15 17.3496 15M16.5 7.5L6.5 17.5" />
  </I>
);
const Bell = ({ size }: { size?: number }) => (
  <I size={size}>
    <path d="M19 18V9.5C19 5.63401 15.866 2.5 12 2.5C8.13401 2.5 5 5.63401 5 9.5V18" />
    <path d="M20.5 18H3.5" />
    <path d="M13.5 20C13.5 20.8284 12.8284 21.5 12 21.5M10.5 20C10.5 20.8284 11.1716 21.5 12 21.5M12 21.5V20" />
  </I>
);
const Search = () => (
  <I size={16}>
    <path d="M17 17L21 21" />
    <path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" />
  </I>
);
const Filter = () => (
  <I size={16}>
    <path d="M4 11L4 21M19 13L19 21M19 3L19 7M11.5 3L11.5 13M4 3L4 5M11.5 19L11.5 21" />
    <rect x="2" y="8" width="4" height="3" rx="1.2" />
    <rect x="17" y="10" width="4" height="3" rx="1.2" />
    <rect x="9.5" y="13" width="4" height="3" rx="1.2" />
  </I>
);
const Fire = ({ size = 13 }: { size?: number }) => (
  <span style={{ color: "#F6A86B", display: "flex" }}>
    <I size={size}>
      <path d="M13.8561 22C26.0783 19 19.2338 7 10.9227 2C9.9453 5.5 8.47838 6.5 5.54497 10C1.66121 14.6339 3.5895 20 8.96719 22C8.1524 21 6.04958 18.9008 7.5 16C8 15 9 14 8.5 12C9.47778 12.5 11.5 13 12 15.5C12.8148 14.5 13.6604 12.4 12.8783 10C19 14.5 16.5 19 13.8561 22Z" />
    </I>
  </span>
);
const Calendar = ({ size }: { size?: number }) => (
  <I size={size}>
    <path d="M16 2V6M8 2V6" />
    <path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" />
    <path d="M3 10H21" />
  </I>
);
const Video = ({ size }: { size?: number }) => (
  <I size={size}>
    <path d="M2 11C2 7.70017 2 6.05025 3.02513 5.02513C4.05025 4 5.70017 4 9 4H10C13.2998 4 14.9497 4 15.9749 5.02513C17 6.05025 17 7.70017 17 11V13C17 16.2998 17 17.9497 15.9749 18.9749C14.9497 20 13.2998 20 10 20H9C5.70017 20 4.05025 20 3.02513 18.9749C2 17.9497 2 16.2998 2 13V11Z" />
    <path d="M17 8.90585L17.1259 8.80196C19.2417 7.05623 20.2996 6.18336 21.1498 6.60482C22 7.02628 22 8.42355 22 11.2181V12.7819C22 15.5765 22 16.9737 21.1498 17.3952C20.2996 17.8166 19.2417 16.9438 17.1259 15.198L17 15.0941" />
  </I>
);
const Mail = () => (
  <I size={17}>
    <path d="M2 6L8.91302 9.91697C11.4616 11.361 12.5384 11.361 15.087 9.91697L22 6" />
    <path d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z" />
  </I>
);
const File = () => (
  <I>
    <path d="M8 17H16M8 13H12" />
    <path d="M13 2.5V3C13 5.82843 13 7.24264 13.8787 8.12132C14.7574 9 16.1716 9 19 9H19.5M20 10.6569V14C20 17.7712 20 19.6569 18.8284 20.8284C17.6569 22 15.7712 22 12 22C8.22876 22 6.34315 22 5.17157 20.8284C4 19.6569 4 17.7712 4 14V9.45584C4 6.21082 4 4.58831 4.88607 3.48933C5.06508 3.26731 5.26731 3.06508 5.48933 2.88607C6.58831 2 8.21082 2 11.4558 2C12.1614 2 12.5141 2 12.8372 2.11401C12.9044 2.13772 12.9702 2.165 13.0345 2.19575C13.3436 2.34355 13.593 2.593 14.0919 3.09188L18.8284 7.82843C19.4065 8.40649 19.6955 8.69552 19.8478 9.06306C20 9.4306 20 9.83935 20 10.6569Z" />
  </I>
);
const Chevron = () => (
  <I size={14}>
    <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" />
  </I>
);
const Structure = ({ size = 28, ring }: { size?: number; ring?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" aria-hidden>
    {ring && <circle cx="12" cy="12" r="9.5" stroke="var(--ink)" strokeWidth={1.8} />}
    <g stroke={ring ? "var(--lime)" : "currentColor"}>
      <path d="M12 9V13M12 13H9C7.11438 13 6.17157 13 5.58579 13.5858C5 14.1716 5 15.1144 5 17M12 13H15C16.8856 13 17.8284 13 18.4142 13.5858C19 14.1716 19 15.1144 19 17" />
      {!ring && (
        <>
          <path d="M2.00866 21C2 20.7125 2 20.3821 2 20C2 18.5858 2 17.8787 2.43934 17.4393C2.87868 17 3.58579 17 5 17C6.41421 17 7.12132 17 7.56066 17.4393C8 17.8787 8 18.5858 8 20C8 20.3821 8 20.7125 7.99134 21" />
          <path d="M16.0087 21C16 20.7125 16 20.3821 16 20C16 18.5858 16 17.8787 16.4393 17.4393C16.8787 17 17.5858 17 19 17C20.4142 17 21.1213 17 21.5607 17.4393C22 17.8787 22 18.5858 22 20C22 20.3821 22 20.7125 21.9913 21" />
        </>
      )}
      <path d="M10.2857 3H13.7143C15.7888 3 16 4.10993 16 6C16 7.89007 15.7888 9 13.7143 9H10.2857C8.2112 9 8 7.89007 8 6C8 4.10993 8.2112 3 10.2857 3Z" />
    </g>
  </svg>
);

/* ---------- data: the reference's own placeholder copy ---------- */

type Lead = { name: string; role: string; sources: string[]; interest: string; dots: number; hot?: boolean };
const LEADS: Lead[] = [
  { name: "Jane Doe", role: "Marketing Director at Microsoft", sources: ["Linkedin", "Email"], interest: "Hot Client", dots: 5, hot: true },
  { name: "Darlene Robertson", role: "Financial Manager at Ford", sources: ["Linkedin", "Facebook"], interest: "High Interest", dots: 4 },
  { name: "Wade Warren", role: "Operations Manager at Zenith", sources: ["Typeform"], interest: "Medium Interest", dots: 3 },
  { name: "Jonah Jude", role: "Web Developer at Binary Bytes", sources: ["Typeform"], interest: "High Interest", dots: 4 },
];
const DOT = ["#F28B82", "#F6A86B", "#F2D16B", "#B9FF66", "#B9FF66"];

type Task = {
  who: string;
  role: string;
  title: string;
  kind: "call" | "proposal";
  when?: string;
  at?: string;
  amount?: string;
  status: string;
  lime?: boolean;
  alert?: boolean;
};
const TASKS: Task[] = [
  { who: "Peter Thomas", role: "CEO at Madira Ink", title: "Google Meet Call", kind: "call", when: "28.03.2023", at: "2 pm", status: "Call scheduled", lime: true, alert: true },
  { who: "Alesha Hyacinth", role: "CEO at Metomorposis", title: "Send Proposal", kind: "proposal", amount: "$ 20,000", status: "Waiting Proposal" },
  { who: "Miriam Fannie", role: "Brand Manager at Summit Marketing", title: "Google Meet Call", kind: "call", when: "28.03.2023", at: "8 pm", status: "Call scheduled" },
];

/* ---------- pieces ---------- */

function Notch({ buttons }: { buttons: ReactNode[] }) {
  const width = 8 + buttons.length * 46 + (buttons.length - 1) * 8 + 10;
  return (
    <div className={s.notch} style={{ width }}>
      {buttons.map((b, i) => (
        <button key={i} type="button" className={s.circle} style={{ left: 8 + i * 54 }} aria-label="Card action">
          {b}
        </button>
      ))}
      <svg className={`${s.fillet} ${s.filletTop}`} viewBox="0 0 24 24" aria-hidden>
        <path d="M0 0H24V24A24 24 0 0 0 0 0Z" />
      </svg>
      <svg className={`${s.fillet} ${s.filletRight}`} viewBox="0 0 24 24" aria-hidden>
        <path d="M0 0H24V24A24 24 0 0 0 0 0Z" />
      </svg>
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className={s.scroller}>
      <button type="button" className={`${s.chip} ${s.chipOn}`}>All</button>
      {items.map((c, i) => (
        <button key={c} type="button" className={s.chip}>
          {i === 0 && <Fire />}
          {c}
        </button>
      ))}
    </div>
  );
}

function SectionHead({ title, count, unit }: { title: string; count: number; unit: string }) {
  return (
    <div className={`${s.between} ${s.section}`}>
      <div className={s.title}>
        <h2>{title}</h2>
        <span className={s.count}>
          <b>{count}</b> {unit}
        </span>
      </div>
      <div className={s.row} style={{ gap: 6 }}>
        <button type="button" className={s.circle} style={{ width: 42, height: 42 }} aria-label="Search"><Search /></button>
        <button type="button" className={s.circle} style={{ width: 42, height: 42 }} aria-label="Filter"><Filter /></button>
      </div>
    </div>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <article className={`${s.card} ${s.lead}`}>
      <Notch buttons={[<Arrow key="a" size={16} />]} />
      <span className={`${s.avatar} ${s.abs}`} style={{ left: 10, top: 9, width: 47, height: 47 }} />
      <div className={`${s.name} ${s.abs}`} style={{ left: 20, top: 82 }}>{lead.name}</div>
      <div className={`${s.role} ${s.abs}`} style={{ left: 20, top: 114 }}>{lead.role}</div>
      <div className={`${s.label} ${s.abs}`} style={{ left: 20, top: 148 }}>Source</div>
      <div className={`${s.row} ${s.abs}`} style={{ left: 20, top: 166, gap: 6 }}>
        {lead.sources.map((x) => <span key={x} className={s.tag}>{x}</span>)}
      </div>
      <div className={`${s.row} ${s.label} ${s.abs}`} style={{ left: 160, top: 144, gap: 4, color: "var(--tag-ink)" }}>
        {lead.hot && <Fire size={11} />}
        {lead.interest}
      </div>
      <div className={`${s.dots} ${s.abs}`} style={{ left: 160, top: 162 }}>
        {DOT.map((c, i) => <span key={i} style={i < lead.dots ? { background: c } : undefined} />)}
      </div>
    </article>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <article className={`${s.card} ${s.task} ${task.lime ? s.taskLime : ""}`}>
      <Notch
        buttons={[
          <span key="b" style={{ position: "relative", display: "flex" }}>
            <Bell size={16} />
            {task.alert && <span className={s.dot} style={{ left: 9, top: -3 }} />}
          </span>,
          <Arrow key="a" size={16} />,
        ]}
      />
      <span className={`${s.avatar} ${s.abs}`} style={{ left: 10, top: 9, width: 47, height: 47 }} />
      <div className={`${s.who} ${s.abs}`} style={{ left: 76, top: 15 }}>{task.who}</div>
      <div className={`${s.whoRole} ${s.abs}`} style={{ left: 76, top: 34 }}>{task.role}</div>
      <div className={`${s.typeIcon} ${s.abs}`} style={{ left: 12, top: 100 }}>
        {task.kind === "call" ? <Video /> : <File />}
      </div>
      <div className={`${s.name} ${s.abs}`} style={{ left: 76, top: 100 }}>{task.title}</div>
      <div className={`${s.meta} ${s.abs}`} style={{ left: 78, top: task.kind === "call" ? 134 : 136 }}>
        {task.kind === "call" ? (
          <>
            <span className={s.pair}><span /><span /></span>
            {task.when} <i>at</i> {task.at}
          </>
        ) : (
          <>
            <i>Amount</i> {task.amount}
          </>
        )}
      </div>
      <div className={`${s.label} ${s.abs}`} style={{ left: 12, top: 175, color: "var(--muted-2)" }}>Status</div>
      <div className={s.status}>
        <span className={s.avatar} style={{ width: 30, height: 30 }} />
        <span>{task.status}</span>
        <Chevron />
      </div>
      {task.kind === "call" && (
        <button type="button" className={`${s.circle} ${s.ghost}`} aria-label="Email"><Mail /></button>
      )}
      <button type="button" className={`${s.circle} ${s.solid}`} aria-label={task.kind === "call" ? "Join call" : "Email"}>
        {task.kind === "call" ? <Video /> : <Mail />}
      </button>
    </article>
  );
}

/* ---------- page ---------- */

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const light = (await searchParams).theme === "light";

  return (
    <main className={`${urbanist.variable} ${s.page}`} data-theme={light ? "light" : "dark"}>
      <div className={s.col}>
        <header className={`${s.between} ${s.top}`}>
          <Link href={light ? "/preview" : "/preview?theme=light"} aria-label="Switch theme" style={{ color: "var(--ink)", display: "flex" }}>
            <Structure />
          </Link>
          <div className={s.row} style={{ gap: 8 }}>
            <button type="button" className={s.circle} style={{ width: 44, height: 44, position: "relative", background: light ? "#fff" : undefined }} aria-label="Notifications">
              <Bell />
              <span className={s.dot} style={{ left: 26, top: 10 }} />
            </button>
            <span className={s.avatar} style={{ width: 44, height: 44, border: "2px solid #fff" }} />
          </div>
        </header>

        <section className={s.schedule} aria-label="Your schedule">
          <div className={s.between} style={{ paddingLeft: 14 }}>
            <span style={{ fontSize: 16, fontWeight: 500 }}>Your Schedule</span>
            <div className={s.row} style={{ gap: 6 }}>
              <span className={`${s.row} ${s.dateChip}`}>
                <span><Calendar size={15} /></span>
                <span>28 March</span>
              </span>
              <span className={s.openBtn}><Arrow size={16} /></span>
            </div>
          </div>
          <div className={s.timeline}>
            <span className={s.avatar} style={{ width: 36, height: 36, border: "2px solid #fff" }} />
            <span style={{ fontSize: 10, fontWeight: 500, color: "#5C7F30", padding: "0 10px" }}>36 min</span>
            <span className={s.tlDivider} />
            <span className={s.tlTime}>2:00 pm</span>
            <span className={s.tlPair}>
              <span className={s.avatar} style={{ width: 30, height: 30 }} />
              <span className={s.avatar} style={{ width: 30, height: 30, background: "#B5B5B5" }} />
            </span>
            <span className={s.tlRun}>
              <span className={s.now} />
              <span className={s.nowTag}>2:15 pm</span>
            </span>
            <span className={s.tlDivider} />
            <span className={s.tlTime}>3:00 pm</span>
            <span className={s.tlPair} style={{ marginRight: 6 }}>
              <span className={s.avatar} style={{ width: 30, height: 30 }} />
              <span className={s.avatar} style={{ width: 30, height: 30, background: "#B5B5B5" }} />
            </span>
          </div>
        </section>

        <div className={`${s.between} ${s.ws}`}>
          <div className={s.row} style={{ gap: 10 }}>
            <button type="button" className={s.circle} style={{ width: 44, height: 44 }} aria-label="Back">
              <I size={17}>
                <path d="M5.5 12.002H19" />
                <path d="M10.9999 18.002C10.9999 18.002 4.99998 13.583 4.99997 12.0019C4.99996 10.4208 11 6.00195 11 6.00195" />
              </I>
            </button>
            <h1 className={s.wordmark} style={{ margin: 0 }}>
              W<Structure size={30} ring />RKSPACE
            </h1>
          </div>
          <button type="button" className={s.circle} style={{ width: 47, height: 47, background: "var(--inv)", color: "var(--inv-ink)" }} aria-label="New task">
            <I><path d="M12 4V20M20 12H4" /></I>
          </button>
        </div>

        <div className={s.stats}>
          {[
            { n: "34", l: "Deals", d: "↑ 3", up: true },
            { n: "20", l: "won", d: "↓ 2" },
            { n: "3", l: "lost", d: "↓ 1" },
          ].map((x) => (
            <div key={x.l} className={s.stat}>
              <b>{x.n}</b>
              <div>
                <span className={`${s.delta} ${x.up ? s.up : s.down}`}>{x.d}</span>
                <em>{x.l}</em>
              </div>
            </div>
          ))}
        </div>

        <SectionHead title="New Leads" count={7} unit="Leads" />
        <Chips items={["Hot Client", "Great interest", "Medium interest", "Low interest", "Non interest"]} />
        <div className={`${s.scroller} ${s.carousel}`}>
          {LEADS.map((l) => <LeadCard key={l.name} lead={l} />)}
        </div>

        <SectionHead title="Your Days Tasks" count={16} unit="Tasks" />
        <Chips items={["Hot", "Due Today", "Overdue", "Completed"]} />
        <div className={s.stack}>
          {TASKS.map((t) => <TaskCard key={t.who} task={t} />)}
        </div>
      </div>

      <nav className={s.nav} aria-label="Sections">
        <button type="button" className={`${s.circle} ${s.navOn}`} aria-label="Tasks">
          <I size={19}>
            <path d="M14.4961 2.00027H9.49609C8.66767 2.00027 7.99609 2.67185 7.99609 3.50027C7.99609 4.3287 8.66767 5.00027 9.49609 5.00027H14.4961C15.3245 5.00027 15.9961 4.3287 15.9961 3.50027C15.9961 2.67185 15.3245 2.00027 14.4961 2.00027Z" />
            <path d="M7.99609 15.0003H11.4247M7.99609 11.0003H15.9961" />
            <path d="M15.9961 3.50027C17.5496 3.54709 18.4761 3.72035 19.1174 4.36164C19.9961 5.24032 19.9961 6.65451 19.9961 9.4829L19.9961 15.9997C19.9961 18.8282 19.9961 20.2424 19.1174 21.1211C18.2387 21.9997 16.8245 21.9997 13.9961 21.9997L9.99609 21.9997C7.16767 21.9997 5.75346 21.9997 4.87478 21.1211C3.9961 20.2424 3.9961 18.8282 3.99609 15.9998L3.99611 9.48296C3.9961 6.65453 3.9961 5.24031 4.87478 4.36163C5.51606 3.72034 6.44261 3.54708 7.99599 3.50027" />
          </I>
        </button>
        <button type="button" className={s.circle} aria-label="Pipeline">
          <I size={19}>
            <path d="M14 19.5H13C10.1716 19.5 8.75736 19.5 7.87868 18.6213C7 17.7426 7 16.3284 7 13.5V11.5M7 8V11.5M7 11.5H14" />
            <rect x="14" y="9" width="6" height="5" rx="2" />
            <rect x="14" y="17" width="6" height="5" rx="2" />
            <rect x="3" y="2" width="8" height="6" rx="2.5" />
          </I>
        </button>
        <button type="button" className={s.circle} aria-label="Messages">
          <I size={19}>
            <path d="M21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C10.3719 21.5 8.8394 21.0904 7.5 20.3687C5.63177 19.362 4.37462 20.2979 3.26592 20.4658C3.09774 20.4913 2.93024 20.4302 2.80997 20.31C2.62741 20.1274 2.59266 19.8451 2.6935 19.6074C3.12865 18.5818 3.5282 16.6382 2.98341 15C2.6698 14.057 2.5 13.0483 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12Z" />
            <path d="M12.1257 12H12.0007M8.125 12H8M16.125 12H16" strokeWidth={2} />
          </I>
        </button>
        <button type="button" className={s.circle} aria-label="Calendar"><Calendar size={19} /></button>
        <div className={`${s.row} ${s.call}`}>
          <span className={s.avatar} style={{ width: 40, height: 40 }} />
          <span>12:04</span>
          <button type="button" className={s.circle} aria-label="End call">
            <I size={16}>
              <path d="M4.91186 10.5413L7.55229 7.90088C8.09091 7.36227 8.27728 6.56642 8.05944 5.83652C7.8891 5.26577 7.69718 4.57964 7.56961 3.99292C7.45162 3.45027 6.97545 3 6.42012 3H4.91186C3.8012 3 2.88911 3.90384 3.01094 5.0078C3.93709 13.3996 10.6004 20.0629 18.9922 20.9891C20.0962 21.1109 21 20.1988 21 19.0881V17.5799C21 17.0246 20.5479 16.569 20.0015 16.4696C19.3988 16.36 18.7611 16.1804 18.2276 16.0103C17.4611 15.7659 16.6091 15.9377 16.0403 16.5065L13.4587 19.0881" />
            </I>
          </button>
        </div>
      </nav>
    </main>
  );
}
