export interface Content {
  id: string;
  creatorId: string;
  campaignId?: string;
  platform: "instagram" | "youtube";
  type: "공구" | "리뷰" | "일반" | "광고";
  thumbnail: string;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  engagementScore: number;
  category: string;
  postedAt: string;
  trackingData: ContentTrackingPoint[];
}

export interface ContentTrackingPoint {
  timestamp: string;
  likes: number;
  comments: number;
  saves: number;
}
