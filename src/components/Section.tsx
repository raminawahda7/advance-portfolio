import type { ReactNode } from "react";

/**
 * A page section wrapped in the visible structural grid: a top divider, a
 * monospace index label ("01 / SUMMARY") in the left rail, content on the right.
 */
export function Section({
  index,
  label,
  id,
  children,
}: {
  index: string;
  label: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="grid-divider scroll-mt-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 px-5 py-14 md:grid-cols-[180px_1fr] md:px-8 md:py-20">
        <div className="mb-6 md:mb-0">
          <div className="sticky top-8">
            <div className="font-mono text-xs text-text-secondary">{index}</div>
            <h2 className="section-label mt-1">{label}</h2>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
