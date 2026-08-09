import { splitHighlighted } from "@/lib/content";
import { cn } from "@/lib/utils";
import Eyebrow from "@/components/ui/Eyebrow";

type SectionHeadingProps = {
  eyebrow?: string;
  heading?: string;
  watermark?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  heading,
  watermark,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "relative",
        align === "center" && "flex flex-col items-center text-center",
        className
      )}
    >
      {watermark ? (
        <span
          aria-hidden
          className={cn(
            "text-watermark pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[clamp(4rem,16vw,13rem)] sm:-top-14",
            align === "left" && "left-0 -translate-x-0"
          )}
        >
          {watermark}
        </span>
      ) : null}
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {heading ? (
        <h2 className="relative mt-4 font-display text-4xl uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
          {splitHighlighted(heading).map((segment, index) =>
            segment.highlighted ? (
              <span key={index} className="text-accent">
                {segment.text}
              </span>
            ) : (
              segment.text
            )
          )}
        </h2>
      ) : null}
    </div>
  );
}
