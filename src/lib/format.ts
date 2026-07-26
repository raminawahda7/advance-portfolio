const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "Jan 2024" from a Date (uses UTC to match seeded first-of-month dates). */
export function formatMonthYear(date: Date | string): string {
  const dt = typeof date === "string" ? new Date(date) : date;
  return `${MONTHS[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
}

/** "Jan 2024 – Present" or "Apr 2021 – Mar 2025". */
export function formatRange(start: Date | string, end: Date | string | null): string {
  const left = formatMonthYear(start);
  const right = end ? formatMonthYear(end) : "Present";
  return `${left} – ${right}`;
}

/** Human duration between two dates, LinkedIn-style: "1 yr 6 mos", "4 yrs", "8 mos". */
export function formatDuration(start: Date | string, end: Date | string | null): string {
  const s = typeof start === "string" ? new Date(start) : start;
  const e = end ? (typeof end === "string" ? new Date(end) : end) : new Date();
  // Inclusive month count (both start and end months count).
  let months =
    (e.getUTCFullYear() - s.getUTCFullYear()) * 12 +
    (e.getUTCMonth() - s.getUTCMonth()) +
    1;
  if (months < 1) months = 1;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (rem) parts.push(`${rem} mo${rem > 1 ? "s" : ""}`);
  return parts.join(" ");
}

/** Split newline-separated bullets into a clean array. */
export function toBullets(description: string): string[] {
  return description
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Split comma-separated tags into a clean array. */
export function toTags(csv: string): string[] {
  return csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** For <input type="month"> value: "2024-01". */
export function toMonthInput(date: Date | string | null): string {
  if (!date) return "";
  const dt = typeof date === "string" ? new Date(date) : date;
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  return `${dt.getUTCFullYear()}-${mm}`;
}

/** Parse "2024-01" (month input) to a UTC first-of-month Date. */
export function fromMonthInput(value: string): Date | null {
  if (!value) return null;
  const [y, m] = value.split("-").map(Number);
  if (!y || !m) return null;
  return new Date(Date.UTC(y, m - 1, 1));
}
