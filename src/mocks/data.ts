import type { Creator } from "@/types/creator";
import type { Campaign, CampaignMetrics } from "@/types/campaign";
import type {
  TrackingData,
  DashboardSummary,
  PerformanceTrend,
  MonthlyRevenue,
  CampaignInflowAnalysis,
} from "@/types/analytics";

// =====================
// Mock 크리에이터 데이터
// =====================

export const mockCreators: Creator[] = [
  {
    id: "creator-1",
    username: "beauty_hana",
    displayName: "뷰티하나",
    profileImage: "",
    platform: "instagram",
    followerCount: 125000,
    averageLikes: 4500,
    averageComments: 320,
    averageShares: 150,
    averageViews: 45000,
    engagementRate: 4.2,
    score: 88,
    categories: ["뷰티", "스킨케어"],
    brands: [
      {
        brandId: "brand-1",
        brandName: "올리브영",
        campaignCount: 5,
        isPrimary: true,
      },
    ],
    isOntnerMember: true,
    isCommerceAccount: true,
    isOfficialAccount: false,
    isCelebrity: false,
    avgUnitPrice: 35000,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2025-03-01"),
  },
  {
    id: "creator-2",
    username: "foodie_jin",
    displayName: "맛있는진",
    profileImage: "",
    platform: "instagram",
    followerCount: 89000,
    averageLikes: 3200,
    averageComments: 450,
    averageShares: 280,
    averageViews: 38000,
    engagementRate: 5.1,
    score: 82,
    categories: ["푸드", "리빙"],
    brands: [
      {
        brandId: "brand-2",
        brandName: "CJ제일제당",
        campaignCount: 3,
        isPrimary: true,
      },
    ],
    isOntnerMember: true,
    isCommerceAccount: true,
    isOfficialAccount: false,
    isCelebrity: false,
    avgUnitPrice: 25000,
    createdAt: new Date("2024-03-20"),
    updatedAt: new Date("2025-02-28"),
  },
  {
    id: "creator-3",
    username: "style_mina",
    displayName: "스타일미나",
    profileImage: "",
    platform: "instagram",
    followerCount: 210000,
    averageLikes: 8900,
    averageComments: 620,
    averageShares: 340,
    averageViews: 92000,
    engagementRate: 4.8,
    score: 92,
    categories: ["패션", "뷰티"],
    brands: [
      {
        brandId: "brand-3",
        brandName: "무신사",
        campaignCount: 8,
        isPrimary: true,
      },
    ],
    isOntnerMember: true,
    isCommerceAccount: true,
    isOfficialAccount: false,
    isCelebrity: false,
    avgUnitPrice: 55000,
    createdAt: new Date("2023-11-05"),
    updatedAt: new Date("2025-03-01"),
  },
  {
    id: "creator-4",
    username: "tech_review_kr",
    displayName: "테크리뷰",
    profileImage: "",
    platform: "instagram",
    followerCount: 67000,
    averageLikes: 2100,
    averageComments: 380,
    averageShares: 520,
    averageViews: 55000,
    engagementRate: 4.5,
    score: 76,
    categories: ["테크", "가전"],
    brands: [
      {
        brandId: "brand-4",
        brandName: "삼성전자",
        campaignCount: 2,
        isPrimary: true,
      },
    ],
    isOntnerMember: false,
    isCommerceAccount: true,
    isOfficialAccount: false,
    isCelebrity: false,
    avgUnitPrice: 120000,
    createdAt: new Date("2024-06-10"),
    updatedAt: new Date("2025-02-15"),
  },
  {
    id: "creator-5",
    username: "official_cjenm",
    displayName: "CJ ENM 공식",
    profileImage: "",
    platform: "instagram",
    followerCount: 520000,
    averageLikes: 12000,
    averageComments: 850,
    averageShares: 600,
    averageViews: 180000,
    engagementRate: 2.6,
    score: 95,
    categories: ["엔터테인먼트"],
    brands: [],
    isOntnerMember: false,
    isCommerceAccount: false,
    isOfficialAccount: true,
    isCelebrity: false,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2025-03-01"),
  },
  {
    id: "creator-6",
    username: "living_soo",
    displayName: "리빙수",
    profileImage: "",
    platform: "instagram",
    followerCount: 45000,
    averageLikes: 1800,
    averageComments: 210,
    averageShares: 95,
    averageViews: 22000,
    engagementRate: 4.7,
    score: 71,
    categories: ["리빙", "인테리어"],
    brands: [
      {
        brandId: "brand-5",
        brandName: "이케아",
        campaignCount: 2,
        isPrimary: true,
      },
    ],
    isOntnerMember: true,
    isCommerceAccount: true,
    isOfficialAccount: false,
    isCelebrity: false,
    avgUnitPrice: 42000,
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2025-02-20"),
  },
];

