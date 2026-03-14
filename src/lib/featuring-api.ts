import type {
  Creator,
  CreatorSearchFilters,
  CreatorInsightReport,
  AudienceOverlap,
} from "@/types/creator";
import type { Campaign, CampaignMetrics, CampaignComparison } from "@/types/campaign";
import type {
  TrackingData,
  PerformanceTrend,
  CreatorScoring,
  DashboardSummary,
  MonthlyRevenue,
  CampaignInflowAnalysis,
} from "@/types/analytics";
import type { Content } from "@/types/content";
import type { Recommendation } from "@/types/recommendation";
import type { SimilarityResult } from "@/types/similarity";

// New mock JSON data (claude.md spec)
import mockCreatorsJson from "@/data/mock/creators.json";
import mockCampaignsJson from "@/data/mock/campaigns.json";
import mockContentsJson from "@/data/mock/contents.json";
import mockRecommendationsJson from "@/data/mock/recommendations.json";
import mockSimilarityJson from "@/data/mock/similarity.json";
import mockCampaignRecommendationsJson from "@/data/mock/campaign-recommendations.json";

import {
  mockCreators,
  mockCampaigns,
  mockCampaignMetrics,
  mockTrackingData,
  mockDashboardSummary,
  mockMonthlyRevenue,
  mockAutomationRules,
  mockAutomationLogs,
  mockAnalyticsOverview,
  mockMonthlyCategoryRevenue,
  mockTopCreators,
  mockPartnerAnalytics,
  mockPartnerMonthlyRevenue,
  mockCategoryComparison,
  mockCreatorCompare,
  mockAiRecommendedCampaigns,
  mockBookmarkedCreators,
  mockCampaignInflowAnalysis,
  mockRevenueBasedRecommendations,
} from "@/mocks/data";

const FEATURING_API_URL = process.env.FEATURING_API_URL;
const USE_MOCK = !process.env.FEATURING_API_KEY;

class FeaturingApiClient {
  private baseUrl: string;
  private apiKey: string;
  private useMock: boolean;

  constructor() {
    this.baseUrl = FEATURING_API_URL || "";
    this.apiKey = process.env.FEATURING_API_KEY || "";
    this.useMock = USE_MOCK;
  }

  // =====================
  // F-DATA-01: 캠페인 성과 트래킹
  // =====================

  async getTrackingData(
    campaignId: string,
    creatorId?: string
  ): Promise<TrackingData[]> {
    if (this.useMock) {
      return mockTrackingData.filter(
        (t) =>
          t.campaignId === campaignId &&
          (!creatorId || t.creatorId === creatorId)
      );
    }
    return this.fetch(`/tracking?campaignId=${campaignId}`);
  }

  async getCampaignMetrics(campaignId: string): Promise<CampaignMetrics> {
    if (this.useMock) {
      return (
        mockCampaignMetrics[campaignId] || mockCampaignMetrics["campaign-1"]
      );
    }
    return this.fetch(`/tracking/metrics/${campaignId}`);
  }

  async getPerformanceTrend(
    campaignId: string
  ): Promise<PerformanceTrend[]> {
    if (this.useMock) {
      return mockDashboardSummary.performanceTrend;
    }
    return this.fetch(`/tracking/trend/${campaignId}`);
  }

  // =====================
  // F-DATA-02: 크리에이터 스코어링
  // =====================

  async getCreatorScoring(creatorId: string): Promise<CreatorScoring> {
    if (this.useMock) {
      const creator = mockCreators.find((c) => c.id === creatorId);
      return {
        creatorId,
        overallScore: creator?.score || 75,
        engagementScore: 80,
        conversionScore: 70,
        growthScore: 65,
        consistencyScore: 85,
        tier: "A",
        calculatedAt: new Date(),
      };
    }
    return this.fetch(`/scoring/${creatorId}`);
  }

  // =====================
  // F-DATA-03: 팔로워 일치율 분석
  // =====================

  async getAudienceOverlap(creatorIds: string[]): Promise<AudienceOverlap> {
    if (this.useMock) {
      const totalFollowers = creatorIds.length * 50000;
      return {
        creatorIds,
        overlapRate: 0.15 + Math.random() * 0.2,
        uniqueReach: Math.round(totalFollowers * 0.78),
        totalFollowers,
      };
    }
    return this.fetch("/audience/overlap", {
      method: "POST",
      body: JSON.stringify({ creatorIds }),
    });
  }

