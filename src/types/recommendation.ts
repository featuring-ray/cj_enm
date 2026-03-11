export interface Recommendation {
  campaignId: string;
  creators: {
    creatorId: string;
    score: number;
    reason: "성과유사" | "구매기반" | "카테고리유사";
  }[];
  updatedAt: string;
}
