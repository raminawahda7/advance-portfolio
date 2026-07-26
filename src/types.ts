/** Entry as sent to / received from the admin API (dates as ISO strings). */
export interface EntryDTO {
  id: string;
  kind: "experience" | "education";
  title: string;
  company: string;
  location: string;
  startDate: string; // ISO
  endDate: string | null; // ISO or null == Present
  description: string; // newline-separated bullets
  blurb: string; // short company brief (hover)
  companyUrl: string; // company website
  techStack: string; // comma-separated
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Form payload for create/update. Dates are "YYYY-MM" month-input strings. */
export interface EntryForm {
  kind: "experience" | "education";
  title: string;
  company: string;
  location: string;
  startDate: string; // "YYYY-MM"
  endDate: string; // "YYYY-MM" or "" for Present
  description: string;
  blurb: string;
  companyUrl: string;
  techStack: string;
  displayOrder: string; // "" = auto
}
