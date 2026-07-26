import type { SkillGroup } from "@prisma/client";
import { toTags } from "@/lib/format";
import { TechPills } from "./TechPills";

export function SkillsGroupCard({ group }: { group: SkillGroup }) {
  const skills = toTags(group.skills);
  return (
    <div className="brutal-box brutal-tap p-5">
      <div className="mb-3 flex items-baseline gap-2 font-mono text-xs">
        <span className="text-accent">$</span>
        <span className="uppercase tracking-wider text-text-primary">
          {group.name}
        </span>
        <span className="text-text-secondary">
          [{skills.length}]
        </span>
      </div>
      <TechPills tags={skills} />
    </div>
  );
}
