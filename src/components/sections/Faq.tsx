"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import type { Content } from "@/types/content";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

type FaqProps = {
  faqs: Content["faqs"];
};

export default function Faq({ faqs }: FaqProps) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Section id="faq">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow={faqs.eyebrow}
            heading={faqs.heading}
            watermark={faqs.watermark}
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted sm:text-base">
            {faqs.description}
          </p>
          <div className="mt-7">
            <Button href={faqs.cta.href} variant="outline">
              {faqs.cta.label}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.items.map((faq) => {
            const isOpen = open === faq.id;
            return (
              <div
                key={faq.id}
                className={cn(
                  "overflow-hidden rounded-xl border transition-colors",
                  isOpen
                    ? "border-accent/50 bg-card"
                    : "border-line bg-card/50 hover:border-line/80"
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : faq.id)}
                  data-cursor-label="OPEN"
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold sm:text-base">
                    {faq.question}
                  </span>
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                      isOpen
                        ? "rotate-45 border-accent text-accent"
                        : "border-line text-muted"
                    )}
                  >
                    <Plus size={14} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}