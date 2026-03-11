export type CampaignStatus =
  | "draft"
  | "proposed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  brandId: string;
  brandName: string;
  category: string;
  status: CampaignStatus;
  budget: number;
  unitPrice: number;
  startDate: Date;
  endDate: Date;
  creators: CampaignCreator[];
  metrics?: CampaignMetrics;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignCreator {
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  status: "invited" | "accepted" | "declined" | "completed";
  proposedAt: Date;
  respondedAt?: Date;
}

export interface CampaignMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  estimatedOrders: number;
  claimCount: number;
  estimatedRevenue: number;
  conversionRate: number;
  keywordComments: {
    keyword: string;
    count: number;
  }[];
  lastUpdatedAt: Date;
}

export interface CampaignComparison {
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  category: string;
  metrics: CampaignMetrics;
}

export interface CampaignProposal {
  campaignId: string;
  creatorIds: string[];
  message: string;
  sendVia: "system" | "dm" | "email";
  includeSignupLink: boolean;
}
