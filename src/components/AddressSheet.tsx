"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, LocateFixed, MapPin, Search, X } from "lucide-react";
import { Sheet } from "./Sheet";
import { MapView } from "./MapView";
import { SITE } from "@/lib/site";
import { distanceKm, reversePlace, searchPlaces, type Place } from "@/lib/geo";
import type { Profile } from "@/lib/store";

export type AddressPatch = Pick<Profile, "address" | "address2" | "area" | "city" | "lat" | "lon">;

/** Choisir son adresse : recherche, position actuelle, pin ajustable sur une vraie carte. */
export function AddressSheet({
  open,
  onClose,
  value,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  value: Partial<Profile>;
  onConfirm: (patch: AddressPatch) => void;
}) {
  return (
    <Sheet open={open} onClose={onClose} title="Adresse de livraison">
      {open && <AddressPicker value={value} onConfirm={(p) => (onConfirm(p), onClose())} />}
    </Sheet>
  );
}

function initialPlace(v: Partial<Profile>): Place | null {
  if (v.lat == null || v.lon == null || !v.address) return null;
  return { label: v.address, detail: [v.city, v.area].filter(Boolean).join(", "), street: v.address, city: v.city ?? "", postcode: v.area ?? "", lat: v.lat, lon: v.lon };
}

function AddressPicker({ value, onConfirm }: { value: Partial<Profile>; onConfirm: (p: AddressPatch) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [place, setPlace] = useState<Place | null>(() => initialPlace(value));
  const [address2, setAddress2] = useState(value.address2 ?? "");
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (q.trim().length < 3) return;
    const ac = new AbortController();
    const t = window.setTimeout(() => {
      setSearching(true);
      searchPlaces(q.trim(), ac.signal)
        .then((r) => setResults(r))
        .catch(() => {})
        .finally(() => setSearching(false));
    }, 300);
    return () => {
      window.clearTimeout(t);
      ac.abort();
    };
  }, [q]);

  const showResults = q.trim().length >= 3;
  const km = place ? distanceKm(SITE.store, place) : 0;
  const ok = place ? km <= SITE.deliveryRadiusKm : false;

  const locate = () => {
    if (!navigator.geolocation) return setError("La localisation n’est pas disponible sur cet appareil.");
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const p = await reversePlace(pos.coords.latitude, pos.coords.longitude).catch(() => null);
        setLocating(false);
        if (p) {
          setPlace(p);
          setQ("");
        } else setError("Adresse introuvable à cet endroit. Cherche-la plutôt.");
      },
      () => {
        setLocating(false);
        setError("Autorise la localisation, ou cherche ton adresse.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const moveTo = async (lat: number, lon: number) => {
    const p = await reversePlace(lat, lon).catch(() => null);
    setPlace((cur) => (p ? p : cur ? { ...cur, lat, lon } : cur));
  };

  return (
    <div className="pb-2">
      {/* Recherche */}
      <label className="flex h-14 items-center gap-3 rounded-full bg-surface pl-5 pr-2 focus-within:ring-2 focus-within:ring-brand/40">
        <Search className="size-5 shrink-0 text-ink/70" strokeWidth={1.7} />
        <input
          autoFocus={!place}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Numéro et rue, ex. 1234 rue Saint-Denis"
          className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
          enterKeyHint="search"
        />
        {searching ? (
          <Loader2 className="mr-3 size-4 animate-spin text-muted" />
        ) : q ? (
          <button type="button" aria-label="Effacer" onClick={() => setQ("")} className="grid size-10 place-items-center text-muted">
            <X className="size-4" />
          </button>
        ) : null}
      </label>

      <button
        type="button"
        onClick={locate}
        className="mt-2 flex h-12 w-full items-center gap-3 rounded-2xl px-3 text-left text-[15px] font-medium text-brand-strong transition active:bg-surface dark:text-brand"
      >
        {locating ? <Loader2 className="size-5 animate-spin" /> : <LocateFixed className="size-5" strokeWidth={1.8} />}
        Utiliser ma position actuelle
      </button>
      {error && <p className="px-3 text-[13px] text-[#ff5a5a]">{error}</p>}

      {showResults ? (
        <ul className="mt-1 divide-y divide-line">
          {results.length === 0 && !searching && <li className="px-3 py-4 text-[14px] text-muted">Aucune adresse trouvée.</li>}
          {results.map((r) => (
            <li key={`${r.lat},${r.lon}`}>
              <button
                type="button"
                onClick={() => {
                  const num = q.trim().match(/^(\d+[a-zA-Z]?)\b/)?.[1];
                  const hasNum = /^\d/.test(r.label);
                  const chosen = num && !hasNum ? { ...r, label: `${num} ${r.street}`, street: `${num} ${r.street}` } : r;
                  setPlace(chosen);
                  setQ("");
                  setResults([]);
                  // numéro tapé mais rue sans numéro : on cherche le point exact
                  if (num && !hasNum) {
                    searchPlaces(`${num} ${r.street}, ${r.city}`)
                      .then((found) => {
                        const exact = found.find((f) => f.label.startsWith(`${num} `) && f.city === r.city);
                        if (exact) setPlace(exact);
                      })
                      .catch(() => {});
                  }
                }}
                className="flex w-full items-center gap-3 px-3 py-3 text-left transition active:bg-surface"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface">
                  <MapPin className="size-[18px]" strokeWidth={1.7} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-medium">{r.label}</span>
                  <span className="block truncate text-[13px] text-muted">{r.detail}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : place ? (
        <div className="mt-2">
          <MapView lat={place.lat} lon={place.lon} onMove={moveTo} zone className="h-56 rounded-[22px]" />
          <p className="mt-2 px-1 text-[12px] text-muted">Touche ou glisse le pin pour ajuster l’emplacement exact.</p>

          <div className="mt-4 flex items-start gap-3 px-1">
            <MapPin className="mt-0.5 size-5 shrink-0" strokeWidth={1.7} />
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-tight">{place.label}</p>
              <p className="text-[14px] text-muted">{place.detail}</p>
            </div>
          </div>
          <p
            className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium ${
              ok ? "bg-brand/15 text-brand-strong dark:text-brand" : "bg-[#ff5a5a]/15 text-[#e04545]"
            }`}
          >
            {ok ? <Check className="size-4" strokeWidth={2.4} /> : <X className="size-4" strokeWidth={2.4} />}
            {ok ? `On livre ici · ${km.toFixed(1).replace(".", ",")} km` : `Hors zone : on livre jusqu’à ${SITE.deliveryRadiusKm} km`}
          </p>

          <input
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            placeholder="App., étage, code de porte (facultatif)"
            className="field mt-4"
          />
          <button
            type="button"
            disabled={!ok}
            onClick={() =>
              onConfirm({ address: place.label, address2: address2.trim(), area: place.postcode, city: place.city, lat: place.lat, lon: place.lon })
            }
            className="mt-4 flex h-14 w-full items-center justify-center rounded-full bg-[#151515] text-[16px] font-medium text-white transition active:scale-[0.98] disabled:opacity-40 dark:bg-white dark:text-[#151515]"
          >
            Confirmer l’adresse
          </button>
        </div>
      ) : (
        <p className="mt-4 px-3 text-[14px] text-muted">On livre dans un rayon de {SITE.deliveryRadiusKm} km autour de {SITE.city}.</p>
      )}
    </div>
  );
}
