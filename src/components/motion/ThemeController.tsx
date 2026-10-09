"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { innerAccentForPath } from "@/lib/palette";

const HOME = new Set(["/", "/en"]);

/**
 * Inner pages use the old-site theme (`html[data-theme="inner"]`) and their
 * section accent. The home keeps its own tokens; there RoomScene drives
 * the accent per room.
 */
export function ThemeController() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const clean = pathname.replace(/\/+$/, "") || "/";
    const isHome = HOME.has(clean);

    if (isHome) root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", "inner");

    const accent = innerAccentForPath(pathname);
    if (accent) {
      root.style.setProperty("--accent", accent.accent);
      root.style.setProperty("--accent-ink", accent.ink);
    } else if (!isHome) {
      root.style.removeProperty("--accent");
      root.style.removeProperty("--accent-ink");
    }

    return () => {
      root.removeAttribute("data-theme");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--accent-ink");
    };
  }, [pathname]);

  return null;
}
