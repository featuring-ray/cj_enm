"use client";

import {
  LayoutDashboard,
  Compass,
  BarChart2,
  User,
  FileText,
  Users,
  ArrowRightLeft,
  LineChart,
  Sparkles,
  Link2,
} from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PortalSidebar, type NavGroup } from "@/components/layout/portal-sidebar";
import type { SessionUser } from "@/types/user";

const navGroups: NavGroup[] = [
  {
    items: [
      { label: "홈", href: "/ontner/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    items: [
      { label: "마이페이지", href: "/ontner/mypage", icon: User },
    ],
  },
  {
    label: "캠페인",
    items: [
      { label: "탐색/추천", href: "/ontner/campaign/explore", icon: Compass },
      { label: "역제안", href: "/ontner/campaign/counter-proposal", icon: ArrowRightLeft },
      { label: "크루찾기", href: "/ontner/crew-finder", icon: Users },
    ],
  },
  {
    items: [
      { label: "콘텐츠", href: "/ontner/content", icon: FileText },
    ],
  },
  {
    label: "성과",
    items: [
      { label: "성과조회", href: "/ontner/performance", icon: LineChart },
      { label: "인사이트 리포트", href: "/ontner/insight/campaign", icon: Sparkles },
      { label: "제휴 인사이트", href: "/ontner/insight/affiliate", icon: Link2 },
    ],
  },
];

const mockUser: SessionUser = {
  id: "creator-1",
  email: "creator@test.com",
  name: "크리에이터",
  role: "CREATOR",
};

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <PortalSidebar
        portalName="온트너"
        portalBadge="크리에이터 포털"
        navGroups={navGroups}
        user={mockUser}
      />
      <SidebarInset className="flex flex-col min-h-screen">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
