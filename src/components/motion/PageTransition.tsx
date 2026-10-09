import { ViewTransition } from "react";
import type { ReactNode } from "react";

/**
 * Wraps page content so route navigations animate. Directional types
 * ("nav-forward" / "nav-back") are set on <Link transitionTypes>.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
