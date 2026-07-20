"use client";

import { Component, type ReactNode } from "react";

interface AvatarErrorBoundaryProps {
  /** Rendered in place of the children after a render/mount error. */
  fallback: ReactNode;
  children: ReactNode;
}

interface AvatarErrorBoundaryState {
  failed: boolean;
}

/**
 * Last line of the avatar's no-crash guarantee. The loader already resolves
 * missing/broken files to null, but a model that parses and then throws while
 * mounting (corrupt node graph, unexpected structure) would otherwise take the
 * whole canvas down — this boundary catches it and swaps in the fallback
 * (the procedural figure) instead.
 */
export class AvatarErrorBoundary extends Component<
  AvatarErrorBoundaryProps,
  AvatarErrorBoundaryState
> {
  state: AvatarErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): AvatarErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown): void {
    console.warn("[avatar] model failed to mount — procedural fallback rendered", error);
  }

  render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