// =====================
// Mock 캠페인 데이터
// =====================

export const mockCampaigns: Campaign[] = [
  {
    id: "campaign-1",
    title: "올리브영 봄 신상 공구",
    description: "2025 봄 시즌 신상품 크리에이터 공구 캠페인. 스킨케어 및 색조 제품을 중심으로 진행합니다.",
    brandId: "brand-1",
    brandName: "올리브영",
    category: "뷰티",
    status: "in_progress",
    budget: 15000000,
    unitPrice: 35000,
    startDate: new Date("2025-02-15"),
    endDate: new Date("2025-03-15"),
    creators: [
      {
        creatorId: "creator-1",
        creatorName: "뷰티하나",
        creatorUsername: "beauty_hana",
        status: "accepted",
        proposedAt: new Date("2025-02-10"),
        respondedAt: new Date("2025-02-11"),
      },
      {
        creatorId: "creator-3",
        creatorName: "스타일미나",
        creatorUsername: "style_mina",
        status: "completed",
        proposedAt: new Date("2025-02-10"),
        respondedAt: new Date("2025-02-12"),
      },
    ],
    createdBy: "admin-1",
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-03-01"),
  },
  {
    id: "campaign-2",
    title: "CJ제일제당 간편식 공구",
    description: "비비고 간편식 시리즈 크리에이터 공구",
    brandId: "brand-2",
    brandName: "CJ제일제당",
    category: "푸드",
    status: "in_progress",
    budget: 10000000,
    unitPrice: 25000,
    startDate: new Date("2025-02-20"),
    endDate: new Date("2025-03-20"),
    creators: [
      {
        creatorId: "creator-2",
        creatorName: "맛있는진",
        creatorUsername: "foodie_jin",
        status: "accepted",
        proposedAt: new Date("2025-02-15"),
        respondedAt: new Date("2025-02-16"),
      },
    ],
    createdBy: "admin-1",
    createdAt: new Date("2025-02-10"),
    updatedAt: new Date("2025-02-28"),
  },
  {
    id: "campaign-3",
    title: "무신사 S/S 컬렉션",
    description: "2025 봄여름 패션 크리에이터 협업. 봄/여름 신상 의류를 중심으로 콘텐츠를 제작합니다.",
    brandId: "brand-3",
    brandName: "무신사",
    category: "패션",
    status: "proposed",
    budget: 20000000,
    unitPrice: 55000,
    startDate: new Date("2025-03-10"),
    endDate: new Date("2025-04-10"),
    creators: [
      {
        creatorId: "creator-1",
        creatorName: "뷰티하나",
        creatorUsername: "beauty_hana",
        status: "invited",
        proposedAt: new Date("2025-03-01"),
      },
      {
        creatorId: "creator-3",
        creatorName: "스타일미나",
        creatorUsername: "style_mina",
        status: "invited",
        proposedAt: new Date("2025-03-01"),
      },
    ],
    createdBy: "admin-1",
    createdAt: new Date("2025-02-25"),
    updatedAt: new Date("2025-03-01"),
  },
  {
    id: "campaign-4",
    title: "이니스프리 가을 기획전",
    description: "2024 가을 시즌 제주 원료 신제품 기획전 캠페인",
    brandId: "brand-6",
    brandName: "이니스프리",
    category: "뷰티",
    status: "completed",
    budget: 8000000,
    unitPrice: 30000,
    startDate: new Date("2024-09-01"),
    endDate: new Date("2024-10-01"),
    creators: [
      {
        creatorId: "creator-1",
        creatorName: "뷰티하나",
        creatorUsername: "beauty_hana",
        status: "completed",
        proposedAt: new Date("2024-08-20"),
        respondedAt: new Date("2024-08-22"),
      },
    ],
    createdBy: "admin-1",
    createdAt: new Date("2024-08-10"),
    updatedAt: new Date("2024-10-05"),
  },
  {
    id: "campaign-5",
    title: "올리브영 여름 선케어 공구",
    description: "2025 여름 대비 자외선 차단 제품 크리에이터 공구. 뷰티 카테고리 크리에이터 우선 모집.",
    brandId: "brand-1",
    brandName: "올리브영",
    category: "뷰티",
    status: "proposed",
    budget: 12000000,
    unitPrice: 40000,
    startDate: new Date("2025-04-01"),
    endDate: new Date("2025-05-01"),
    creators: [],
    createdBy: "admin-1",
    createdAt: new Date("2025-03-01"),
    updatedAt: new Date("2025-03-01"),
  },
  {
    id: "campaign-6",
    title: "CJ제일제당 신제품 런칭",
    description: "비비고 신제품 출시 기념 크리에이터 공구 캠페인",
    brandId: "brand-2",
    brandName: "CJ제일제당",
    category: "푸드",
    status: "proposed",
    budget: 9000000,
    unitPrice: 28000,
    startDate: new Date("2025-04-15"),
    endDate: new Date("2025-05-15"),
    creators: [],
    createdBy: "admin-1",
    createdAt: new Date("2025-03-02"),
    updatedAt: new Date("2025-03-02"),
  },
  {
    id: "campaign-7",
    title: "에뛰드 봄 신상 컬렉션",
    description: "에뛰드 봄 시즌 색조 신제품 크리에이터 공구",
    brandId: "brand-7",
    brandName: "에뛰드",
    category: "뷰티",
    status: "proposed",
    budget: 6000000,
    unitPrice: 25000,
    startDate: new Date("2025-03-20"),
    endDate: new Date("2025-04-20"),
    creators: [],
    createdBy: "admin-1",
    createdAt: new Date("2025-03-01"),
    updatedAt: new Date("2025-03-01"),
  },
];

