import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Briefcase,
  Camera,
  Check,
  ChevronDown,
  Clapperboard,
  Code2,
  Copy,
  Database,
  Globe,
  Layers,
  Lightbulb,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Music,
  Palette,
  PenTool,
  Phone,
  Rocket,
  Send,
  Server,
  Shield,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  User,
  Wand,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { IconName } from "@/types/content";
import {
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
} from "@/components/ui/BrandIcons";

const iconMap: Record<
  Exclude<IconName, "linkedin" | "instagram" | "tiktok">,
  LucideIcon
> = {
  code: Code2,
  smartphone: Smartphone,
  "shopping-bag": ShoppingBag,
  clapperboard: Clapperboard,
  globe: Globe,
  layers: Layers,
  palette: Palette,
  rocket: Rocket,
  server: Server,
  database: Database,
  lightbulb: Lightbulb,
  camera: Camera,
  sparkles: Sparkles,
  zap: Zap,
  mail: Mail,
  "map-pin": MapPin,
  phone: Phone,
  "arrow-up-right": ArrowUpRight,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  check: Check,
  menu: Menu,
  x: X,
  music: Music,
  "message-circle": MessageCircle,
  briefcase: Briefcase,
  user: User,
  "chevron-down": ChevronDown,
  copy: Copy,
  shield: Shield,
  "pen-tool": PenTool,
  wand: Wand,
  send: Send,
  star: Star,
};

type IconProps = {
  name: IconName;
  className?: string;
  size?: number;
};

export default function Icon({ name, className, size = 20 }: IconProps) {
  if (name === "linkedin") {
    return <LinkedinIcon className={className} size={size} />;
  }
  if (name === "instagram") {
    return <InstagramIcon className={className} size={size} />;
  }
  if (name === "tiktok") {
    return <TiktokIcon className={className} size={size} />;
  }
  const Component = iconMap[name];
  return <Component className={className} size={size} />;
}
