"use client";

import { useEffect, useState } from "react";

let cachedSupport: boolean | null = null;

function detectWebGL(): boolean {
  if (cachedSupport !== null) return cachedSupport;
  try {
    const canvas = document.createElement("canvas");
    cachedSupport =
      canvas.getContext("webgl2") !== null || canvas.getContext("webgl") !== null;
  } catch {
    cachedSupport = false;
  }
  return cachedSupport;
}

/**
 * Whether the browser can render WebGL. Starts as `null` (unknown) so SSR and
 * the first client render agree, then resolves after mount — consumers keep the
 * 2D office as the fallback whenever this is not `true`.
 */
export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(detectWebGL());
  }, []);

  return supported;
}
