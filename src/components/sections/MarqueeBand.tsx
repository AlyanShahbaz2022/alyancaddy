import Marquee from "@/components/ui/Marquee";

type MarqueeBandProps = {
  items: string[];
};

export default function MarqueeBand({ items }: MarqueeBandProps) {
  return <Marquee items={items} className="my-6 md:my-10" />;
}