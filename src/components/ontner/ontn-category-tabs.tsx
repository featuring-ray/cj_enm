"use client";

import { cn } from "@/lib/utils";

interface OntnCategoryTabsProps {
  categories: string[];
  value: string;
  onChange: (category: string) => void;
  className?: string;
}

export function OntnCategoryTabs({
  categories,
  value,
  onChange,
  className,
}: OntnCategoryTabsProps) {
  return (
    <div
      className={cn(
        "flex overflow-x-auto border-b border-gray-200 gap-0",
        className
      )}
    >
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            "ontn-category-tab",
            value === cat && "ontn-category-tab-active"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
