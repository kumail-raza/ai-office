"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";

import type { OfficeObject } from "../types";
import {
  OfficeInteractionContext,
  type OfficeInteractionValue,
} from "./OfficeInteractionContext";

interface OfficeInteractionProviderProps {
  children: ReactNode;
  /**
   * Dispatches an object's action. Left undefined today (the panel simply
   * closes), this is the seam for future narration / camera zoom / scene
   * transitions / knowledge integration — wire it here without touching objects.
   */
  onAction?: (object: OfficeObject) => void;
}

export function OfficeInteractionProvider({
  children,
  onAction,
}: OfficeInteractionProviderProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<OfficeObject | null>(null);

  const setHovered = useCallback((id: string | null) => setHoveredId(id), []);
  const selectObject = useCallback((object: OfficeObject) => setSelectedObject(object), []);
  const closePanel = useCallback(() => setSelectedObject(null), []);

  const runAction = useCallback(
    (object: OfficeObject) => {
      if (onAction) onAction(object);
      else setSelectedObject(null);
    },
    [onAction],
  );

  const value = useMemo<OfficeInteractionValue>(
    () => ({
      hoveredId,
      selectedObject,
      isPanelOpen: selectedObject !== null,
      setHovered,
      selectObject,
      closePanel,
      runAction,
    }),
    [hoveredId, selectedObject, setHovered, selectObject, closePanel, runAction],
  );

  return (
    <OfficeInteractionContext.Provider value={value}>
      {children}
    </OfficeInteractionContext.Provider>
  );
}
