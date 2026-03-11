export interface TrackingData {
  campaignId: string;
  creatorId: string;
  postUrl: string;
  platform: "instagram" | "youtube" | "tiktok";
  contentType: "feed" | "reels" | "story";
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
  keywordComments: {
    keyword: string;
    count: number;
  }[];
  collectedAt: Date;
}

export interface PerformanceTrend {
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  estimatedOrders: number;
}

export interface CreatorScoring {
  creatorId: string;
  overallScore: number;
  engagementScore: number;
  conversionScore: number;
  growthScore: number;
  consistencyScore: number;
  tier: "S" | "A" | "B" | "C" | "D";
  calculatedAt: Date;
}

export interface DashboardSummary {
  activeCampaigns: number;
  totalCreators: number;
  totalRevenue: number;
  averageConversionRate: number;
  recentCampaigns: {
    id: string;
    title: string;
    status: string;
    revenue: number;
  }[];
  performanceTrend: PerformanceTrend[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
}

export interface CampaignInflowAnalysis {
  campaignCode: string;
  creatorCodes: { creatorId: string; creatorName: string; code: string }[];
  inflowSources: { source: string; count: number; ratio: number }[];
  priorPaths: { path: string; count: number }[];
  totalAlarmSubscribers: number;
}

export interface MessagingStats {
  totalSent: number;
  dailySent: number;
  dailyLimit: number;
  responseRate: number;
  accounts: {
    id: string;
    username: string;
    dailySent: number;
    isActive: boolean;
  }[];
}
