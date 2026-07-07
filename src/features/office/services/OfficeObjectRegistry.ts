import { OFFICE_OBJECTS } from "../constants/officeObjects";
import type { OfficeObject, OfficeObjectType } from "../types";

/**
 * Single source of truth for office objects. All consumers read through the
 * registry rather than the raw array, so lookups and future indexing live in
 * one place.
 */
export const OfficeObjectRegistry = {
  getAll(): OfficeObject[] {
    return OFFICE_OBJECTS;
  },

  getById(id: string): OfficeObject | undefined {
    return OFFICE_OBJECTS.find((object) => object.id === id);
  },

  getByType(type: OfficeObjectType): OfficeObject | undefined {
    return OFFICE_OBJECTS.find((object) => object.type === type);
  },
};
