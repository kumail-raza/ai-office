import { RecruiterSection } from "../types";

export interface DashboardSectionMeta {
  id: RecruiterSection;
  label: string;
  icon: string;
}

export const DASHBOARD_SECTIONS: DashboardSectionMeta[] = [
  { id: RecruiterSection.Overview, label: "Overview", icon: "🧭" },
  { id: RecruiterSection.Summary, label: "Professional Summary", icon: "🧑‍💼" },
  { id: RecruiterSection.Experience, label: "Experience Timeline", icon: "🕒" },
  { id: RecruiterSection.Skills, label: "Skills Matrix", icon: "🧩" },
  { id: RecruiterSection.Certifications, label: "Certifications", icon: "🏆" },
  { id: RecruiterSection.Projects, label: "Projects", icon: "🗂️" },
  { id: RecruiterSection.Availability, label: "Availability", icon: "📅" },
  { id: RecruiterSection.Contact, label: "Contact", icon: "✉️" },
];
