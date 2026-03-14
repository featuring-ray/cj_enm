"use client";

import {
  Users,
  BarChart3,
  Send,
  Settings,
  Star,
  FileText,
  Sparkles,
  Bookmark,
  GitCompare,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PortalSidebar, type NavGroup } from "@/components/layout/portal-sidebar";
import type { SessionUser } from "@/types/user";

const navGroups: NavGroup[] = [
  {
    label: "캠페인 탐색 관리",
    items: [
      { label: "크리에이터 탐색", href: "/ontrust/creator/search", icon: Users },
      { label: "크리에이터 추천", href: "/ontrust/creator/recommend", icon: Sparkles },
      { label: "콘텐츠 탐색", href: "/ontrust/creator/content", icon: FileText },
      { label: "관심 크리에이터 관리", href: "/ontrust/creator/bookmark", icon: Bookmark },
      { label: "팔로워 유사도 분석", href: "/ontrust/creator/similarity", icon: GitCompare },
    ],
  },
  {
    label: "DM 관리",
    items: [
      { label: "DM 발송 내역", href: "/ontrust/dm", icon: Send },
      { label: "DM 통합 대시보드", href: "/ontrust/dm/dashboard", icon: LayoutDashboard },
      { label: "DM 템플릿 관리", href: "/ontrust/dm/templates", icon: ClipboardList },
    ],
  },
  {
    label: "성과 관리",
    items: [
      { label: "캠페인 종합 성과 조회", href: "/ontrust/performance", icon: BarChart3 },
      { label: "캠페인별 성과조회", href: "/ontrust/performance/by-campaign", icon: BarChart3 },
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
