import type { Entry } from "@prisma/client";
import { formatRange, formatDuration, toBullets, toTags } from "@/lib/format";
import { TechPills } from "./TechPills";

/**
 * Experience / education card. The company name links to the company site when a
 * URL is set. On hover the background swaps to a subtle blueprint grid and a
 * micro-drawer slides open revealing a short company brief + the computed
 * duration. Hover reveal is pure CSS via Tailwind `group-hover`.
 */
export function EntryCard({ entry }: { entry: Entry }) {
  const bullets = toBullets(entry.description);
  const tags = toTags(entry.techStack);
  const present = entry.endDate === null;
  const duration = formatDuration(entry.startDate, entry.endDate);
  const hasDrawer = Boolean(entry.blurb?.trim() || duration);

  return (
    <article className="group relative brutal-box brutal-tap">
      {/* Blueprint grid, revealed on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-blueprint [background-size:22px_22px] opacity-0 transition-opacity duration-200 group-hover:opacity-[0.35]"
      />

      <div className="relative p-5 md:p-6">
        <header className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
          <h3 className="text-lg font-medium tracking-tight text-text-primary md:text-xl">
            {entry.title}
          </h3>
          <span className="font-mono text-xs text-text-secondary md:text-right">
            {formatRange(entry.startDate, entry.endDate)}
          </span>
        </header>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-sm">
          {entry.companyUrl ? (
            <a
              href={entry.companyUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-accent underline-offset-4 hover:underline"
            >
              {entry.company} ↗
            </a>
          ) : (
            <span className="text-accent">{entry.company}</span>
          )}
          <span className="text-grid">/</span>
          <span className="text-text-secondary">{entry.location}</span>
          {present && <span className="pill ml-auto !text-accent">active</span>}
        </div>

        {bullets.length > 0 && (
          <ul className="mt-4 space-y-2">
            {bullets.map((b, i) => (
              <li
                key={i}
                className="relative pl-5 text-sm leading-relaxed text-text-secondary before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:bg-grid"
              >
                {b}
              </li>
            ))}
          </ul>
        )}

        {tags.length > 0 && (
          <div className="mt-4">
            <TechPills tags={tags} />
          </div>
        )}

        {/* Micro-drawer: company brief + computed duration, revealed on hover */}
        {hasDrawer && (
          <div className="grid grid-rows-[0fr] transition-all duration-300 ease-out group-hover:mt-4 group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <div className="border-t border-ink pt-3">
                {entry.blurb?.trim() && (
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {entry.blurb}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-xs">
                  <span className="text-text-secondary">duration</span>
                  <span className="pill">{duration}</span>
                  {entry.companyUrl && (
                    <a
                      href={entry.companyUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="ml-auto text-accent underline-offset-4 hover:underline"
                    >
                      visit site ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
