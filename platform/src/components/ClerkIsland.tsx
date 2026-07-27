"use client";

import { Component, type ReactNode } from "react";

/* Keeps an auth failure from taking the course down with it.
 *
 * The reader is server-rendered and needs no auth to be readable, so nothing
 * about a broken account widget should cost a student their lesson — and
 * students on poor connections are the whole audience. An unguarded component
 * that throws unmounts the entire React tree, so each Clerk-dependent island
 * renders inside this boundary instead: if auth breaks, the account button
 * quietly disappears and the lesson stays up.
 *
 * Precautionary rather than a fix for an observed crash — Clerk's own failure
 * behaviour hasn't been exercised here against a real instance. */
export class ClerkIsland extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // Not silent — the reader survives, but the failure is still worth seeing.
    console.error("[auth] Clerk island failed; continuing without it.", error);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
