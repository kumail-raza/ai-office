export enum OfficeObjectType {
  Monitor = "MONITOR",
  Certificate = "CERTIFICATE",
  Bookshelf = "BOOKSHELF",
  Coffee = "COFFEE",
  Window = "WINDOW",
}

/**
 * How an object's action resolves. Only `Info` is wired today; the others are
 * seams for future work (AI narration, camera zoom, scene transitions,
 * knowledge integration) — an object can adopt them without changing its shape.
 */
export enum OfficeActionKind {
  Info = "info",
  Narrate = "narrate",
  ZoomTo = "zoom",
  Transition = "transition",
  Knowledge = "knowledge",
}

export interface OfficePosition {
  /** Horizontal placement as a percentage of the viewport (0–100). */
  x: number;
  /** Vertical placement as a percentage of the viewport (0–100). */
  y: number;
}

export interface OfficeObjectAction {
  label: string;
  kind: OfficeActionKind;
}

export interface OfficeObject {
  id: string;
  name: string;
  type: OfficeObjectType;
  position: OfficePosition;
  description: string;
  icon: string;
  action: OfficeObjectAction;
}

/* ---- Experience content (markdown-backed, served via OfficeContentService) ---- */

export interface OfficeProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  detail: string;
}

export interface OfficeCertification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  summary: string;
}

export interface OfficeResource {
  title: string;
  description: string;
}

export interface OfficeResourceCategory {
  id: string;
  title: string;
  resources: OfficeResource[];
}

export interface OfficeContent {
  projects: OfficeProject[];
  certifications: OfficeCertification[];
  resources: OfficeResourceCategory[];
}

/* ---- Window environment ---- */

export enum WindowMode {
  Morning = "morning",
  Night = "night",
  Rain = "rain",
  Cyberpunk = "cyberpunk",
}