  // =====================
  // 크리에이터 검색 & 추천
  // =====================

  async searchCreators(
    filters: CreatorSearchFilters
  ): Promise<{ creators: Creator[]; total: number }> {
    if (this.useMock) {
      let filtered = [...mockCreators];

      if (filters.commerceOnly) {
        filtered = filtered.filter((c) => c.isCommerceAccount);
      }
      if (filters.excludeOfficialAndCelebrity) {
        filtered = filtered.filter(
          (c) => !c.isOfficialAccount && !c.isCelebrity
        );
      }
      if (filters.categories?.length) {
        filtered = filtered.filter((c) =>
          c.categories.some((cat) => filters.categories!.includes(cat))
        );
      }

      const sortKey =
        filters.sortBy === "comments"
          ? "averageComments"
          : filters.sortBy === "shares"
            ? "averageShares"
            : filters.sortBy === "views"
              ? "averageViews"
              : filters.sortBy === "likes"
                ? "averageLikes"
                : "followerCount";

      filtered.sort((a, b) =>
        filters.sortOrder === "desc"
          ? b[sortKey] - a[sortKey]
          : a[sortKey] - b[sortKey]
      );

      const start = (filters.page - 1) * filters.pageSize;
      return {
        creators: filtered.slice(start, start + filters.pageSize),
        total: filtered.length,
      };
    }
    return this.fetch("/creators/search", {
      method: "POST",
      body: JSON.stringify(filters),
    });
  }

  async getCreatorInsight(
    creatorId: string
  ): Promise<CreatorInsightReport> {
    if (this.useMock) {
      return {
        creatorId,
        salesSummary: {
          totalRevenue: 12500000,
          totalOrders: 340,
          averageOrderValue: 36765,
          conversionRate: 3.2,
        },
        audienceMatch: {
          overlapPercentage: 72,
          buyerSegments: [
            { label: "25-34 여성", percentage: 45 },
            { label: "35-44 여성", percentage: 28 },
            { label: "25-34 남성", percentage: 15 },
          ],
          audienceSegments: [
            { label: "25-34 여성", percentage: 52 },
            { label: "18-24 여성", percentage: 22 },
            { label: "35-44 여성", percentage: 18 },
          ],
        },
        contentRecommendations: [
          "유사 카테고리에서 반응이 좋았던 콘텐츠 유형은 '언박싱 릴스'입니다.",
          "가장 실적이 좋았던 업로드 주기는 '주 3회'입니다.",
          "제품 사용 후기가 포함된 피드 게시물의 전환율이 40% 더 높습니다.",
        ],
        bestUploadFrequency: "주 3회",
        suggestedCampaigns: [
          {
            brandName: "올리브영",
            reason: "유사 타겟 오디언스, 과거 뷰티 카테고리 높은 전환율",
          },
          {
            brandName: "무신사",
            reason: "25-34 남녀 타겟 일치, 패션 카테고리 성장세",
          },
        ],
      };
    }
    return this.fetch(`/creators/${creatorId}/insight`);
  }

  async getDashboardSummary(role: string): Promise<DashboardSummary> {
    if (this.useMock) {
      return mockDashboardSummary;
    }
    return this.fetch(`/dashboard?role=${role}`);
  }

  // =====================
  // 캠페인 비교 분석
  // =====================

  async compareCampaigns(
    campaignIds: string[]
  ): Promise<CampaignComparison[]> {
    if (this.useMock) {
      return campaignIds.map((id) => ({
        campaignId: id,
        campaignTitle: `캠페인 ${id}`,
        brandName: "테스트 브랜드",
        category: "뷰티",
        metrics: mockCampaignMetrics[id] || mockCampaignMetrics["campaign-1"],
      }));
    }
    return this.fetch("/campaigns/compare", {
      method: "POST",
      body: JSON.stringify({ campaignIds }),
    });
  }

  // =====================
  // 크리에이터 캠페인 (온트너 포털용)
  // =====================

  async getCreatorCampaigns(creatorId: string): Promise<{
    proposals: Campaign[];
    active: Campaign[];
    completed: Campaign[];
  }> {
    if (this.useMock) {
      const proposals = mockCampaigns.filter((c) =>
        c.creators.some(
          (cr) => cr.creatorId === creatorId && cr.status === "invited"
        )
      );
      const active = mockCampaigns.filter((c) =>
        c.creators.some(
          (cr) => cr.creatorId === creatorId && cr.status === "accepted"
        )
      );
      const completed = mockCampaigns.filter((c) =>
        c.creators.some(
          (cr) => cr.creatorId === creatorId && cr.status === "completed"
        )
      );
      return { proposals, active, completed };
    }
    return this.fetch(`/creators/${creatorId}/campaigns`);
  }

