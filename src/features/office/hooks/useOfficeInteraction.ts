"use client";

import { useContext } from "react";

import {
  OfficeInteractionContext,
  type OfficeInteractionValue,
} from "../context/OfficeInteractionContext";

export function useOfficeInteraction(): OfficeInteractionValue {
  const value = useContext(OfficeInteractionContext);
  if (value === null) {
    throw new Error("useOfficeInteraction must be used within an OfficeInteractionProvider");
  }
  return value;
}
