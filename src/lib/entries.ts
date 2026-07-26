import type { Entry } from "@prisma/client";

/**
 * Canonical ordering for entries:
 *   1. "Present" (null endDate) always floats to the top.
 *   2. Then by startDate descending (most recent first).
 *   3. displayOrder is used as a manual tie-breaker / override.
 */
export function sortEntries<T extends Entry>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    const aPresent = a.endDate === null;
    const bPresent = b.endDate === null;
    if (aPresent !== bPresent) return aPresent ? -1 : 1;

    const aStart = new Date(a.startDate).getTime();
    const bStart = new Date(b.startDate).getTime();
    if (bStart !== aStart) return bStart - aStart;

    return b.displayOrder - a.displayOrder;
  });
}
