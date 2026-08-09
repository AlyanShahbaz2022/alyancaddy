"use client";

import { motion } from "framer-motion";

import type { Content } from "@/types/content";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import SiteImage from "@/components/ui/SiteImage";
import { splitHighlighted } from "@/lib/content";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type HeroProps = {
  hero: Content["hero"];
  socials: Content["socials"];
  name: string;
};

export default function Hero({ hero, socials, name }: HeroProps) {
  const words: { text: string; highlighted: boolean; key: number }[] = [];
  splitHighlighted(hero.headline).forEach((segment) => {
    segment.text.split(" ").filter(Boolean).forEach((word) => {
      words.push({ text: word, highlighted: segment.highlighted, key: words.length });
    });
  });

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pb-16 pt-24"
    >
      <div className="absolute left-7 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-5 xl:flex">
        <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-muted [writing-mode:vertical-rl]">
          Follow Us
        </span>
        <span className="h-12 w-px bg-line" />
        {socials.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="text-muted transition-colors hover:text-accent"
          >
            <Icon name={social.icon} size={18} />
          </a>
        ))}
      </div>

      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2.5 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green-400"
          >
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-green-400" />
            {hero.availability}
          </motion.div>

          <motion.h1
            aria-label={hero.headline.replace(/\*\*/g, "")}
            className="mt-6 font-display text-5xl uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {words.map((word) => (
              <motion.span
                key={word.key}
                variants={item}
                className={`inline-block ${word.highlighted ? "text-accent" : "text-white"}`}
              >
                {word.text}&nbsp;
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-muted"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base"
          >
            {hero.description}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <Button href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="outline" size="lg">
              {hero.secondaryCta.label}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="relative overflow-hidden rounded-3xl border border-line">
            <SiteImage
              src={hero.image}
              alt={name}
              width={720}
              height={900}
              preload
              className="h-[420px] w-full object-cover sm:h-[500px] lg:h-[560px]"
            />
          </div>

          {hero.cards.map((card, index) => (
            <div
              key={card.id}
              className={`absolute animate-floaty rounded-2xl border border-line bg-card px-5 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] ${
                index === 0
                  ? "-left-5 top-10 sm:-left-8"
                  : "-right-3 bottom-16 sm:-right-6"
              }`}
              style={{ animationDelay: index === 0 ? "0s" : "0.9s" }}
            >
              <p className="font-display text-2xl text-accent">{card.value}</p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-white/70">
                {card.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}