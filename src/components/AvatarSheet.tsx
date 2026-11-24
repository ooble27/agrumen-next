"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Camera, Check, ImagePlus, Trash2 } from "lucide-react";
import { Sheet } from "./Sheet";
import { AVATARS, Avatar, photoToDataUrl } from "./Avatar";
import { haptic } from "@/lib/fx";
import type { Profile } from "@/lib/store";

/** Choisir un avatar dessiné, ou mettre sa photo (galerie ou appareil photo). */
export function AvatarSheet({
  open,
  onClose,
  profile,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  profile: Profile;
  onChange: (avatar: string | undefined) => void;
}) {
  const gallery = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const pick = async (file?: File) => {
    if (!file) return;
    try {
      onChange(await photoToDataUrl(file));
      haptic();
      onClose();
    } catch {
      setError("Impossible de lire cette image, essaie une autre.");
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Ton avatar">
      <div className="flex justify-center py-2">
        <Avatar profile={profile} className="size-24 text-[28px] ring-4 ring-surface" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => gallery.current?.click()} className="flex h-12 items-center justify-center gap-2 rounded-full bg-surface text-[15px] font-medium transition active:scale-95">
          <ImagePlus className="size-[18px]" strokeWidth={1.8} /> Ma photo
        </button>
        <button type="button" onClick={() => camera.current?.click()} className="flex h-12 items-center justify-center gap-2 rounded-full bg-surface text-[15px] font-medium transition active:scale-95">
          <Camera className="size-[18px]" strokeWidth={1.8} /> Prendre
        </button>
      </div>
      <input ref={gallery} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      <input ref={camera} type="file" accept="image/*" capture="user" hidden onChange={(e) => pick(e.target.files?.[0])} />
      {error && <p className="mt-2 text-center text-[13px] text-[#ff5a5a]">{error}</p>}

      <p className="mb-3 mt-6 px-1 text-[13px] font-semibold uppercase tracking-wider text-muted">Ou choisis un perso</p>
      <div className="grid grid-cols-4 gap-3 pb-2">
        {AVATARS.map((id) => {
          const on = profile.avatar === id;
          return (
            <button
              key={id}
              type="button"
              aria-label={`Avatar ${Number(id.slice(4))}`}
              aria-pressed={on}
              onClick={() => {
                haptic(8);
                onChange(id);
                onClose();
              }}
              className={`relative aspect-square rounded-full transition active:scale-90 ${on ? "ring-[3px] ring-orange ring-offset-2 ring-offset-bg" : ""}`}
            >
              <Image src={`/avatars/${id}.svg`} alt="" fill unoptimized className="rounded-full object-cover" />
              {on && (
                <span className="absolute -bottom-0.5 -right-0.5 grid size-6 place-items-center rounded-full bg-orange text-white ring-2 ring-bg">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {profile.avatar && (
        <button
          type="button"
          onClick={() => {
            onChange(undefined);
            onClose();
          }}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full text-[14px] text-[#e04545]"
        >
          <Trash2 className="size-4" /> Retirer
        </button>
      )}
    </Sheet>
  );
}