  async getExploreCampaigns(creatorId: string): Promise<Campaign[]> {
    if (this.useMock) {
      return mockCampaigns.filter(
        (c) =>
          c.status === "proposed" &&
          !c.creators.some((cr) => cr.creatorId === creatorId)
      );
    }
    return this.fetch(`/campaigns/explore?creatorId=${creatorId}`);
  }

  async getCampaignById(campaignId: string): Promise<Campaign | null> {
    if (this.useMock) {
      return mockCampaigns.find((c) => c.id === campaignId) || null;
    }
    return this.fetch(`/campaigns/${campaignId}`);
  }

  async getMonthlyRevenue(creatorId: string): Promise<MonthlyRevenue[]> {
    if (this.useMock) {
      return mockMonthlyRevenue;
    }
    return this.fetch(`/creators/${creatorId}/revenue/monthly`);
  }

  // =====================
  // 크리에이터 상세 (온트러스트/파트너)
  // =====================

  async getCreatorById(creatorId: string): Promise<Creator | null> {
    if (this.useMock) {
      return mockCreators.find((c) => c.id === creatorId) || null;
    }
    return this.fetch(`/creators/${creatorId}`);
  }

  async getCreatorDetailReport(creatorId: string): Promise<{
    creator: Creator;
    scoring: import("@/types/analytics").CreatorScoring;
    insight: CreatorInsightReport;
    recentCampaigns: Campaign[];
  }> {
    if (this.useMock) {
      const creator = mockCreators.find((c) => c.id === creatorId) || mockCreators[0];
      const scoring: import("@/types/analytics").CreatorScoring = {
        creatorId,
        overallScore: creator.score,
        engagementScore: 80,
        conversionScore: 72,
        growthScore: 68,
        consistencyScore: 85,
        tier: creator.score >= 90 ? "S" : creator.score >= 80 ? "A" : creator.score >= 70 ? "B" : "C",
        calculatedAt: new Date(),
      };
      const insight = await this.getCreatorInsight(creatorId);
      const recentCampaigns = mockCampaigns.filter((c) =>
        c.creators.some((cr) => cr.creatorId === creatorId)
      );
      return { creator, scoring, insight, recentCampaigns };
    }
    return this.fetch(`/creators/${creatorId}/detail`);
  }

  // =====================
  // 캠페인 관리 (온트러스트)
  // =====================

