import { Check } from "lucide-react";

export function Radio({ checked }: { checked: boolean }) {
  return (
    <span
      className={`grid size-6 shrink-0 place-items-center rounded-full border-[1.5px] transition ${checked ? "border-ink" : "border-faint"}`}
    >
      <span className={`size-3 rounded-full bg-ink transition ${checked ? "scale-100" : "scale-0"}`} />
    </span>
  );
}

export function Checkbox({ checked, invalid }: { checked: boolean; invalid?: boolean }) {
  return (
    <span
      className={`grid size-6 shrink-0 place-items-center rounded-md border-[1.5px] transition ${
        checked ? "border-brand bg-brand text-white" : invalid ? "border-[#ff5a5a]" : "border-faint"
      }`}
    >
      {checked && <Check className="size-4" strokeWidth={3} />}
    </span>
  );
}
