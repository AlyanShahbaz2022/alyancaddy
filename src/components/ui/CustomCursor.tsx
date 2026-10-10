"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState("VIEW");
  const [visible, setVisible] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 400, damping: 35, mass: 0.6 });
  const ringY = useSpring(dotY, { stiffness: 400, damping: 35, mass: 0.6 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    document.documentElement.classList.add("custom-cursor-on");

    const onMove = (event: MouseEvent) => {
      dotX.set(event.clientX);
      dotY.set(event.clientY);
      setEnabled(true);
      setVisible(true);
    };

    const onOver = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest(
        "a, button, [data-cursor], [data-cursor-label], [role='button']"
      ) as HTMLElement | null;
      if (target) {
        setHovering(true);
        const custom = target.getAttribute("data-cursor-label");
        setLabel(custom || "VIEW");
      } else {
        setHovering(false);
        setLabel("VIEW");
      }
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("custom-cursor-on");
    };
  }, [dotX, dotY]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x: dotX, y: dotY, opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] transition-opacity duration-300"
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <div className="h-2 w-2 rounded-full bg-white" />
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] transition-opacity duration-300"
      >
        <motion.div
          animate={{ scale: hovering ? 2.2 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="-translate-x-1/2 -translate-y-1/2"
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 ${
              hovering
                ? "border-accent bg-accent/20"
                : "border-white/60 bg-transparent"
            }`}
          >
            <span
              className={`text-[8px] font-bold uppercase tracking-widest text-white ${
                hovering ? "opacity-100" : "opacity-0"
              }`}
            >
              {label}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
