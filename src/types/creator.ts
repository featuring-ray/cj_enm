export interface Creator {
  id: string;
  username: string;
  displayName: string;
  profileImage?: string;
  platform: "instagram" | "youtube" | "tiktok";
  followerCount: number;
  averageLikes: number;
  averageComments: number;
  averageShares: number;
  averageViews: number;
  engagementRate: number;
  score: number;
  categories: string[];
  brands: CreatorBrand[];
  isOntnerMember: boolean;
  isCommerceAccount: boolean;
  isOfficialAccount: boolean;
  isCelebrity: boolean;
  avgUnitPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

/** Mock 크리에이터 (OnTrust 검색용 확장 필드 포함) */
export interface MockCreatorExtended {
  id: string;
  handle: string;
  youtubeHandle?: string;
  name: string;
  profileImage?: string;
  followers: number;
  engagementRate: number;
  category: string[];
  isOntnerMember: boolean;
  salesPrice?: number;
  desiredCategory?: string;
  desiredRate?: number;
  introduction?: string;
  biography: string;
  campaigns: string[];
  tier: "GOLD" | "SILVER" | "BRONZE";
  // P2 확장 필드
  contactEmail: string;
  recentUploadDate: string;
  avgFeedLikes: number;
  avgVideoLikes: number;
  avgVideoViews: number;
  avgShortsViews?: number;
  avgComments: number;
  hasVerificationBadge: boolean;
  estimatedReach: number;
  audienceGender: { male: number; female: number };
  audienceAge: Record<string, number>;
  hasCoPurchase: boolean;
  socialBuzzDetected: boolean;
  // CJ 내부 데이터
  ontnerCampaignCount: number;
  avgPerformance?: number;
  avgProductPrice?: number;
  customerAge?: Record<string, number>;
  rewardLinkUsage: boolean;
  hasFollowerData: boolean;
}

/** 고급 필터 상태 (플랫폼별) */
export interface AdvancedSearchFilters {
  platform: "instagram" | "youtube" | "";
  category: string[];
  recentUploadPeriod: string;
  followerMin: string;
  followerMax: string;
  // 인스타그램 전용
  hasVerificationBadge: "all" | "yes" | "no";
  avgFeedLikesMin: string;
  avgFeedLikesMax: string;
  avgVideoLikesMin: string;
  avgVideoLikesMax: string;
  avgVideoViewsMin: string;
  avgVideoViewsMax: string;
  erMin: string;
  erMax: string;
  estimatedReachMin: string;
  estimatedReachMax: string;
  // 유튜브 전용
  avgShortsViewsMin: string;
  avgShortsViewsMax: string;
  // 오디언스
  audienceGender: "all" | "female" | "male";
  audienceAgeMin: string;
  audienceAgeMax: string;
}

export interface CreatorBrand {
  brandId: string;
  brandName: string;
  campaignCount: number;
  isPrimary: boolean;
}

export interface CreatorSearchFilters {
  categories?: string[];
  excludeCategories?: string[];
  brands?: string[];
  includeSimilarBrands?: boolean;
  unitPriceRange?: { min: number; max: number };
  commerceOnly?: boolean;
  excludeOfficialAndCelebrity?: boolean;
  sortBy: CreatorSortField;
  sortOrder: "asc" | "desc";
  viewMode: "account" | "content";
  page: number;
  pageSize: number;
}

export type CreatorSortField =
  | "comments"
  | "shares"
  | "views"
  | "likes"
  | "followers";

export interface CreatorInsightReport {
  creatorId: string;
  salesSummary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  audienceMatch: {
    overlapPercentage: number;
    buyerSegments: { label: string; percentage: number }[];
    audienceSegments: { label: string; percentage: number }[];
  };
  contentRecommendations: string[];
  bestUploadFrequency: string;
  suggestedCampaigns: { brandName: string; reason: string }[];
}

export interface AudienceOverlap {
  creatorIds: string[];
  overlapRate: number;
  uniqueReach: number;
  totalFollowers: number;
}
