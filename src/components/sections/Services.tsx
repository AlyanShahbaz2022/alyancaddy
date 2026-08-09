import type { Content } from "@/types/content";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import TagPill from "@/components/ui/TagPill";

type ServicesProps = {
  services: Content["services"];
};

export default function Services({ services }: ServicesProps) {
  return (
    <Section id="services" className="bg-surface/30">
      <SectionHeading
        eyebrow={services.eyebrow}
        heading={services.heading}
        watermark={services.watermark}
      />
      {services.intro ? (
        <p className="mt-5 max-w-xl text-sm text-muted">{services.intro}</p>
      ) : null}

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {services.items.map((service, index) => (
          <Reveal key={service.id} delay={(index % 2) * 0.1}>
            <Card className="group relative h-full overflow-hidden p-7 sm:p-8">
              <span
                aria-hidden
                className="absolute right-6 top-5 font-display text-6xl text-white/[0.05]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-black">
                <Icon name={service.icon} size={22} />
              </div>

              <h3 className="mt-6 font-display text-xl uppercase tracking-wide">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {service.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <TagPill key={tag}>{tag}</TagPill>
                ))}
              </div>

              <a
                href={service.cta.href}
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-accent transition-colors hover:text-white"
              >
                <Icon name="arrow-up-right" size={16} />
                {service.cta.label}
              </a>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}