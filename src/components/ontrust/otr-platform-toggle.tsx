"use client";

import { cn } from "@/lib/utils";

interface Platform {
  id: string;
  label: string;
}

interface OtrPlatformToggleProps {
  platforms: Platform[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function OtrPlatformToggle({
  platforms,
  selected,
  onChange,
  className,
}: OtrPlatformToggleProps) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {platforms.map((p) => (
        <button
          key={p.id}
          type="button"
          className={
            selected.includes(p.id)
              ? "otr-platform-active"
              : "otr-platform-inactive"
          }
          onClick={() => toggle(p.id)}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
