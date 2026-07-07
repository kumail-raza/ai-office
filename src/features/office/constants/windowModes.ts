import { WindowMode } from "../types";

export interface WindowModeOption {
  mode: WindowMode;
  label: string;
  icon: string;
  hint: string;
}

export const WINDOW_MODES: WindowModeOption[] = [
  { mode: WindowMode.Morning, label: "Morning", icon: "🌅", hint: "Warm daylight" },
  { mode: WindowMode.Night, label: "Night", icon: "🌙", hint: "Calm and dim" },
  { mode: WindowMode.Rain, label: "Rain", icon: "🌧️", hint: "Soft and grey" },
  { mode: WindowMode.Cyberpunk, label: "Cyberpunk", icon: "🌆", hint: "Neon focus" },
];
