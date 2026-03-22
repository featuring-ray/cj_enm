"use client";

import {
  User,
  CalendarDays,
  Wallet,
  BarChart3,
  Users,
  Handshake,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { OntnerSidebar, type OntnerNavGroup } from "@/components/layout/ontner-sidebar";
import type { SessionUser } from "@/types/user";

const navGroups: OntnerNavGroup[] = [
  {
    label: "크리에이터 (마이페이지)",
    icon: User,
    items: [
      { label: "계정 및 계좌관리", href: "/ontner/mypage/account", disabled: true },
      { label: "약관/계약 관리", href: "/ontner/mypage/terms", disabled: true },
      { label: "크리에이터 페이지", href: "/ontner/mypage", disabled: true },
    ],
  },
  {
    label: "캠페인 탐색/관리",
    icon: CalendarDays,
    defaultOpen: true,
    items: [
      { label: "캠페인 탐색/추천", href: "/ontner/campaign/explore" },
      { label: "캠페인 찜 리스트", href: "/ontner/campaign/saved", disabled: true },
      { label: "캠페인 협업 관리", href: "/ontner/campaign/collaboration", disabled: true },
      { label: "참여 캠페인 리스트", href: "/ontner/campaign/participating", disabled: true },
      { label: "참여 캠페인 현황 분석", href: "/ontner/campaign/analysis", badge: "NEW" },
      { label: "샘플 신청내역", href: "/ontner/campaign/samples", disabled: true },
      { label: "댓글 자동 DM", href: "/ontner/dm/auto", badge: "NEW" },
    ],
  },
  {
    label: "정산 관리",
    icon: Wallet,
    items: [
      { label: "실시간 주문현황", href: "/ontner/settlement/orders", disabled: true },
      { label: "지급확정 조회", href: "/ontner/settlement/payment", disabled: true },
      { label: "정산확정 조회", href: "/ontner/settlement/confirmed", disabled: true },
    ],
  },
  {
    label: "캠페인 협업라운지",
    icon: Handshake,
    items: [
      { label: "캠페인 협업라운지", href: "/ontner/collaboration-lounge", disabled: true },
    ],
  },
  {
    label: "성과 조회",
    icon: BarChart3,
    items: [
      { label: "캠페인별 성과 조회", href: "/ontner/performance" },
    ],
  },
  {
    label: "크루찾기",
    icon: Users,
    items: [
      { label: "팔로워 유사도 분석", href: "/ontner/crew-finder" },
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
  const router = useRouter();

  return (
    <SidebarProvider className="ontner-portal !bg-gray-50">
      <OntnerSidebar
        navGroups={navGroups}
        user={mockUser}
        onLogout={() => router.push("/")}
      />
      <main className="flex-1 min-h-screen bg-white overflow-y-auto">
        {children}
      </main>
    </SidebarProvider>
  );
}
