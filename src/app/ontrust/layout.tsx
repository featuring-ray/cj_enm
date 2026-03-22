"use client";

import {
  OntrustShell,
  type GnbCategory,
} from "@/components/layout/ontrust-shell";
import type { SessionUser } from "@/types/user";

/* ═══════════════════════════════════════════
   GNB 카테고리 → LNB 그룹 → 아이템 구조
   (스크린샷의 상단 GNB + 좌측 LNB 트리 매핑)
   ═══════════════════════════════════════════ */

const gnbCategories: GnbCategory[] = [
  {
    label: "온트너",
    key: "ontner",
    lnbGroups: [
      {
        label: "온트너 사용자 관리",
        items: [
          { label: "온트너 계정 관리", href: "/ontrust/ontner/accounts", disabled: true },
        ],
      },
      {
        label: "크리에이터코드 관리",
        items: [
          { label: "크리에이터 코드 생성 승인", href: "/ontrust/ontner/code-approval", disabled: true },
          { label: "크리에이터 코드 생성/조회", href: "/ontrust/ontner/code-manage", disabled: true },
        ],
      },
      {
        label: "인사이트",
        items: [
          { label: "크리에이터 탐색", href: "/ontrust/creator/search" },
          { label: "캠페인별 성과 조회", href: "/ontrust/performance" },
          { label: "인사이트 리포트", href: "/ontrust/insight" },
          { label: "크리에이터 팔로워 분석", href: "/ontrust/creator/similarity" },
        ],
      },
      {
        label: "캠페인 관리",
        items: [
          { label: "캠페인 등록/조회", href: "/ontrust/campaign/new" },
          { label: "캠페인 리스트", href: "/ontrust/campaign", disabled: true },
          { label: "캠페인가 설정", href: "/ontrust/campaign/pricing", disabled: true },
          { label: "캠페인 링크 생성", href: "/ontrust/campaign/links", disabled: true },
          { label: "참여 신청건 조회", href: "/ontrust/campaign/applications", disabled: true },
          { label: "크리에이터 협업 센터", href: "/ontrust/campaign/collaboration" },
          { label: "컨택 요청 관리", href: "/ontrust/campaign/contact-requests", badge: "NEW" },
          { label: "관심 크리에이터 관리", href: "/ontrust/creator/bookmark" },
          { label: "캠페인샘플 신청/배송", href: "/ontrust/campaign/samples", disabled: true },
          { label: "캠페인샘플 취소/회수/교환", href: "/ontrust/campaign/samples-return", disabled: true },
        ],
      },
      {
        label: "자동 DM 관리",
        items: [
          { label: "자동 DM 관리", href: "/ontrust/dm" },
          { label: "어드민 설정", href: "/ontrust/dm/admin" },
        ],
      },
      {
        label: "정산현황",
        items: [
          { label: "실시간 주문현황", href: "/ontrust/settlement/orders", disabled: true },
          { label: "정산확정현황", href: "/ontrust/settlement/confirmed", disabled: true },
          { label: "상담신청 내역 관리", href: "/ontrust/settlement/consultations", disabled: true },
        ],
      },
      {
        label: "온트너 전자계약",
        items: [
          { label: "계약서 서식 관리", href: "/ontrust/contract/templates", disabled: true },
          { label: "전자계약 현황", href: "/ontrust/contract/status", disabled: true },
          { label: "방송출연계약발송", href: "/ontrust/contract/broadcast", disabled: true },
          { label: "캠페인 계약발송", href: "/ontrust/contract/campaign", disabled: true },
        ],
      },
    ],
  },
  {
    label: "고객",
    key: "customer",
    lnbGroups: [
      {
        label: "회원관리",
        items: [
          { label: "회원관리", href: "/ontrust/customer/members", disabled: true },
          { label: "임직원관리", href: "/ontrust/customer/employees", disabled: true },
          { label: "회원등급관리", href: "/ontrust/customer/grades", disabled: true },
          { label: "회원차단관리", href: "/ontrust/customer/blocked", disabled: true },
        ],
      },
      {
        label: "회원분석",
        items: [
          { label: "회원데이터집계", href: "/ontrust/customer/analytics", disabled: true },
          { label: "고객대상관리", href: "/ontrust/customer/targets", disabled: true },
        ],
      },
      {
        label: "고객지원",
        items: [
          { label: "고객센터", href: "/ontrust/customer/support", disabled: true },
          { label: "회원통합관리", href: "/ontrust/customer/unified", disabled: true },
        ],
      },
    ],
  },
  {
    label: "상품",
    key: "product",
    lnbGroups: [
      {
        label: "상품관리",
        items: [
          { label: "기준정보관리", href: "/ontrust/product/master", disabled: true },
          { label: "상품관리", href: "/ontrust/product/manage", disabled: true },
          { label: "오프라인 관리", href: "/ontrust/product/offline", disabled: true },
        ],
      },
      {
        label: "협력사/제휴",
        items: [
          { label: "협력사관리", href: "/ontrust/product/partners" },
          { label: "대형제휴", href: "/ontrust/product/alliance", disabled: true },
          { label: "대형제휴 2.0", href: "/ontrust/product/alliance-v2", disabled: true },
        ],
      },
      {
        label: "시스템",
        items: [
          { label: "시스템운영", href: "/ontrust/product/system", disabled: true },
        ],
      },
    ],
  },
  {
    label: "파트너관리",
    key: "partners",
    lnbGroups: [
      {
        label: "파트너 서비스",
        items: [
          { label: "서비스 목록관리", href: "/ontrust/partners/api-services" },
        ],
      },
    ],
  },
  {
    label: "설정",
    key: "settings",
    lnbGroups: [
      {
        label: "시스템 설정",
        items: [
          { label: "피처링 계정 연계", href: "/ontrust/settings" },
        ],
      },
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
    <OntrustShell gnbCategories={gnbCategories} user={mockUser}>
      {children}
    </OntrustShell>
  );
}
