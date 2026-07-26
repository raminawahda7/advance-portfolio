import { GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";

export function SocialLinks({
  github,
  linkedin,
  email,
}: {
  github: string;
  linkedin: string;
  email: string;
}) {
  const links = [
    { label: "GitHub", href: github, Icon: GitHubIcon },
    { label: "LinkedIn", href: linkedin, Icon: LinkedInIcon },
    { label: "Email", href: `mailto:${email}`, Icon: MailIcon },
  ];

  return (
    <ul className="flex flex-wrap gap-3">
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-2 brutal-box brutal-tap px-3 py-2 font-mono text-xs font-medium uppercase tracking-wider text-text-primary hover:text-accent"
          >
            <Icon className="text-ink transition-colors group-hover:text-accent" />
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
