import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded-lg bg-[linear-gradient(90deg,#161616_0%,#232323_50%,#161616_100%)] bg-[length:400px_100%] bg-repeat",
        className
      )}
    />
  );
}
