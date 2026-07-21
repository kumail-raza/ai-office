import { create } from "zustand";

interface ProjectsState {
  isProjectsOpen: boolean;
  openProjects: () => void;
  closeProjects: () => void;
  toggleProjects: () => void;
}

/**
 * Open/close state for the Project Experience, lifted from local component
 * state into a store so it can be opened programmatically — by the toggle, and
 * now by the office interaction bridge — exactly as Recruiter Mode already is
 * (see recruiter.store). Session-scoped; no persistence needed.
 */
export const useProjectsStore = create<ProjectsState>((set) => ({
  isProjectsOpen: false,
  openProjects: () => set({ isProjectsOpen: true }),
  closeProjects: () => set({ isProjectsOpen: false }),
  toggleProjects: () => set((state) => ({ isProjectsOpen: !state.isProjectsOpen })),
}));
