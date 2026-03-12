import { cn } from "@/lib/utils";

interface OtrToolbarProps {
  children: React.ReactNode;
  leftContent?: React.ReactNode;
  className?: string;
}

export function OtrToolbar({ children, leftContent, className }: OtrToolbarProps) {
  return (
    <div className={cn("otr-toolbar", className)}>
      {leftContent && <div className="flex items-center gap-2">{leftContent}</div>}
      <div className="otr-toolbar-right">{children}</div>
    </div>
  );
}
