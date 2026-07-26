import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { sortEntries } from "@/lib/entries";
import { parseEntryBody } from "./validate";

// GET /api/admin/entries?kind=experience|education  -> list (sorted)
export async function GET(req: Request) {
  if (!isAuthenticated())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind");
  const where = kind === "experience" || kind === "education" ? { kind } : {};

  const entries = await prisma.entry.findMany({ where });
  return NextResponse.json(sortEntries(entries));
}

// POST /api/admin/entries  -> create
export async function POST(req: Request) {
  if (!isAuthenticated())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = await parseEntryBody(req);
  if ("error" in parsed)
    return NextResponse.json({ error: parsed.error }, { status: 400 });

  const entry = await prisma.entry.create({ data: parsed.data });
  return NextResponse.json(entry, { status: 201 });
}
