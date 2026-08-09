import type { Gradient } from "@/types/content";

export type HighlightSegment = {
  text: string;
  highlighted: boolean;
};

export function splitHighlighted(text: string): HighlightSegment[] {
  return text.split(/\*\*/).map((part, index) => ({
    text: part,
    highlighted: index % 2 === 1,
  }));
}

type GradientStyle = {
  from: string;
  to: string;
  text: string;
};

export const GRADIENTS: Record<Gradient, GradientStyle> = {
  blue: {
    from: "from-blue-600 to-indigo-800",
    to: "to-indigo-800",
    text: "text-blue-300",
  },
  emerald: {
    from: "from-emerald-500 to-green-800",
    to: "to-green-800",
    text: "text-emerald-300",
  },
  purple: {
    from: "from-purple-600 to-fuchsia-800",
    to: "to-fuchsia-800",
    text: "text-purple-300",
  },
  red: {
    from: "from-red-500 to-rose-800",
    to: "to-rose-800",
    text: "text-red-300",
  },
  orange: {
    from: "from-orange-500 to-amber-800",
    to: "to-amber-800",
    text: "text-orange-300",
  },
  cyan: {
    from: "from-cyan-500 to-sky-800",
    to: "to-sky-800",
    text: "text-cyan-300",
  },
};