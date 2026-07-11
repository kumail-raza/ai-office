"use client";

import { Component, type ReactNode } from "react";

interface SceneErrorBoundaryProps {
  children: ReactNode;
  /** Rendered instead of the scene when 3D rendering fails. */
  fallback: ReactNode;
}

interface SceneErrorBoundaryState {
  failed: boolean;
}

/**
 * Catches WebGL / render errors from the 3D scene so a graphics failure never
 * breaks the page — the caller's fallback (the existing 2D office remains
 * behind it) takes over instead.
 */
export class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  state: SceneErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}
