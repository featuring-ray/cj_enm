"use client";

interface OtrRangeInputProps {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

export function OtrRangeInput({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder = "최소",
  maxPlaceholder = "최대",
}: OtrRangeInputProps) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        placeholder={minPlaceholder}
        className="flex-1 min-w-0 px-2"
        value={minValue}
        onChange={(e) => onMinChange(e.target.value)}
      />
      <span className="text-muted-foreground text-xs shrink-0">~</span>
      <input
        type="number"
        placeholder={maxPlaceholder}
        className="flex-1 min-w-0 px-2"
        value={maxValue}
        onChange={(e) => onMaxChange(e.target.value)}
      />
    </div>
  );
}
