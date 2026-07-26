import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { parseEntryBody } from "../validate";

// PUT /api/admin/entries/[id]  -> update
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (!isAuthenticated())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = await parseEntryBody(req);
  if ("error" in parsed)
    return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    const entry = await prisma.entry.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json(entry);
  } catch {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
}

// DELETE /api/admin/entries/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  if (!isAuthenticated())
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.entry.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
}
