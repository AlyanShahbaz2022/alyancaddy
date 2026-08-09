import { cn } from "@/lib/utils";

type TagPillProps = {
  children: React.ReactNode;
  className?: string;
};

export default function TagPill({ children, className }: TagPillProps) {
  return (
    <span
      className={cn(
        "rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
