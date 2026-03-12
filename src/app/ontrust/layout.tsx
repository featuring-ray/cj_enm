"use client";

import {
  Users,
  Megaphone,
  BarChart3,
  Send,
  Settings,
  Star,
  FileText,
  Sparkles,
  Bookmark,
} from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PortalSidebar, type NavGroup } from "@/components/layout/portal-sidebar";
import type { SessionUser } from "@/types/user";

const navGroups: NavGroup[] = [
  {
    label: "크리에이터 관리",
    items: [
      { label: "탐색", href: "/ontrust/creator/search", icon: Users },
      { label: "추천", href: "/ontrust/creator/recommend", icon: Sparkles },
      { label: "콘텐츠 탐색", href: "/ontrust/creator/content", icon: FileText },
      { label: "북마크 관리", href: "/ontrust/creator/bookmark", icon: Bookmark },
    ],
  },
  {
    label: "캠페인 관리",
    items: [
      { label: "캠페인 등록", href: "/ontrust/campaign/new", icon: Megaphone },
      { label: "제안 관리", href: "/ontrust/campaign", icon: Megaphone },
      { label: "협업 관리", href: "/ontrust/campaign/collaboration", icon: Users },
    ],
  },
  {
    items: [
      { label: "DM 발송", href: "/ontrust/dm", icon: Send },
    ],
  },
  {
    label: "성과조회",
    items: [
      { label: "캠페인별 성과", href: "/ontrust/performance", icon: BarChart3 },
      { label: "인사이트 리포트", href: "/ontrust/insight", icon: Star },
    ],
  },
  {
    label: "설정",
    items: [
      { label: "피처링 계정 연계", href: "/ontrust/settings", icon: Settings },
    ],
  },
];

const mockUser: SessionUser = {
  id: "admin-1",
  email: "admin@cjenm.com",
  name: "관리자",
  role: "ADMIN",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="ontrust-portal">
      <PortalSidebar
        portalName="온트러스트"
        portalBadge="관리자 포털"
        navGroups={navGroups}
        user={mockUser}
      />
      <SidebarInset className="flex flex-col min-h-screen">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
