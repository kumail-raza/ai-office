import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RecruiterState {
  isRecruiterMode: boolean;
  enterRecruiterMode: () => void;
  exitRecruiterMode: () => void;
  toggleRecruiterMode: () => void;
}

const storage =
  typeof window !== "undefined"
    ? createJSONStorage<Pick<RecruiterState, "isRecruiterMode">>(() => sessionStorage)
    : undefined;

/** Recruiter Mode flag, persisted for the browser session (not across tabs/restarts). */
export const useRecruiterStore = create<RecruiterState>()(
  persist(
    (set) => ({
      isRecruiterMode: false,
      enterRecruiterMode: () => set({ isRecruiterMode: true }),
      exitRecruiterMode: () => set({ isRecruiterMode: false }),
      toggleRecruiterMode: () => set((state) => ({ isRecruiterMode: !state.isRecruiterMode })),
    }),
    {
      name: "recruiter-mode",
      storage,
      partialize: (state) => ({ isRecruiterMode: state.isRecruiterMode }),
    },
  ),
);