// =====================
// Mock 캠페인 성과 데이터
// =====================

export const mockCampaignMetrics: Record<string, CampaignMetrics> = {
  "campaign-1": {
    views: 245000,
    likes: 18500,
    comments: 2340,
    shares: 890,
    saves: 3200,
    estimatedOrders: 420,
    claimCount: 8,
    estimatedRevenue: 14700000,
    conversionRate: 3.4,
    keywordComments: [
      { keyword: "구매완료", count: 312 },
      { keyword: "알림신청", count: 185 },
      { keyword: "링크", count: 95 },
    ],
    lastUpdatedAt: new Date(),
  },
  "campaign-2": {
    views: 128000,
    likes: 9200,
    comments: 1580,
    shares: 620,
    saves: 1800,
    estimatedOrders: 280,
    claimCount: 3,
    estimatedRevenue: 7000000,
    conversionRate: 2.8,
    keywordComments: [
      { keyword: "구매완료", count: 198 },
      { keyword: "알림신청", count: 120 },
    ],
    lastUpdatedAt: new Date(),
  },
  "campaign-4": {
    views: 98000,
    likes: 7200,
    comments: 980,
    shares: 420,
    saves: 1560,
    estimatedOrders: 210,
    claimCount: 5,
    estimatedRevenue: 6300000,
    conversionRate: 3.1,
    keywordComments: [
      { keyword: "구매완료", count: 168 },
      { keyword: "알림신청", count: 92 },
      { keyword: "재구매", count: 45 },
    ],
    lastUpdatedAt: new Date("2024-10-02"),
  },
};

// =====================
// Mock 트래킹 데이터
// =====================

export const mockTrackingData: TrackingData[] = [
  {
    campaignId: "campaign-1",
    creatorId: "creator-1",
    postUrl: "https://instagram.com/p/example1",
    platform: "instagram",
    contentType: "reels",
    metrics: {
      views: 125000,
      likes: 9500,
      comments: 1200,
      shares: 450,
      saves: 1800,
    },
    keywordComments: [
      { keyword: "구매완료", count: 180 },
      { keyword: "알림신청", count: 95 },
    ],
    collectedAt: new Date(),
  },
  {
    campaignId: "campaign-1",
    creatorId: "creator-3",
    postUrl: "https://instagram.com/p/example2",
    platform: "instagram",
    contentType: "feed",
    metrics: {
      views: 120000,
      likes: 9000,
      comments: 1140,
      shares: 440,
      saves: 1400,
    },
    keywordComments: [
      { keyword: "구매완료", count: 132 },
      { keyword: "알림신청", count: 90 },
    ],
    collectedAt: new Date(),
  },
];

// =====================
// Mock 월별 매출 데이터 (인사이트용)
// =====================

