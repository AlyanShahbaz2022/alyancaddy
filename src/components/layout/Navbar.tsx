"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import type { Link as LinkType } from "@/types/content";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type NavbarProps = {
  logo: string;
  logoImage?: string;
  links: LinkType[];
  hire: LinkType;
};

export default function Navbar({ logo, logoImage, links, hire }: NavbarProps) {
  const hasLogoImage = Boolean(logoImage && logoImage.trim());
  const logoNode = hasLogoImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoImage}
      alt={logo || "Logo"}
      className="h-12 w-auto object-contain sm:h-14 lg:h-16"
    />
  ) : (
    <span className="font-display text-xl tracking-widest text-white">{logo}</span>
  );

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
            ? "border-b border-line/70 bg-base/85 backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <div className="container-x flex h-20 items-center justify-between">
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

          <div className="hidden md:block">
            <Button href={hire.href}>{hire.label}</Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col bg-base/95 backdrop-blur-xl"
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
    </>
  );
}
