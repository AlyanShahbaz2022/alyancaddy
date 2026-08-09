import Image from "next/image";
import type { ImageProps } from "next/image";

type SiteImageProps = Omit<ImageProps, "alt"> & { alt: string };

export default function SiteImage({ alt, ...props }: SiteImageProps) {
  const isSvg =
    typeof props.src === "string" && props.src.toLowerCase().endsWith(".svg");
  return (
    <Image alt={alt} {...props} unoptimized={props.unoptimized ?? isSvg} />
  );
}
