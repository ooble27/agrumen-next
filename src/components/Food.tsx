import Image from "next/image";

/** Plat détouré (fond transparent) avec ombre portée. */
export function Food({
  src,
  alt,
  sizes = "240px",
  priority,
  className = "",
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <span className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative"} block ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="food object-contain" />
    </span>
  );
}
