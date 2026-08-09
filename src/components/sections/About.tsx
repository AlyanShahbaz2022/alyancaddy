import type { Content } from "@/types/content";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SiteImage from "@/components/ui/SiteImage";

type AboutProps = {
  about: Content["about"];
};

export default function About({ about }: AboutProps) {
  return (
    <Section id="about">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div className="relative mx-auto max-w-md">
            <div className="relative overflow-hidden rounded-3xl border border-line">
              <SiteImage
                src={about.image}
                alt={about.name}
                width={640}
                height={820}
                className="aspect-[4/5] w-full object-cover"
              />
              <span className="absolute bottom-0 left-0 bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-black">
                {about.ribbon}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {about.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <div>
          <SectionHeading eyebrow={about.eyebrow} heading={about.heading} />
          <Reveal delay={0.05}>
            <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted">
              <Icon name="map-pin" size={16} className="text-accent" />
              {about.location}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-2 space-y-4">
              {about.bio.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm leading-relaxed text-muted sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {about.checklist.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15">
                    <Icon name="check" size={14} className="text-accent" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8">
              <Button href={about.cta.href}>{about.cta.label}</Button>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}