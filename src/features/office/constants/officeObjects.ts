import { OfficeActionKind, type OfficeObject, OfficeObjectType } from "../types";

/**
 * The definitive set of interactive office objects. Positions are viewport
 * percentages placed on the left/centre of the workspace so they never collide
 * with the right-docked conversation panel.
 */
export const OFFICE_OBJECTS: OfficeObject[] = [
  {
    id: "monitor",
    name: "Monitor",
    type: OfficeObjectType.Monitor,
    position: { x: 30, y: 66 },
    icon: "🖥️",
    description:
      "Projects Overview — real-time platforms, AI systems, and cloud architecture. This screen is where most of the building happens.",
    action: { label: "View Projects", kind: OfficeActionKind.Knowledge },
  },
  {
    id: "certificate",
    name: "Certifications",
    type: OfficeObjectType.Certificate,
    position: { x: 12, y: 14 },
    icon: "🏆",
    description:
      "Certifications Overview — AWS Solutions Architect, AWS DevOps Engineer, and Certified Kubernetes Administrator.",
    action: { label: "See Certifications", kind: OfficeActionKind.Knowledge },
  },
  {
    id: "bookshelf",
    name: "Bookshelf",
    type: OfficeObjectType.Bookshelf,
    position: { x: 6, y: 52 },
    icon: "📚",
    description:
      "Learning Resources — the books and references I keep close: systems design, distributed systems, and applied AI.",
    action: { label: "Learning Resources", kind: OfficeActionKind.Info },
  },
  {
    id: "coffee",
    name: "Coffee",
    type: OfficeObjectType.Coffee,
    position: { x: 44, y: 70 },
    icon: "☕",
    description:
      "Fun Fact — most of this office was built between cups of coffee, usually before the rest of the world woke up.",
    action: { label: "Another Fun Fact", kind: OfficeActionKind.Info },
  },
  {
    id: "window",
    name: "Window",
    type: OfficeObjectType.Window,
    position: { x: 19, y: 32 },
    icon: "🪟",
    description:
      "Environment Settings — a bright, calm workspace with natural light, a warm palette, and a few plants. Ambient controls are coming soon.",
    action: { label: "Environment Settings", kind: OfficeActionKind.Info },
  },
];
