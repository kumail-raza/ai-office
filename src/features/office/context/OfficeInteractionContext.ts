"use client";

import { createContext } from "react";

import type { OfficeObject } from "../types";

export interface OfficeInteractionValue {
  hoveredId: string | null;
  selectedObject: OfficeObject | null;
  isPanelOpen: boolean;
  setHovered: (id: string | null) => void;
  selectObject: (object: OfficeObject) => void;
  closePanel: () => void;
  runAction: (object: OfficeObject) => void;
}

export const OfficeInteractionContext = createContext<OfficeInteractionValue | null>(null);
