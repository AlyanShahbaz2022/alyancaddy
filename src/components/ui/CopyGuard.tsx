"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const BLOCK_KEYS = ["c", "x", "a", "s", "u"];

export default function CopyGuard() {
  const pathname = usePathname();
  const enabled = !pathname.startsWith("/admin");

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("no-copy");

    const prevent = (event: Event) => event.preventDefault();
    const onKeyDown = (event: KeyboardEvent) => {
      const meta = event.ctrlKey || event.metaKey;
      if (meta && BLOCK_KEYS.includes(event.key.toLowerCase())) {
        event.preventDefault();
      }
    };

    document.addEventListener("copy", prevent, true);
    document.addEventListener("cut", prevent, true);
    document.addEventListener("contextmenu", prevent, true);
    document.addEventListener("dragstart", prevent, true);
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.documentElement.classList.remove("no-copy");
      document.removeEventListener("copy", prevent, true);
      document.removeEventListener("cut", prevent, true);
      document.removeEventListener("contextmenu", prevent, true);
      document.removeEventListener("dragstart", prevent, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [enabled]);

  return null;
}