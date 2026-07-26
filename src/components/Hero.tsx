import type { Profile } from "@prisma/client";
import { SocialLinks } from "./SocialLinks";
import { ThemeToggle } from "./ThemeToggle";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <header className="relative overflow-hidden">
      {/* faint blueprint backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-blueprint [background-size:32px_32px] opacity-[0.15]"
      />
      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-10 md:px-8 md:pb-20 md:pt-16">
        {/* top terminal bar */}
        <div className="flex items-center justify-between brutal-box px-3 py-2 font-mono text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 border border-ink bg-accent" />
            <span className="text-text-primary">~/rami-nawahda</span>
            <span className="text-grid">—</span>
            <span>portfolio</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline">{profile.location}</span>
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-10 md:mt-14">
          <p className="section-label">
            <span className="text-text-secondary">$</span> whoami
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tighter text-text-primary sm:text-5xl md:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-4 font-mono text-base text-accent md:text-lg">
            {profile.title}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
            {profile.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SocialLinks
              github={profile.github}
              linkedin={profile.linkedin}
              email={profile.email}
            />
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} download className="brutal-btn">
                ↓ Download CV
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
