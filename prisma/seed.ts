import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper: build a date at UTC midnight, first of the month.
const d = (year: number, month: number) => new Date(Date.UTC(year, month - 1, 1));

async function main() {
  // ---- Profile (singleton) ----
  const profileData = {
    name: "Rami Nawahda",
    title: "Software Engineer",
    tagline:
      "Full-stack engineer specialized in Angular & TypeScript, building end-to-end production systems",
    summary:
      "I'm a full-stack engineer who builds and ships production software end-to-end. Over the past 5+ years I've grown from frontend into full-stack, owning features from Angular and TypeScript interfaces through NestJS, .NET, and Node.js backends down to PostgreSQL. Lately I've been wiring AI into real product surfaces — building an AI-powered healthcare analytics platform with Python and FastAPI. I care about quality, correctness, and data integrity, and I back it up with automated testing in Playwright and TestCafe. I like turning ambiguous requirements into reliable, well-crafted products.",
    location: "Ramallah, Palestine",
    email: "rami.nawahda@gmail.com",
    github: "https://github.com/raminawahda7",
    linkedin: "https://www.linkedin.com/in/rami-nawahda",
    resumeUrl: "/Rami_Nawahda_CV.pdf",
  };

  // Upsert keeps existing edits' id stable while refreshing seed fields.
  await prisma.profile.upsert({
    where: { id: "singleton" },
    update: profileData,
    create: { id: "singleton", ...profileData },
  });

  // ---- Experience ----
  const experience = [
    {
      title: "Team Lead & Full Stack Engineer",
      company: "Kayan Healthcare Technologies",
      location: "Jenin, Palestine (Remote)",
      companyUrl: "",
      blurb:
        "Transforming healthcare claims management across the GCC through cutting-edge AI and deep regional expertise — redefining e-claims for speed, intelligence, and precision.",
      startDate: d(2024, 1),
      endDate: d(2026, 8),
      description: [
        "Leading development of an AI-powered healthcare analytics platform using Python, FastAPI, and React",
        "Built data pipelines using pandas and NumPy for healthcare data analysis",
        "Deployed the platform on on-premise servers, managing infrastructure and reliability",
        "Designed PostgreSQL schemas with focus on data integrity and migrations",
        "Led a distributed remote team, conducting code reviews and mentoring",
      ].join("\n"),
      techStack: "Python, FastAPI, React, PostgreSQL, pandas, NumPy",
    },
    {
      title: "Full-Stack Developer",
      company: "American Psychological Association (APA)",
      location: "USA (Remote)",
      companyUrl: "https://www.apa.org",
      blurb:
        "The leading scientific and professional organization representing psychology in the United States.",
      startDate: d(2024, 4),
      endDate: null,
      description: [
        "Built three production systems: election management, commenting, and data synchronization",
        "Developing full-stack apps using Angular 20, NestJS, TypeScript",
        "Built AWS Lambda functions for automated data sync and workflow orchestration",
        "Applied AI tooling professionally throughout the delivery workflow to design, build, and ship high-quality production features faster — without compromising correctness or data integrity",
        "Designed automated UI and integration test suites from requirements",
        "Deployed via CI/CD to AWS",
      ].join("\n"),
      techStack: "Angular, NestJS, TypeScript, AWS Lambda, PostgreSQL",
    },
    {
      title: "Full Stack Developer",
      company: "AppiaTech Software Services (AerData/Boeing)",
      location: "Ramallah, Palestine",
      companyUrl: "https://www.aerdata.com",
      blurb:
        "AerData, a Boeing company, builds software for aircraft lease management, records, and engine fleet planning.",
      startDate: d(2021, 4),
      endDate: d(2025, 3),
      description: [
        "Designed end-to-end enterprise features using .NET Core, Angular, React, Node.js",
        "Set up automated UI testing with TestCafe for large projects built on Kendo UI",
        "Built modular Angular/React components with NgRx state management",
        "Mentored junior developers, established engineering best practices",
      ].join("\n"),
      techStack: ".NET Core, C#, Angular, React, TestCafe, PostgreSQL",
    },
    {
      title: "Front End Developer (Part Time)",
      company: "STOQA",
      location: "Riyadh, Saudi Arabia (Remote)",
      companyUrl: "https://stoqa.ai/",
      blurb:
        "A financial intelligence platform for investors in the Saudi market — turning complex financial data into clear, actionable investment insights.",
      startDate: d(2024, 10),
      endDate: d(2025, 6),
      description: [
        "Developing React/Angular components with Tailwind CSS",
        "Implementing state management with NgRx signals",
      ].join("\n"),
      techStack: "Angular, React, Tailwind CSS, NgRx",
    },
  ];

  // ---- Education ----
  const education = [
    {
      title: "B.S. Computer System Engineering",
      company: "Palestine Polytechnic University",
      location: "Hebron, Palestine",
      startDate: d(2016, 9),
      endDate: d(2020, 9),
      description: "",
      techStack: "",
    },
    {
      title: "Full Stack Engineering Internship",
      company: "RBK + Anera",
      location: "Ramallah, Palestine",
      startDate: d(2020, 12),
      endDate: d(2021, 3),
      description:
        "Intensive Hack Reactor partner program producing market-ready full stack engineers with strong problem-solving skills.",
      techStack: "",
    },
  ];

  // ---- Skills ----
  const skills = [
    { name: "Frontend", skills: "Angular, TypeScript, React, Tailwind CSS" },
    { name: "Backend", skills: "C#/.NET Core, Node.js, NestJS, Python, FastAPI" },
    { name: "Databases", skills: "PostgreSQL, MySQL" },
    { name: "Testing", skills: "TestCafe, Playwright, Jest" },
    { name: "Cloud/DevOps", skills: "AWS, Docker, CI/CD" },
  ];

  // Wipe collections so re-seeding is idempotent (dev convenience).
  await prisma.entry.deleteMany();
  await prisma.skillGroup.deleteMany();

  // displayOrder auto-computed from startDate: larger (more recent) = higher priority.
  const orderFromDate = (start: Date) => Math.floor(start.getTime() / 1000);

  for (const e of [...experience, ...education]) {
    const kind = education.includes(e as (typeof education)[number])
      ? "education"
      : "experience";
    await prisma.entry.create({
      data: { ...e, kind, displayOrder: orderFromDate(e.startDate) },
    });
  }

  for (let i = 0; i < skills.length; i++) {
    await prisma.skillGroup.create({
      data: { name: skills[i].name, skills: skills[i].skills, sortOrder: i },
    });
  }

  console.log("Seed complete: profile, entries, skills inserted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
