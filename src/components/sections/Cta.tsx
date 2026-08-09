import type { Content } from "@/types/content";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

type CtaProps = {
  cta: Content["cta"];
};

export default function Cta({ cta }: CtaProps) {
  return (
    <Section id="cta" className="text-center">
      <Reveal>
        <SectionHeading
          eyebrow={cta.eyebrow}
          heading={cta.heading}
          align="center"
        />
        <p className="mx-auto mt-6 max-w-md text-sm text-muted sm:text-base">
          {cta.description}
        </p>
        <div className="mt-9">
          <Button href={cta.button.href} size="lg">
            {cta.button.label}
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}