export const mockMonthlyRevenue: MonthlyRevenue[] = [
  { month: "10월", revenue: 3200000, orders: 85 },
  { month: "11월", revenue: 4500000, orders: 118 },
  { month: "12월", revenue: 5800000, orders: 152 },
  { month: "1월", revenue: 6200000, orders: 165 },
  { month: "2월", revenue: 8100000, orders: 210 },
  { month: "3월", revenue: 4700000, orders: 125 },
];

// =====================
// Mock 자동화 규칙 데이터
// =====================

export const mockAutomationRules = [
  {
    id: "auto-1",
    campaignId: "campaign-1",
    campaignTitle: "올리브영 봄 신상 공구",
    keyword: "구매완료",
    dmTemplate: "구매해주셔서 감사합니다! 📦 제품이 마음에 드셨으면 좋겠어요. 추가 혜택은 링크를 확인해주세요!",
    dailyLimit: 50,
    dailySent: 18,
    totalSent: 312,
    isActive: true,
    createdAt: new Date("2025-02-15"),
  },
  {
    id: "auto-2",
    campaignId: "campaign-2",
    campaignTitle: "CJ제일제당 간편식 공구",
    keyword: "알림신청",
    dmTemplate: "알림 신청해주셔서 감사해요! 🍱 재입고 시 바로 연락드릴게요.",
    dailyLimit: 30,
    dailySent: 5,
    totalSent: 120,
    isActive: false,
    createdAt: new Date("2025-02-20"),
  },
];

export const mockAutomationLogs = [
  { id: "log-1", ruleId: "auto-1", campaignTitle: "올리브영 봄 신상 공구", targetUsername: "@user_kim", dmContent: "구매감사", sentAt: new Date("2025-03-03T14:20:00"), status: "success" as const },
  { id: "log-2", ruleId: "auto-1", campaignTitle: "올리브영 봄 신상 공구", targetUsername: "@user_lee", dmContent: "구매감사", sentAt: new Date("2025-03-03T14:15:00"), status: "success" as const },
  { id: "log-3", ruleId: "auto-1", campaignTitle: "올리브영 봄 신상 공구", targetUsername: "@user_park", dmContent: "구매감사", sentAt: new Date("2025-03-03T14:10:00"), status: "failed" as const },
  { id: "log-4", ruleId: "auto-2", campaignTitle: "CJ제일제당 간편식 공구", targetUsername: "@user_choi", dmContent: "알림신청감사", sentAt: new Date("2025-03-03T13:00:00"), status: "success" as const },
  { id: "log-5", ruleId: "auto-1", campaignTitle: "올리브영 봄 신상 공구", targetUsername: "@user_jung", dmContent: "구매감사", sentAt: new Date("2025-03-03T12:30:00"), status: "success" as const },
];

// =====================
// Mock 성과 분석 데이터 (온트러스트)
// =====================

export const mockAnalyticsOverview = {
  totalRevenue: 21700000,
  totalOrders: 700,
  averageConversionRate: 3.1,
  totalViews: 471000,
  revenueChange: 18.5,
  ordersChange: 12.3,
  conversionChange: 0.4,
  viewsChange: 22.1,
};

export const mockMonthlyCategoryRevenue = [
  { month: "10월", 뷰티: 3200000, 패션: 1800000, 푸드: 1200000, 리빙: 500000 },
  { month: "11월", 뷰티: 4500000, 패션: 2200000, 푸드: 1800000, 리빙: 700000 },
  { month: "12월", 뷰티: 5800000, 패션: 3100000, 푸드: 2200000, 리빙: 900000 },
  { month: "1월", 뷰티: 6200000, 패션: 2800000, 푸드: 2500000, 리빙: 800000 },
  { month: "2월", 뷰티: 8100000, 패션: 3500000, 푸드: 2800000, 리빙: 1200000 },
  { month: "3월", 뷰티: 4700000, 패션: 2100000, 푸드: 1600000, 리빙: 600000 },
];

export const mockTopCreators = [
  { rank: 1, creatorId: "creator-3", displayName: "스타일미나", category: "패션/뷰티", revenue: 8900000, conversionRate: 4.8, campaigns: 3 },
  { rank: 2, creatorId: "creator-1", displayName: "뷰티하나", category: "뷰티", revenue: 7400000, conversionRate: 4.2, campaigns: 4 },
  { rank: 3, creatorId: "creator-2", displayName: "맛있는진", category: "푸드", revenue: 5300000, conversionRate: 5.1, campaigns: 2 },
];

