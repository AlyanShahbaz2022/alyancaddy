import type { Content } from "@/types/content";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

type StatsProps = {
  stats: Content["stats"];
};

export default function Stats({ stats }: StatsProps) {
  return (
    <Section id="stats" className="bg-surface/30">
      <SectionHeading
        eyebrow={stats.eyebrow}
        heading={stats.heading}
        watermark={stats.watermark}
        align="center"
      />
      <div className="mt-16 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {stats.items.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.08}>
            <div className="card-surface flex flex-col items-center py-8 text-center">
              <p className="font-display text-5xl sm:text-6xl">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-muted">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}