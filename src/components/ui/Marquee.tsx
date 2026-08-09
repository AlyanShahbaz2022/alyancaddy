import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  className?: string;
};

export default function Marquee({ items, className }: MarqueeProps) {
  const row = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center whitespace-nowrap"
    >
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="flex items-center font-display text-xl uppercase tracking-wide sm:text-2xl"
        >
          {item}
          <span className="mx-5 text-black/60 sm:mx-8">●</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "group relative flex overflow-hidden bg-accent py-5 text-black",
        className
      )}
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