// =====================
// Mock 파트너 성과 비교 데이터
// =====================

export const mockPartnerAnalytics = {
  totalRevenue: 14700000,
  totalOrders: 420,
  conversionRate: 3.4,
  avgOrderValue: 35000,
  revenueChange: 12.5,
  ordersChange: 8.2,
};

export const mockPartnerMonthlyRevenue = [
  { month: "10월", revenue: 2100000, orders: 58 },
  { month: "11월", revenue: 3200000, orders: 88 },
  { month: "12월", revenue: 4100000, orders: 112 },
  { month: "1월", revenue: 4800000, orders: 130 },
  { month: "2월", revenue: 6500000, orders: 178 },
  { month: "3월", revenue: 3500000, orders: 95 },
];

export const mockCategoryComparison = [
  { category: "뷰티", myRevenue: 14700000, avgRevenue: 9200000, myConversion: 3.4, avgConversion: 2.8 },
  { category: "스킨케어", myRevenue: 8200000, avgRevenue: 6100000, myConversion: 3.1, avgConversion: 2.5 },
  { category: "색조", myRevenue: 6500000, avgRevenue: 3100000, myConversion: 3.9, avgConversion: 3.1 },
];

export const mockCreatorCompare = [
  { campaignId: "campaign-1", campaignTitle: "올리브영 봄 신상 공구", period: "2025-02 ~ 03", views: 245000, orders: 420, revenue: 14700000, conversion: 3.4 },
  { campaignId: "campaign-4", campaignTitle: "이니스프리 가을 기획전", period: "2024-09 ~ 10", views: 98000, orders: 210, revenue: 6300000, conversion: 3.1 },
];

// =====================
// Mock AI 추천 캠페인 (온트너 크리에이터 대상)
// =====================

export const mockAiRecommendedCampaigns = [
  {
    campaignId: "campaign-5",
    title: "올리브영 여름 선케어 공구",
    brandName: "올리브영",
    category: "뷰티",
    unitPrice: 40000,
    matchRate: 92,
    matchReason: "뷰티/스킨케어 전문 채널 — 과거 올리브영 캠페인 전환율 3.4%로 최상위",
    startDate: new Date("2025-04-01"),
    endDate: new Date("2025-05-01"),
  },
  {
    campaignId: "campaign-7",
    title: "에뛰드 봄 신상 컬렉션",
    brandName: "에뛰드",
    category: "뷰티",
    unitPrice: 25000,
    matchRate: 85,
    matchReason: "색조 카테고리 팔로워 반응률 우수 — 오디언스 연령대 일치",
    startDate: new Date("2025-03-20"),
    endDate: new Date("2025-04-20"),
  },
  {
    campaignId: "campaign-6",
    title: "CJ제일제당 신제품 런칭",
    brandName: "CJ제일제당",
    category: "푸드",
    unitPrice: 28000,
    matchRate: 78,
    matchReason: "생활용품 크로스 카테고리 반응 양호 — 재구매율 높은 상품군",
    startDate: new Date("2025-04-15"),
    endDate: new Date("2025-05-15"),
  },
];

// =====================
// Mock 매출 기반 크리에이터 추천 (R025/R040)
// =====================

export const mockRevenueBasedRecommendations = [
  {
    creatorId: "creator-1",
    totalRevenue: 14700000,
    totalOrders: 420,
    avgConversionRate: 3.4,
    recentCampaignCount: 3,
    revenueScore: 94,
    revenueRank: 1,
    topCategory: "뷰티",
    recommendReason: "최근 3개월 누적 매출 1위 · 뷰티 카테고리 전환율 최상위",
    lastCampaignRevenue: 14700000,
    lastCampaignTitle: "올리브영 봄 신상 공구",
  },
  {
    creatorId: "creator-3",
    totalRevenue: 9200000,
    totalOrders: 280,
    avgConversionRate: 2.9,
    recentCampaignCount: 2,
    revenueScore: 87,
    revenueRank: 2,
    topCategory: "패션",
    recommendReason: "패션/뷰티 크로스 카테고리 매출 우수 · 알림신청 전환율 높음",
    lastCampaignRevenue: 9200000,
    lastCampaignTitle: "무신사 S/S 컬렉션",
  },
  {
    creatorId: "creator-2",
    totalRevenue: 7000000,
    totalOrders: 210,
    avgConversionRate: 3.1,
    recentCampaignCount: 2,
    revenueScore: 81,
    revenueRank: 3,
    topCategory: "푸드",
    recommendReason: "푸드 카테고리 댓글 기반 주문 전환 우수 · 재구매율 높음",
    lastCampaignRevenue: 7000000,
    lastCampaignTitle: "CJ제일제당 간편식 공구",
  },
  {
    creatorId: "creator-4",
    totalRevenue: 4800000,
    totalOrders: 145,
    avgConversionRate: 2.5,
    recentCampaignCount: 1,
    revenueScore: 72,
    revenueRank: 4,
    topCategory: "테크",
    recommendReason: "신규 공구 참여 크리에이터 · 팔로워 충성도 지표 상위",
    lastCampaignRevenue: 4800000,
    lastCampaignTitle: "삼성 갤럭시 액세서리 공구",
  },
];

