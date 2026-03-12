import { cn } from "@/lib/utils";

interface OtrSearchPanelProps {
  children: React.ReactNode;
  onSearch?: () => void;
  onReset?: () => void;
  className?: string;
}

export function OtrSearchPanel({
  children,
  onSearch,
  onReset,
  className,
}: OtrSearchPanelProps) {
  return (
    <div className={cn("otr-search-panel", className)}>
      {children}
      {(onSearch || onReset) && (
        <div className="flex items-center justify-end gap-2 mt-3">
          {onReset && (
            <button type="button" className="otr-btn-secondary" onClick={onReset}>
              초기화
            </button>
          )}
          {onSearch && (
            <button type="button" className="otr-btn-primary" onClick={onSearch}>
              조회
            </button>
          )}
        </div>
      )}
    </div>
  );
}
