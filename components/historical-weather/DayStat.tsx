type DayStatProps = {
  label: string;
  value: string;
  hint?: string | null;
};

export function DayStat({ label, value, hint }: DayStatProps) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-ink">{value}</dd>
      {hint ? <p className="mt-0.5 text-xs text-azure">{hint}</p> : null}
    </div>
  );
}
