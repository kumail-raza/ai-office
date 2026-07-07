import "server-only";

export interface MarkdownSubsection {
  title: string;
  content: string;
}

/** Splits a markdown body into top-level ("## Heading") sections, keyed by heading text. */
export function splitTopSections(body: string): Map<string, string> {
  const sections = new Map<string, string>();
  let current: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (current !== null) sections.set(current, buffer.join("\n").trim());
    buffer = [];
  };

  for (const line of body.split("\n")) {
    const match = line.match(/^##\s+(.+?)\s*$/);
    if (match) {
      flush();
      current = match[1];
    } else {
      buffer.push(line);
    }
  }
  flush();

  return sections;
}

/** Splits a section's body into "### Subheading" subsections, in document order. */
export function splitSubsections(body: string): MarkdownSubsection[] {
  const subsections: MarkdownSubsection[] = [];
  let current: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (current !== null) subsections.push({ title: current, content: buffer.join("\n").trim() });
    buffer = [];
  };

  for (const line of body.split("\n")) {
    const match = line.match(/^###\s+(.+?)\s*$/);
    if (match) {
      flush();
      current = match[1];
    } else {
      buffer.push(line);
    }
  }
  flush();

  return subsections;
}

/** Parses a flat "- item" bullet list into a string array. */
export function parseBulletList(section: string): string[] {
  return [...section.matchAll(/^-\s+(.+)$/gm)].map((match) => match[1].trim());
}
