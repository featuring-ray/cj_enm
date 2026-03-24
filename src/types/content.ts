export interface Content {
  id: string;
  creatorId: string;
  campaignId?: string;
  platform: "instagram" | "youtube";
  type: "공구" | "리뷰" | "일반" | "광고";
  contentType: "릴스" | "피드" | "숏츠" | "동영상";
  title: string;
  thumbnail: string;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  views: number;
  engagementScore: number;
  category: string;
  postedAt: string;
  socialBuzzDetected?: boolean;
  trackingData: ContentTrackingPoint[];
}

export interface ContentTrackingPoint {
  timestamp: string;
  likes: number;
  comments: number;
  saves: number;
}
