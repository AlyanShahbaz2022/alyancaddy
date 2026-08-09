"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { Content } from "@/types/content";
import AppMockupCard from "@/components/sections/AppMockupCard";
import ProjectCard from "@/components/sections/ProjectCard";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

type PortfolioProps = {
  portfolio: Content["portfolio"];
};

export default function Portfolio({ portfolio }: PortfolioProps) {
  const [active, setActive] = useState(portfolio.filters[0] ?? "ALL");

  const items = useMemo(() => {
    if (!active || active === "ALL" || active === portfolio.filters[0]) {
      return portfolio.items;
    }
    return portfolio.items.filter((project) => project.filter === active);
  }, [active, portfolio]);

  return (
    <Section id="portfolio">
      <SectionHeading
        eyebrow={portfolio.eyebrow}
        heading={portfolio.heading}
        watermark={portfolio.watermark}
        align="center"
      />
      <p className="mt-5 text-center text-sm text-muted">
        {portfolio.subtext}
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {portfolio.filters.map((filter) => {
          const isActive = active === filter;
          return (
            <button
              key={filter}
              onClick={() => setActive(filter)}
              aria-pressed={isActive}
              className={cn(
                "relative rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-colors",
                isActive ? "text-black" : "text-muted hover:text-white"
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="pf-pill"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              ) : null}
              <span className="relative z-10">{filter}</span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="mt-12 grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {items.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={cn(project.wide && "md:col-span-2")}
            >
              {project.isMockup ? (
                <AppMockupCard project={project} />
              ) : (
                <ProjectCard project={project} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}