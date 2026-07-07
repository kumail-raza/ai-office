import { create } from "zustand";

import { WindowMode } from "@/features/office/types";

/**
 * Scene-level settings. `themeMode` is the environment state driven by the
 * office window experience; visuals can bind to it later without changing the
 * control surface.
 */
interface SettingsState {
  themeMode: WindowMode;
  setThemeMode: (mode: WindowMode) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  themeMode: WindowMode.Morning,
  setThemeMode: (themeMode) => set({ themeMode }),
}));
