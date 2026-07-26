"use client";

import { useState } from "react";
import type { EntryForm as FormState } from "@/types";

const empty = (kind: "experience" | "education"): FormState => ({
  kind,
  title: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
  blurb: "",
  companyUrl: "",
  techStack: "",
  displayOrder: "",
});

const field =
  "mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
const label = "block text-sm font-medium text-slate-700";

export function EntryForm({
  initial,
  kind,
  onCancel,
  onSubmit,
  submitting,
}: {
  initial?: FormState;
  kind: "experience" | "education";
  onCancel: () => void;
  onSubmit: (form: FormState) => void;
  submitting: boolean;
}) {
  const [form, setForm] = useState<FormState>(initial ?? empty(kind));
  const [error, setError] = useState("");

  const set = (k: keyof FormState, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required");
    if (!form.company.trim()) return setError("Company / institution is required");
    if (!form.startDate) return setError("Start date is required");
    if (form.endDate && form.endDate < form.startDate)
      return setError("End date cannot be before start date");
    setError("");
    onSubmit(form);
  }

  return (
    <form
      onSubmit={submit}
      className="rounded border border-slate-300 bg-white p-5 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label}>
            {kind === "education" ? "Degree / Program" : "Title / Role"}
            <input
              className={field}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </label>
        </div>

        <label className={label}>
          {kind === "education" ? "Institution" : "Company"}
          <input
            className={field}
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </label>

        <label className={label}>
          Location
          <input
            className={field}
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </label>

        <label className={label}>
          {kind === "education" ? "Institution URL" : "Company URL"}{" "}
          <span className="text-slate-400">(makes name clickable)</span>
          <input
            type="url"
            className={field}
            placeholder="https://example.com"
            value={form.companyUrl}
            onChange={(e) => set("companyUrl", e.target.value)}
          />
        </label>

        <div className="sm:col-span-2">
          <label className={label}>
            Brief <span className="text-slate-400">(1–2 lines shown on card hover)</span>
            <textarea
              rows={2}
              className={field}
              placeholder="Short description of the company / institution"
              value={form.blurb}
              onChange={(e) => set("blurb", e.target.value)}
            />
          </label>
        </div>

        <label className={label}>
          Start date
          <input
            type="month"
            className={field}
            value={form.startDate}
            onChange={(e) => set("startDate", e.target.value)}
          />
        </label>

        <label className={label}>
          End date <span className="text-slate-400">(empty = Present)</span>
          <input
            type="month"
            className={field}
            value={form.endDate}
            onChange={(e) => set("endDate", e.target.value)}
          />
        </label>

        <div className="sm:col-span-2">
          <label className={label}>
            Description <span className="text-slate-400">(one bullet per line)</span>
            <textarea
              rows={5}
              className={field}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className={label}>
            Tech stack <span className="text-slate-400">(comma separated)</span>
            <input
              className={field}
              placeholder="Angular, TypeScript, NestJS"
              value={form.techStack}
              onChange={(e) => set("techStack", e.target.value)}
            />
          </label>
        </div>

        <label className={label}>
          Display order <span className="text-slate-400">(empty = auto from date)</span>
          <input
            type="number"
            className={field}
            value={form.displayOrder}
            onChange={(e) => set("displayOrder", e.target.value)}
          />
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
