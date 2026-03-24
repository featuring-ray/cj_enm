export interface Recommendation {
  campaignId: string;
  creators: RecommendedCreator[];
  updatedAt: string;
}

export interface RecommendedCreator {
  creatorId: string;
  score: number;
  reason: "성과유사" | "구매기반" | "카테고리유사" | "브랜드유사" | "공구진행";
  categoryMatch: boolean;
  brandSimilarity: boolean;
  coPurchaseStatus: boolean;
  engagementScore: number;
  salesScore: number | null;
  avgComments: number;
  avgViews: number;
  ontnerCampaignCount: number;
  cumulativeSales: number | null;
}
