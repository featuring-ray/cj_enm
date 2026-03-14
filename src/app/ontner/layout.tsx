"use client";

import { User, CalendarDays, BarChart3, Users } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { OntnerSidebar, type OntnerNavGroup } from "@/components/layout/ontner-sidebar";
import type { SessionUser } from "@/types/user";

const navGroups: OntnerNavGroup[] = [
  {
    label: "마이페이지",
    icon: User,
    defaultOpen: true,
    items: [
      { label: "프로필 관리", href: "/ontner/mypage" },
    ],
  },
  {
    label: "캠페인",
    icon: CalendarDays,
    items: [
      { label: "탐색/추천", href: "/ontner/campaign/explore" },
      { label: "콘텐츠 탐색", href: "/ontner/campaign/content" },
      { label: "역제안", href: "/ontner/campaign/counter-proposal" },
    ],
  },
  {
    label: "크리에이터",
    icon: Users,
    items: [
      { label: "크루찾기", href: "/ontner/crew-finder" },
      { label: "관심 크리에이터", href: "/ontner/creators/bookmarks" },
    ],
  },
  {
    label: "성과",
    icon: BarChart3,
    items: [
      { label: "캠페인별 성과조회", href: "/ontner/performance" },
      { label: "인사이트 리포트 (캠페인)", href: "/ontner/insight/campaign" },
      { label: "인사이트 리포트 (어필리에이트)", href: "/ontner/insight/affiliate" },
    ],
  },
];

const mockUser: SessionUser = {
  id: "creator-1",
  email: "tomato422@naver.com",
  name: "tomato422",
  role: "CREATOR",
};

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="ontner-portal !bg-gray-50">
      <OntnerSidebar navGroups={navGroups} user={mockUser} />
      <main className="flex-1 min-h-screen bg-white overflow-y-auto">
        {children}
      </main>
    </SidebarProvider>
  );
}
