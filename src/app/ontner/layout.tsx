"use client";

import { User, CalendarDays, Wallet } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { OntnerSidebar, type OntnerNavGroup } from "@/components/layout/ontner-sidebar";
import type { SessionUser } from "@/types/user";

const navGroups: OntnerNavGroup[] = [
  {
    label: "마이페이지",
    icon: User,
    defaultOpen: true,
    items: [
      { label: "계정 및 계좌 관리", href: "/ontner/mypage/account" },
      { label: "약관/계약 관리", href: "/ontner/mypage/terms" },
      { label: "크리에이터 페이지", href: "/ontner/mypage" },
    ],
  },
  {
    label: "캠페인 탐색/관리",
    icon: CalendarDays,
    items: [
      { label: "탐색/추천", href: "/ontner/campaign/explore" },
      { label: "저장한 캠페인", href: "/ontner/campaign/saved" },
      { label: "협업 관리", href: "/ontner/campaign/collaboration" },
      { label: "역제안", href: "/ontner/campaign/counter-proposal" },
      { label: "크루찾기", href: "/ontner/crew-finder" },
      { label: "콘텐츠", href: "/ontner/content" },
    ],
  },
  {
    label: "정산 관리",
    icon: Wallet,
    items: [
      { label: "성과조회", href: "/ontner/performance" },
      { label: "인사이트 리포트", href: "/ontner/insight/campaign" },
      { label: "제휴 인사이트", href: "/ontner/insight/affiliate" },
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
