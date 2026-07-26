import { fromMonthInput } from "@/lib/format";

export interface EntryData {
  kind: string;
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  blurb: string;
  companyUrl: string;
  techStack: string;
  displayOrder: number;
}

type ParseResult = { data: EntryData } | { error: string };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/**
 * Validate and normalize an entry request body. Dates arrive as "YYYY-MM"
 * (from <input type="month">). displayOrder is auto-computed from startDate
 * unless the caller supplies a numeric override.
 */
export async function parseEntryBody(req: Request): Promise<ParseResult> {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return { error: "Invalid JSON body" };
  }

  const kindRaw = str(body.kind) || "experience";
  if (kindRaw !== "experience" && kindRaw !== "education")
    return { error: "kind must be 'experience' or 'education'" };

  const title = str(body.title);
  if (!title) return { error: "title is required" };

  const company = str(body.company);
  if (!company) return { error: "company is required" };

  const startDate = fromMonthInput(str(body.startDate));
  if (!startDate) return { error: "startDate is required (format YYYY-MM)" };

  const endRaw = str(body.endDate);
  const endDate = endRaw ? fromMonthInput(endRaw) : null;
  if (endRaw && !endDate)
    return { error: "endDate must be YYYY-MM or empty for Present" };
  if (endDate && endDate.getTime() < startDate.getTime())
    return { error: "endDate cannot be before startDate" };

  // displayOrder: numeric override, else derived from startDate (recent = higher).
  const autoOrder = Math.floor(startDate.getTime() / 1000);
  const override = body.displayOrder;
  const displayOrder =
    typeof override === "number" && Number.isFinite(override)
      ? Math.trunc(override)
      : autoOrder;

  return {
    data: {
      kind: kindRaw,
      title,
      company,
      location: str(body.location),
      startDate,
      endDate,
      description: typeof body.description === "string" ? body.description : "",
      blurb: typeof body.blurb === "string" ? body.blurb.trim() : "",
      companyUrl: str(body.companyUrl),
      techStack: str(body.techStack),
      displayOrder,
    },
  };
}
