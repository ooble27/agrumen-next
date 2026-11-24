"use client";

import Image from "next/image";
import { User } from "lucide-react";
import type { Profile } from "@/lib/store";

export const AVATARS = Array.from({ length: 12 }, (_, i) => `a${i + 1}`);

export function avatarSrc(id?: string) {
  if (!id) return null;
  if (id.startsWith("data:")) return id;
  return AVATARS.includes(id) ? `/avatars/${id}.svg` : null;
}

/** Photo, avatar dessiné, ou initiales : ce qui représente la personne. */
export function Avatar({ profile, className = "size-12" }: { profile: Partial<Profile>; className?: string }) {
  const src = avatarSrc(profile.avatar);
  const initials = (profile.name ?? "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-orange text-white ${className}`}>
      {src ? (
        <>
          <Image src={src} alt="" fill unoptimized sizes="96px" className="object-cover" />
          {/* initiales sur les dégradés (pas sur une photo) */}
          {!profile.avatar?.startsWith("data:") && initials && (
            <span className="relative text-[0.95em] font-semibold tracking-tight [text-shadow:0_1px_6px_rgba(0,0,0,.2)]">{initials}</span>
          )}
        </>
      ) : initials ? (
        <span className="text-[0.95em] font-bold">{initials}</span>
      ) : (
        <User className="size-1/2" strokeWidth={1.8} />
      )}
    </span>
  );
}

/** Photo choisie -> carré 256 px recadré au centre, en JPEG (léger pour le stockage local). */
export function photoToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const size = 256;
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const ctx = c.getContext("2d");
      if (!ctx) return reject(new Error("canvas"));
      ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("image"));
    img.src = url;
  });
}
