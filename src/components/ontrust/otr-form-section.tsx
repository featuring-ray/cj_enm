import { cn } from "@/lib/utils";

interface OtrFormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function OtrFormSection({ title, children, className }: OtrFormSectionProps) {
  return (
    <div className={cn("mb-4", className)}>
      <div className="otr-section-marker">{title}</div>
      {children}
    </div>
  );
}
