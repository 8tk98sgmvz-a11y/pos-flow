'use client';

import { Component, type ReactNode } from 'react';

/** Si un árbol de UI truena, el resto de la app sigue. */
export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        this.props.fallback ?? <p className="p-4 text-caption text-muted">Esta vista no está disponible.</p>
      );
    }
    return this.props.children;
  }
}
