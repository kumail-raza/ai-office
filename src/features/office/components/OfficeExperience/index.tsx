"use client";

import { AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

import { useOfficeInteraction } from "../../hooks/useOfficeInteraction";
import { OfficeObjectType } from "../../types";
import { ExperienceShell } from "../ExperienceShell";
import { BookshelfExperience } from "../experiences/BookshelfExperience";
import { CertificateExperience } from "../experiences/CertificateExperience";
import { CoffeeExperience } from "../experiences/CoffeeExperience";
import { MonitorExperience } from "../experiences/MonitorExperience";
import { WindowExperience } from "../experiences/WindowExperience";

const TITLES: Record<OfficeObjectType, string> = {
  [OfficeObjectType.Monitor]: "Projects Dashboard",
  [OfficeObjectType.Certificate]: "Certifications",
  [OfficeObjectType.Bookshelf]: "Knowledge Library",
  [OfficeObjectType.Coffee]: "Coffee Break",
  [OfficeObjectType.Window]: "Environment",
};

function experienceFor(type: OfficeObjectType): ReactNode {
  switch (type) {
    case OfficeObjectType.Monitor:
      return <MonitorExperience />;
    case OfficeObjectType.Certificate:
      return <CertificateExperience />;
    case OfficeObjectType.Bookshelf:
      return <BookshelfExperience />;
    case OfficeObjectType.Coffee:
      return <CoffeeExperience />;
    case OfficeObjectType.Window:
      return <WindowExperience />;
  }
}

export function OfficeExperience() {
  const { selectedObject, closePanel } = useOfficeInteraction();

  return (
    <AnimatePresence>
      {selectedObject ? (
        <ExperienceShell
          key={selectedObject.id}
          title={TITLES[selectedObject.type]}
          icon={selectedObject.icon}
          onClose={closePanel}
        >
          {experienceFor(selectedObject.type)}
        </ExperienceShell>
      ) : null}
    </AnimatePresence>
  );
}
