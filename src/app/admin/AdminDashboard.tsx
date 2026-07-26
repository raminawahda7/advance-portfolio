"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { EntryDTO, EntryForm as FormState } from "@/types";
import { formatRange, toMonthInput } from "@/lib/format";
import { EntryForm } from "./EntryForm";

type Kind = "experience" | "education";

function dtoToForm(e: EntryDTO): FormState {
  return {
    kind: e.kind,
    title: e.title,
    company: e.company,
    location: e.location,
    startDate: toMonthInput(e.startDate),
    endDate: toMonthInput(e.endDate),
    description: e.description,
    blurb: e.blurb ?? "",
    companyUrl: e.companyUrl ?? "",
    techStack: e.techStack,
    displayOrder: String(e.displayOrder),
  };
}

function formToPayload(f: FormState) {
  return {
    kind: f.kind,
    title: f.title,
    company: f.company,
    location: f.location,
    startDate: f.startDate,
    endDate: f.endDate,
    description: f.description,
    blurb: f.blurb,
    companyUrl: f.companyUrl,
    techStack: f.techStack,
    displayOrder: f.displayOrder.trim() === "" ? undefined : Number(f.displayOrder),
  };
}

export function AdminDashboard({
  initialEntries,
}: {
  initialEntries: EntryDTO[];
}) {
  const router = useRouter();
  const [entries, setEntries] = useState<EntryDTO[]>(initialEntries);
  const [kind, setKind] = useState<Kind>("experience");
  const [mode, setMode] = useState<"none" | "create" | "edit">("none");
  const [editing, setEditing] = useState<EntryDTO | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const visible = useMemo(
    () => entries.filter((e) => e.kind === kind),
    [entries, kind],
  );

  async function refresh() {
    const res = await fetch("/api/admin/entries", { cache: "no-store" });
    if (res.ok) {
      setEntries(await res.json());
      router.refresh(); // keep the public page's server data in sync
    }
  }

  async function handleSubmit(form: FormState) {
    setSubmitting(true);
    setError("");
    try {
      const payload = formToPayload({ ...form, kind });
      const url =
        mode === "edit" && editing
          ? `/api/admin/entries/${editing.id}`
          : "/api/admin/entries";
      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Save failed");
        return;
      }
      await refresh();
      setMode("none");
      setEditing(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(entry: EntryDTO) {
    if (!confirm(`Delete "${entry.title}" at ${entry.company}?`)) return;
    setBusyId(entry.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/entries/${entry.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Delete failed");
        return;
      }
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const tabBtn = (k: Kind, text: string) => (
    <button
      onClick={() => {
        setKind(k);
        setMode("none");
        setEditing(null);
      }}
      className={`px-4 py-2 text-sm font-medium ${
        kind === k
          ? "border-b-2 border-slate-900 text-slate-900"
          : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {text}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-base font-semibold">Portfolio Admin</h1>
            <p className="text-xs text-slate-500">Manage experience & education</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View site ↗
            </a>
            <button
              onClick={logout}
              className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8">
        <div className="flex items-center justify-between border-b border-slate-200">
          <div className="flex">
            {tabBtn("experience", "Experience")}
            {tabBtn("education", "Education")}
          </div>
          {mode === "none" && (
            <button
              onClick={() => {
                setEditing(null);
                setMode("create");
              }}
              className="mb-2 rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              + Add {kind === "education" ? "education" : "experience"}
            </button>
          )}
        </div>

        {error && (
          <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {mode !== "none" && (
          <div className="mt-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">
              {mode === "edit" ? "Edit entry" : "New entry"}
            </h2>
            <EntryForm
              kind={kind}
              initial={editing ? dtoToForm(editing) : undefined}
              submitting={submitting}
              onCancel={() => {
                setMode("none");
                setEditing(null);
              }}
              onSubmit={handleSubmit}
            />
          </div>
        )}

        <ul className="mt-6 space-y-3">
          {visible.map((e) => (
            <li
              key={e.id}
              className="rounded border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{e.title}</p>
                  <p className="text-sm text-slate-600">
                    {e.company}
                    {e.location ? ` · ${e.location}` : ""}
                  </p>
                  <p className="mt-1 flex items-center gap-2 font-mono text-xs text-slate-500">
                    <span>{formatRange(e.startDate, e.endDate)}</span>
                    {e.endDate === null && (
                      <span className="rounded bg-green-100 px-1.5 py-0.5 text-green-700">
                        active
                      </span>
                    )}
                  </p>
                  {e.techStack && (
                    <p className="mt-2 text-xs text-slate-500">{e.techStack}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => {
                      setEditing(e);
                      setMode("edit");
                    }}
                    className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(e)}
                    disabled={busyId === e.id}
                    className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {busyId === e.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            </li>
          ))}
          {visible.length === 0 && (
            <li className="rounded border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              No {kind} entries yet. Click “Add” to create one.
            </li>
          )}
        </ul>
      </main>
    </div>
  );
}