// =====================
// Mock 대시보드 써머리
// =====================

const generateTrend = (): PerformanceTrend[] => {
  const days = 14;
  const trends: PerformanceTrend[] = [];
  const baseDate = new Date("2025-02-15");

  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    trends.push({
      date: date.toISOString().split("T")[0],
      views: 15000 + Math.round(Math.random() * 5000),
      likes: 1200 + Math.round(Math.random() * 500),
      comments: 150 + Math.round(Math.random() * 100),
      shares: 50 + Math.round(Math.random() * 30),
      estimatedOrders: 25 + Math.round(Math.random() * 15),
    });
  }
  return trends;
};

// 찜한 크리에이터 (R011)
// =====================
// Mock 유입 분석 데이터 (R019)
// =====================

export const mockCampaignInflowAnalysis: Record<string, CampaignInflowAnalysis> = {
  "campaign-1": {
    campaignCode: "OLY-2025-SP01",
    creatorCodes: [
      { creatorId: "creator-1", creatorName: "뷰티하나", code: "OLY-BHANA" },
      { creatorId: "creator-3", creatorName: "패션위크", code: "OLY-FWEEK" },
    ],
    inflowSources: [
      { source: "인스타그램 피드", count: 1840, ratio: 52 },
      { source: "인스타그램 릴스", count: 920, ratio: 26 },
      { source: "인스타그램 스토리", count: 390, ratio: 11 },
      { source: "외부 검색", count: 390, ratio: 11 },
    ],
    priorPaths: [
      { path: "크리에이터 게시물 좋아요", count: 1250 },
      { path: "크리에이터 프로필 방문", count: 890 },
      { path: "해시태그 검색", count: 620 },
      { path: "직접 URL 입력", count: 200 },
    ],
    totalAlarmSubscribers: 487,
  },
  "campaign-2": {
    campaignCode: "CJF-2025-02",
    creatorCodes: [
      { creatorId: "creator-2", creatorName: "맛있는진", code: "CJF-MJIN" },
    ],
    inflowSources: [
      { source: "인스타그램 피드", count: 620, ratio: 58 },
      { source: "인스타그램 릴스", count: 280, ratio: 26 },
      { source: "외부 검색", count: 170, ratio: 16 },
    ],
    priorPaths: [
      { path: "크리에이터 게시물 좋아요", count: 520 },
      { path: "해시태그 검색", count: 380 },
      { path: "크리에이터 프로필 방문", count: 170 },
    ],
    totalAlarmSubscribers: 213,
  },
};

export const mockBookmarkedCreators = [
  { creatorId: "creator-1", bookmarkedAt: new Date("2025-02-20"), memo: "뷰티 캠페인 1순위 후보" },
  { creatorId: "creator-2", bookmarkedAt: new Date("2025-02-25"), memo: "" },
  { creatorId: "creator-3", bookmarkedAt: new Date("2025-03-01"), memo: "팔로워 규모 크고 참여율 양호" },
];

export const mockDashboardSummary: DashboardSummary = {
  activeCampaigns: 3,
  totalCreators: 6,
  totalRevenue: 21700000,
  averageConversionRate: 3.1,
  recentCampaigns: [
    {
      id: "campaign-1",
      title: "올리브영 봄 신상 공구",
      status: "in_progress",
      revenue: 14700000,
    },
    {
      id: "campaign-2",
      title: "CJ제일제당 간편식 공구",
      status: "in_progress",
      revenue: 7000000,
    },
    {
      id: "campaign-3",
      title: "무신사 S/S 컬렉션",
      status: "proposed",
      revenue: 0,
    },
  ],
  performanceTrend: generateTrend(),
};
