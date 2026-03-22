"use client";

import { Badge } from "@/components/ui/badge";
import type { AutomationStatus } from "@/types/auto-dm";

const statusConfig: Record<
  AutomationStatus,
  { label: string; className: string }
> = {
  초안: {
    label: "초안",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  "실행 중": {
    label: "실행 중",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  중단됨: {
    label: "중단됨",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

export function AutomationStatusBadge({
  status,
}: {
  status: AutomationStatus;
}) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
