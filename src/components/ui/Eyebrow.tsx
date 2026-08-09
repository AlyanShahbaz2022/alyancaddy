import { cn } from "@/lib/utils";

type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.25em] text-accent",
        className
      )}
    >
      <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(230,57,70,0.9)]" />
      {children}
    </span>
  );
}
