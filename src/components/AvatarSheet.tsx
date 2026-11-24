"use client";

import { useRef, useState } from "react";
import { Camera, ImagePlus, Trash2 } from "lucide-react";
import { Sheet } from "./Sheet";
import { Avatar, photoToDataUrl } from "./Avatar";
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
    <Sheet open={open} onClose={onClose} title="Ta photo">
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
