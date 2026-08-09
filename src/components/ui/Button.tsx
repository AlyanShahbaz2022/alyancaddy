"use client";

import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "filled" | "outline";
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
  external?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function Button({
  children,
  href,
  variant = "filled",
  size = "md",
  className,
  onClick,
  external,
  type = "button",
  disabled,
}: ButtonProps) {
  const classes = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-wider transition-all duration-300",
    variant === "filled" &&
      "bg-accent text-black hover:bg-accentDark hover:shadow-[0_0_30px_rgba(230,57,70,0.45)]",
    variant === "outline" &&
      "border border-white/25 text-white hover:border-accent hover:text-accent",
    size === "md" && "px-6 py-3 text-sm",
    size === "lg" && "px-8 py-4 text-base",
    disabled && "pointer-events-none opacity-50",
    className
  );

  const inner = (
    <>
      {children}
      <ArrowUpRight
        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        size={18}
      />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {inner}
    </button>
  );
}
