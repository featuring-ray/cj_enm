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
