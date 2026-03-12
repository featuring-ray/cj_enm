import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, actions, action }: PageHeaderProps) {
  const rightContent = actions ?? action;
  return (
    <header data-slot="page-header" className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <div className="flex flex-1 items-center gap-2 min-w-0">
        <div className="min-w-0">
          <h1 className="text-sm font-semibold truncate">{title}</h1>
          {description && (
            <p className="text-xs text-muted-foreground truncate">{description}</p>
          )}
        </div>
        {rightContent && <div className="ml-auto flex items-center gap-2">{rightContent}</div>}
      </div>
    </header>
  );
}
