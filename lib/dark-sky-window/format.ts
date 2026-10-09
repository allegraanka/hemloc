export function formatHour(iso: string): string {
  const hour = Number(iso.slice(11, 13));
  if (Number.isNaN(hour)) return iso;
  const suffix = hour >= 12 ? "PM" : "AM";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve} ${suffix}`;
}

export function formatHourCompact(iso: string): string {
  const hour = Number(iso.slice(11, 13));
  if (Number.isNaN(hour)) return iso;
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}${hour >= 12 ? "p" : "a"}`;
}

export function formatWeekday(isoDate: string): string {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return isoDate;
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  return date.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
}

export function formatNightDate(isoDate: string): string {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return isoDate;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[Number(match[2]) - 1];
  return `${month} ${Number(match[3])}`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatVisibility(meters: number | null): string {
  if (meters === null) return "—";
  const miles = meters / 1609.34;
  const km = meters / 1000;
  return `${miles.toFixed(1)} mi / ${km.toFixed(1)} km`;
}

export function formatWindowRange(start: string, end: string): string {
  return `${formatHour(start)} – ${formatHour(end)}`;
}
