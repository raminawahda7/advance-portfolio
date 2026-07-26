import { prisma } from "@/lib/db";
import { sortEntries } from "@/lib/entries";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { EntryCard } from "@/components/EntryCard";
import { SkillsGroupCard } from "@/components/SkillsGroup";
import { SocialLinks } from "@/components/SocialLinks";

// Always render fresh from the database so admin edits appear immediately.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, allEntries, skillGroups] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "singleton" } }),
    prisma.entry.findMany(),
    prisma.skillGroup.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!profile) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 font-mono text-sm text-text-secondary">
        <p className="text-accent">{"// no profile found"}</p>
        <p className="mt-2">
          Run <code className="text-text-primary">npm run db:seed</code> to load the
          initial data.
        </p>
      </main>
    );
  }

  const experience = sortEntries(allEntries.filter((e) => e.kind === "experience"));
  const education = sortEntries(allEntries.filter((e) => e.kind === "education"));

  return (
    <main className="min-h-screen">
      <Hero profile={profile} />

      <Section index="01" label="Summary" id="summary">
        <p className="max-w-3xl text-base leading-relaxed text-text-secondary md:text-lg">
          {profile.summary}
        </p>
      </Section>

      <Section index="02" label="Experience" id="experience">
        <div className="space-y-4">
          {experience.map((e) => (
            <EntryCard key={e.id} entry={e} />
          ))}
          {experience.length === 0 && (
            <p className="font-mono text-sm text-text-secondary">
              {"// no experience entries yet"}
            </p>
          )}
        </div>
      </Section>

      <Section index="03" label="Skills" id="skills">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {skillGroups.map((g) => (
            <SkillsGroupCard key={g.id} group={g} />
          ))}
          {skillGroups.length === 0 && (
            <p className="font-mono text-sm text-text-secondary">
              {"// no skill groups yet"}
            </p>
          )}
        </div>
      </Section>

      <Section index="04" label="Education" id="education">
        <div className="space-y-4">
          {education.map((e) => (
            <EntryCard key={e.id} entry={e} />
          ))}
          {education.length === 0 && (
            <p className="font-mono text-sm text-text-secondary">
              {"// no education entries yet"}
            </p>
          )}
        </div>
      </Section>

      <footer className="grid-divider" id="contact">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 px-5 py-14 md:grid-cols-[180px_1fr] md:px-8 md:py-16">
          <div className="mb-6 md:mb-0">
            <div className="font-mono text-xs text-text-secondary">05</div>
            <h2 className="section-label mt-1">Contact</h2>
          </div>
          <div>
            <p className="max-w-xl text-base text-text-secondary">
              Open to full-stack engineering work. Reach out directly.
            </p>
            <div className="mt-6">
              <SocialLinks
                github={profile.github}
                linkedin={profile.linkedin}
                email={profile.email}
              />
            </div>
            <p className="mt-10 font-mono text-xs text-text-secondary">
              <span className="text-grid">{"//"}</span> {profile.name} — {profile.location}
              {"  "}·{"  "}© {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
