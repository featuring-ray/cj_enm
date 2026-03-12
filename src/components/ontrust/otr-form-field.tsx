import { cn } from "@/lib/utils";

interface OtrFormFieldProps {
  label: string;
  required?: boolean;
  /** Number of extra value columns to span (2 = span across next label+value pair) */
  span?: 2 | 3 | "full";
  children: React.ReactNode;
  className?: string;
}

const spanClass: Record<string, string> = {
  "2": "otr-form-value-span-2",
  "3": "otr-form-value-span-3",
  full: "otr-form-value-full",
};

export function OtrFormField({
  label,
  required = false,
  span,
  children,
  className,
}: OtrFormFieldProps) {
  return (
    <>
      <div className={cn("otr-form-label", required && "otr-required")}>
        {label}
      </div>
      <div
        className={cn(
          "otr-form-value",
          span && spanClass[String(span)],
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
