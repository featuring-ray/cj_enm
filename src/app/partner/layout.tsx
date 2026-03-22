"use client";

import {
  Users,
  BarChart3,
  Star,
  Sparkles,
  Bookmark,
} from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PortalSidebar, type NavGroup } from "@/components/layout/portal-sidebar";
import type { SessionUser } from "@/types/user";

const navGroups: NavGroup[] = [
  {
    label: "인사이트",
    items: [
      { label: "크리에이터 탐색", href: "/partner/creator", icon: Users },
      { label: "크리에이터 추천", href: "/partner/creator/recommend", icon: Sparkles, badge: "NEW" },
      { label: "관심 크리에이터 관리", href: "/partner/creator/bookmark", icon: Bookmark, badge: "NEW" },
      { label: "인사이트 리포트", href: "/partner/insight", icon: Star },
    ],
  },
  {
    label: "성과 관리",
    items: [
      { label: "캠페인별 성과 조회", href: "/partner/performance", icon: BarChart3 },
    ],
  },
];

const mockUser: SessionUser = {
  id: "partner-1",
  email: "partner@test.com",
  name: "파트너사",
  role: "PARTNER",
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <PortalSidebar
        portalName="파트너 포털"
        portalBadge={mockUser.name}
        navGroups={navGroups}
        user={mockUser}
      />
      <SidebarInset className="flex flex-col min-h-screen">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