  async getAllCampaigns(filters?: {
    status?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ campaigns: Campaign[]; total: number }> {
    if (this.useMock) {
      let filtered = [...mockCampaigns];
      if (filters?.status) {
        filtered = filtered.filter((c) => c.status === filters.status);
      }
      if (filters?.category) {
        filtered = filtered.filter((c) => c.category === filters.category);
      }
      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 10;
      const start = (page - 1) * pageSize;
      return {
        campaigns: filtered.slice(start, start + pageSize),
        total: filtered.length,
      };
    }
    const params = new URLSearchParams(filters as Record<string, string>);
    return this.fetch(`/campaigns?${params}`);
  }

  async createCampaign(data: Partial<Campaign>): Promise<Campaign> {
    if (this.useMock) {
      const newCampaign: Campaign = {
        id: `campaign-${Date.now()}`,
        title: data.title || "",
        description: data.description || "",
        brandId: data.brandId || "",
        brandName: data.brandName || "",
        category: data.category || "",
        status: "draft",
        budget: data.budget || 0,
        unitPrice: data.unitPrice || 0,
        startDate: data.startDate || new Date(),
        endDate: data.endDate || new Date(),
        creators: [],
        createdBy: "admin-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockCampaigns.push(newCampaign);
      return newCampaign;
    }
    return this.fetch("/campaigns", { method: "POST", body: JSON.stringify(data) });
  }

  async proposeCampaign(
    campaignId: string,
    creatorIds: string[],
    message: string,
    includeSignupLink?: boolean
  ): Promise<void> {
    if (this.useMock) {
      const campaign = mockCampaigns.find((c) => c.id === campaignId);
      if (campaign) {
        for (const creatorId of creatorIds) {
          const creator = mockCreators.find((c) => c.id === creatorId);
          if (creator && !campaign.creators.some((cc) => cc.creatorId === creatorId)) {
            campaign.creators.push({
              creatorId,
              creatorName: creator.displayName,
              creatorUsername: creator.username,
              status: "invited",
              proposedAt: new Date(),
            });
          }
        }
        campaign.status = "proposed";
      }
      return;
    }
    return this.fetch(`/campaigns/${campaignId}/propose`, {
      method: "POST",
      body: JSON.stringify({ creatorIds, message, includeSignupLink }),
    });
  }

  // =====================
  // 성과 분석 (온트러스트)
  // =====================

  async getAnalyticsOverview(): Promise<typeof mockAnalyticsOverview> {
    if (this.useMock) return mockAnalyticsOverview;
    return this.fetch("/analytics/overview");
  }

  async getMonthlyCategoryRevenue(): Promise<typeof mockMonthlyCategoryRevenue> {
    if (this.useMock) return mockMonthlyCategoryRevenue;
    return this.fetch("/analytics/category-revenue");
  }

  async getTopCreators(): Promise<typeof mockTopCreators> {
    if (this.useMock) return mockTopCreators;
    return this.fetch("/analytics/top-creators");
  }

  // =====================
  // 파트너 성과 분석
  // =====================

  async getPartnerAnalytics(partnerId?: string): Promise<typeof mockPartnerAnalytics> {
    if (this.useMock) return mockPartnerAnalytics;
    return this.fetch(`/partner/analytics?partnerId=${partnerId || ""}`);
  }

  async getPartnerMonthlyRevenue(partnerId?: string): Promise<typeof mockPartnerMonthlyRevenue> {
    if (this.useMock) return mockPartnerMonthlyRevenue;
    return this.fetch(`/partner/analytics/revenue?partnerId=${partnerId || ""}`);
  }

  async getCategoryComparison(category: string): Promise<typeof mockCategoryComparison> {
    if (this.useMock) return mockCategoryComparison;
    return this.fetch(`/partner/analytics/category?category=${category}`);
  }

  async getCreatorCompare(creatorId: string): Promise<typeof mockCreatorCompare> {
    if (this.useMock) return mockCreatorCompare;
    return this.fetch(`/partner/analytics/creator-compare?creatorId=${creatorId}`);
  }

  // =====================
  // AI 추천 캠페인 (온트너)
  // =====================

  async getAiRecommendedCampaigns(creatorId: string): Promise<typeof mockAiRecommendedCampaigns> {
    if (this.useMock) return mockAiRecommendedCampaigns;
    return this.fetch(`/campaigns/recommend?creatorId=${creatorId}`);
  }

  // =====================
  // 자동화 관리 (온트너)
  // =====================

  async getAutomationRules(creatorId: string): Promise<typeof mockAutomationRules> {
    if (this.useMock) return mockAutomationRules;
    return this.fetch(`/creators/${creatorId}/automation`);
  }

  async getAutomationLogs(creatorId: string): Promise<typeof mockAutomationLogs> {
    if (this.useMock) return mockAutomationLogs;
    return this.fetch(`/creators/${creatorId}/automation/logs`);
  }

  // =====================
  // 찜한 크리에이터 (R011)
  // =====================

  async getBookmarkedCreators(): Promise<(typeof mockBookmarkedCreators[0] & { creator: Creator })[]> {
    if (this.useMock) {
      return mockBookmarkedCreators.map((b) => ({
        ...b,
        creator: mockCreators.find((c) => c.id === b.creatorId)!,
      })).filter((b) => b.creator);
    }
    return this.fetch(`/creators/bookmarks`);
  }

  async toggleBookmark(creatorId: string, memo?: string): Promise<{ bookmarked: boolean }> {
    if (this.useMock) {
      const idx = mockBookmarkedCreators.findIndex((b) => b.creatorId === creatorId);
      if (idx >= 0) {
        mockBookmarkedCreators.splice(idx, 1);
        return { bookmarked: false };
      } else {
        mockBookmarkedCreators.push({ creatorId, bookmarkedAt: new Date(), memo: memo || "" });
        return { bookmarked: true };
      }
    }
    return this.fetch(`/creators/${creatorId}/bookmark`, { method: "POST", body: JSON.stringify({ memo }) });
  }

  // =====================
  // 매출 기반 크리에이터 추천 (R025/R040)
  // =====================

  async getRevenueBasedRecommendations(): Promise<(typeof mockRevenueBasedRecommendations[0] & { creator: Creator })[]> {
    if (this.useMock) {
      return mockRevenueBasedRecommendations
        .map((r) => ({
          ...r,
          creator: mockCreators.find((c) => c.id === r.creatorId)!,
        }))
        .filter((r) => r.creator)
        .sort((a, b) => b.revenueScore - a.revenueScore);
    }
    return this.fetch("/creators/revenue-recommendations");
  }

  // =====================
  // 캠페인 유입 분석 (R019)
  // =====================

  async getCampaignInflowAnalysis(campaignId: string): Promise<CampaignInflowAnalysis | null> {
    if (this.useMock) {
      return mockCampaignInflowAnalysis[campaignId] || null;
    }
    return this.fetch(`/campaigns/${campaignId}/inflow`);
  }

  // =====================
  // 콘텐츠 탐색 (claude.md OTR-008, ONT-010)
  // =====================

  async getContents(filters?: {
    category?: string;
    type?: "공구" | "리뷰" | "일반" | "광고";
    platform?: "instagram" | "youtube";
    sortBy?: "engagementScore" | "likes" | "comments" | "postedAt";
    limit?: number;
  }): Promise<Content[]> {
    if (this.useMock) {
      let contents = mockContentsJson as Content[];
      if (filters?.category) {
        contents = contents.filter((c) => c.category === filters.category);
      }
      if (filters?.type) {
        contents = contents.filter((c) => c.type === filters.type);
      }
      if (filters?.platform) {
        contents = contents.filter((c) => c.platform === filters.platform);
      }
      const sortKey = filters?.sortBy || "engagementScore";
      if (sortKey === "postedAt") {
        contents.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
      } else {
        contents.sort((a, b) => b[sortKey] - a[sortKey]);
      }
      if (filters?.limit) {
        contents = contents.slice(0, filters.limit);
      }
      return contents;
    }
    return this.fetch("/contents/search");
  }

  // =====================
  // 팔로워 유사도 분석 (claude.md ONT-006, OTR-007)
  // =====================

  async getCreatorSimilarity(
    creatorA: string,
    creatorB: string
  ): Promise<SimilarityResult | null> {
    if (this.useMock) {
      const results = mockSimilarityJson as SimilarityResult[];
      return (
        results.find(
          (r) =>
            (r.creatorA === creatorA && r.creatorB === creatorB) ||
            (r.creatorA === creatorB && r.creatorB === creatorA)
        ) || null
      );
    }
    return this.fetch(`/similarity?a=${creatorA}&b=${creatorB}`);
  }

  async getSimilarityMatrix(
    creatorIds: string[]
  ): Promise<SimilarityResult[]> {
    if (this.useMock) {
      const results = mockSimilarityJson as SimilarityResult[];
      return results.filter(
        (r) => creatorIds.includes(r.creatorA) && creatorIds.includes(r.creatorB)
      );
    }
    return this.fetch("/similarity/matrix", {
      method: "POST",
      body: JSON.stringify({ creatorIds }),
    });
  }

  // =====================
  // 크리에이터 추천 (claude.md OTR-009)
  // =====================

  async getCreatorRecommendations(
    campaignId: string
  ): Promise<Recommendation | null> {
    if (this.useMock) {
      const recs = mockRecommendationsJson as Recommendation[];
      return recs.find((r) => r.campaignId === campaignId) || null;
    }
    return this.fetch(`/campaigns/${campaignId}/recommendations`);
  }

  // =====================
  // 크리에이터 데이터 (claude.md 신규 mock)
  // =====================

  async getNewCreators(): Promise<typeof mockCreatorsJson> {
    if (this.useMock) return mockCreatorsJson;
    return this.fetch("/v2/creators");
  }

  async getNewCampaigns(filters?: {
    status?: string;
    category?: string;
  }): Promise<typeof mockCampaignsJson> {
    if (this.useMock) {
      let campaigns = [...mockCampaignsJson];
      if (filters?.status) {
        campaigns = campaigns.filter((c) => c.status === filters.status);
      }
      if (filters?.category) {
        campaigns = campaigns.filter((c) => c.brandCategory === filters.category);
      }
      return campaigns;
    }
    return this.fetch("/v2/campaigns");
  }

  // =====================
  // DM 발송 (claude.md OTR-006)
  // =====================

  async getDmTemplates(): Promise<
    { id: string; name: string; content: string; variables: string[] }[]
  > {
    if (this.useMock) {
      return [
        {
          id: "tpl-1",
          name: "캠페인 제안",
          content: "안녕하세요 {크리에이터명}님! {캠페인명} 캠페인에 참여하실 의향이 있으신가요? 자세한 내용은 {링크}에서 확인해주세요.",
          variables: ["크리에이터명", "캠페인명", "링크"],
        },
        {
          id: "tpl-2",
          name: "회원가입 안내",
          content: "{크리에이터명}님, CJ 온스타일 온트너 플랫폼에 가입하시면 다양한 캠페인 참여 기회를 제공받으실 수 있습니다. 가입 링크: {링크}",
          variables: ["크리에이터명", "링크"],
        },
        {
          id: "tpl-3",
          name: "성과 공유",
          content: "{크리에이터명}님, {캠페인명} 캠페인의 최종 성과를 공유드립니다. 총 매출 {매출액}, 전환율 {전환율}을 달성하셨습니다!",
          variables: ["크리에이터명", "캠페인명", "매출액", "전환율"],
        },
      ];
    }
    return this.fetch("/dm/templates");
  }

  async sendDm(payload: {
    recipientId: string;
    accountId: string;
    templateId?: string;
    message: string;
    link?: string;
  }): Promise<{ success: boolean; sentAt: string }> {
    if (this.useMock) {
      return { success: true, sentAt: new Date().toISOString() };
    }
    return this.fetch("/dm/send", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // =====================
  // 북마크 그룹 (claude.md OTR-010~014)
  // =====================

  async getBookmarkGroups(): Promise<
    { id: string; name: string; creatorIds: string[]; createdAt: string }[]
  > {
    if (this.useMock) {
      return [
        {
          id: "group-1",
          name: "뷰티 크리에이터",
          creatorIds: ["creator-1", "creator-3", "creator-7"],
          createdAt: "2026-02-15T10:00:00Z",
        },
        {
          id: "group-2",
          name: "푸드 크리에이터",
          creatorIds: ["creator-2", "creator-6"],
          createdAt: "2026-02-20T14:00:00Z",
        },
        {
          id: "group-3",
          name: "신규 타겟",
          creatorIds: ["creator-4", "creator-8"],
          createdAt: "2026-03-01T09:00:00Z",
        },
      ];
    }
    return this.fetch("/bookmarks/groups");
  }

  // =====================
  // 캠페인 추천 모듈 (claude.md O-C-06)
  // =====================

  async getCampaignRecommendations(
    creatorId: string
  ): Promise<(typeof mockCampaignRecommendationsJson)[number] | null> {
    if (this.useMock) {
      return (
        (mockCampaignRecommendationsJson as typeof mockCampaignRecommendationsJson).find(
          (r) => r.creatorId === creatorId
        ) ||
        mockCampaignRecommendationsJson[0] ||
        null
      );
    }
    return this.fetch(`/campaigns/recommend/creator/${creatorId}`);
  }

  // =====================
  // 캠페인 역제안 (claude.md ONT-005)
  // =====================

  async getCounterProposals(creatorId: string): Promise<
    {
      id: string;
      brandName: string;
      proposedAt: string;
      status: "대기" | "수락" | "거절";
      content: string;
    }[]
  > {
    if (this.useMock) {
      return [
        {
          id: "cp-1",
          brandName: "올리브영",
          proposedAt: "2026-03-05",
          status: "대기",
          content: "봄 신상 라인업 공구 진행 희망합니다.",
        },
        {
          id: "cp-2",
          brandName: "에뛰드",
          proposedAt: "2026-02-20",
          status: "수락",
          content: "컬러 컬렉션 공동구매 제안드립니다.",
        },
        {
          id: "cp-3",
          brandName: "무신사",
          proposedAt: "2026-02-10",
          status: "거절",
          content: "S/S 시즌 패션 아이템 공구 희망.",
        },
      ];
    }
    return this.fetch(`/creators/${creatorId}/counter-proposals`);
  }

  // =====================
  // 내부 HTTP 클라이언트
  // =====================

  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        ...options?.headers,
      },
    });

    if (!res.ok) {
      throw new Error(`Featuring API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }
}

export const featuringApi = new FeaturingApiClient();
