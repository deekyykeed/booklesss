import { Icon } from "@/lib/icon";

const CARD_SHADOW =
  "0 0.6px 0.6px -1.25px rgba(0,0,0,0.14), 0 2.3px 2.3px -2.5px rgba(0,0,0,0.12), 0 10px 10px -3.75px rgba(0,0,0,0.05)";

export function Card({
  title,
  action,
  value,
  valueDim,
  sub,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  value: React.ReactNode;
  valueDim?: boolean;
  sub?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{ boxShadow: CARD_SHADOW }}
      className={"flex min-h-[138px] flex-col rounded-xl border border-[#ececeb] bg-card p-5 " + (className ?? "")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <h3 className="whitespace-nowrap text-sm font-semibold text-card-label">{title}</h3>
          <Icon name="info-circle-linear" size={14} className="shrink-0 text-card-dim" />
        </div>
        {action}
      </div>

      <p
        className={
          "mt-4 text-[30px] font-normal leading-9 tracking-[-0.75px] " +
          (valueDim ? "text-card-dim" : "text-[#0b0b0b]")
        }
      >
        {value}
      </p>

      {sub && <div className="mt-3 text-sm text-card-dim">{sub}</div>}
    </div>
  );
}

export function ProgressRing({ size = 48, value = 0 }: { size?: number; value?: number }) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e6e6e5" strokeWidth={stroke} />
      {value > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#0b0b0b"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}
    </svg>
  );
}

export function BlackButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="shrink-0 whitespace-nowrap rounded-lg bg-btn px-3 py-1.5 text-sm text-white shadow-sm transition-opacity hover:opacity-90"
    >
      {children}
    </button>
  );
}

export function GhostButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="shrink-0 whitespace-nowrap rounded-lg border border-[#e4e4e3] bg-white px-3 py-1.5 text-sm text-[#0b0b0b] shadow-sm transition-colors hover:bg-[#fbfbfb]"
    >
      {children}
    </button>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 whitespace-nowrap rounded-md border border-[#e0e0df] bg-white px-2.5 py-1.5 text-[13px] text-ink-2">
      {children}
    </span>
  );
}
