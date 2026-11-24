"use client";

import Image from "next/image";
import { useState } from "react";

/** Plat détouré (fond transparent) avec ombre portée, apparition en fondu. */
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
  const [loaded, setLoaded] = useState(false);
  return (
    <span className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative"} block ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        data-loaded={loaded || undefined}
        className="food fade-img object-contain"
      />
    </span>
  );
}
