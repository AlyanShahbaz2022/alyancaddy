"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FolderOpen, Menu, X } from "lucide-react";

import type { Content, Link as LinkType } from "@/types/content";
import DocumentsPanel from "@/components/layout/DocumentsPanel";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type NavbarProps = {
  logo: string;
  logoImage?: string;
  links: LinkType[];
  hire: LinkType;
  documents: Content["documents"];
};

export default function Navbar({ logo, logoImage, links, hire, documents }: NavbarProps) {
  const hasLogoImage = Boolean(logoImage && logoImage.trim());
  const logoNode = hasLogoImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoImage}
      alt={logo || "Logo"}
      className="h-16 w-auto object-contain sm:h-20 lg:h-24"
    />
  ) : (
    <span className="font-display text-xl tracking-widest text-white">{logo}</span>
  );

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const closeDocs = useCallback(() => setDocsOpen(false), []);

  const docsButton = (className?: string) => (
      <button
        type="button"
        onClick={() => setDocsOpen(true)}
        aria-label={documents.label}
        title={documents.label}
        data-cursor-label="DOCS"
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-accent hover:text-accent",
          className
        )}
      >
        <FolderOpen size={20} />
      </button>
    );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-line/70 bg-ink/85 backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <div className="container-x flex h-24 items-center justify-between lg:h-28">
          <a href="#home" data-cursor-label="TOP" className="flex items-center">
            {logoNode}
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold uppercase tracking-widest text-muted transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {docsButton()}
            <Button href={hire.href}>{hire.label}</Button>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            {docsButton("h-10 w-10")}
            <button onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink/95 backdrop-blur-xl"
          >
            <div className="container-x flex h-20 items-center justify-between">
              <span className="flex items-center">{logoNode}</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={26} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col items-center justify-center gap-7">
              {links.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * index, duration: 0.4 }}
                  className="font-display text-4xl uppercase tracking-wide text-white transition-colors hover:text-accent"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="pb-14 text-center">
              <Button href={hire.href} onClick={() => setOpen(false)} size="lg">
                {hire.label}
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <DocumentsPanel open={docsOpen} onClose={closeDocs} documents={documents} />
    </>
  );
}
