import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sortEntries } from "@/lib/entries";
import { AdminDashboard } from "./AdminDashboard";
import type { EntryDTO } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Real cryptographic session check (middleware only checks cookie presence).
  if (!isAuthenticated()) redirect("/admin/login");

  const entries = await prisma.entry.findMany();
  const sorted = sortEntries(entries);

  // Serialize dates to plain strings for the client component.
  const initial: EntryDTO[] = sorted.map((e) => ({
    ...e,
    kind: e.kind === "education" ? "education" : "experience",
    startDate: e.startDate.toISOString(),
    endDate: e.endDate ? e.endDate.toISOString() : null,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }));

  return <AdminDashboard initialEntries={initial} />;
}
