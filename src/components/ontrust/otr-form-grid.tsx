import { cn } from "@/lib/utils";

interface OtrFormGridProps {
  columns?: 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}

const colClass: Record<number, string> = {
  2: "otr-form-grid-2col",
  3: "otr-form-grid-3col",
  4: "otr-form-grid-4col",
};

export function OtrFormGrid({ columns = 2, children, className }: OtrFormGridProps) {
  return (
    <div className={cn("otr-form-grid", colClass[columns], className)}>
      {children}
    </div>
  );
}
