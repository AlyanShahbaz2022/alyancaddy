import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export default function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "card-surface transition-all duration-300",
        hover &&
          "hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-[0_0_40px_rgba(230,57,70,0.22)]",
        className
      )}
    >
      {children}
    </div>
  );
}
