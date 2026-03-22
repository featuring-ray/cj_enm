import type { TriggerMode, DmCtaButton, FollowerFlowConfig } from "./auto-dm";

// ─── 초안 상태 ─────────────────────────────────────
export type DraftStatus = "작성 중" | "발송 완료";

// ─── 초안 발송 건별 상태 ────────────────────────────
export type DraftDeliveryStatus = "대기 중" | "수락" | "거절" | "적용 완료";

// ─── 자동 DM 초안 (OnTrust MD가 작성) ───────────────
export interface AutoDmDraft {
  id: string;
  name: string;
  status: DraftStatus;

  // DM 콘텐츠 (AutoDmAutomation과 동일 구조)
  triggerMode: TriggerMode;
  keywords: string[];
  autoReplyEnabled: boolean;
  replyTexts: string[];
  dmMessageBody: string;
  dmImageUrl: string | null;
  buttons: [DmCtaButton, DmCtaButton, DmCtaButton];
  followerFlow: FollowerFlowConfig;

  // 메타
  createdBy: string; // MD user ID
  createdAt: string;
  updatedAt: string;
}

// ─── 초안 발송 내역 (OnTrust → OnTner) ──────────────
export interface DraftDelivery {
  id: string;
  draftId: string;
  draftName: string;
  campaignId: string;
  campaignName: string;
  creatorId: string;
  creatorHandle: string;
  creatorName: string;
  sentAt: string;
  status: DraftDeliveryStatus;
  acceptedAt: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  resultAutomationId: string | null; // 수락 후 생성된 자동화 ID
}

// ─── 자동 DM 성과 (OnTrust 대시보드) ────────────────
export interface AutoDmContentMetrics {
  likeCount: number;
  commentCount: number;
  saveCount: number;
  repostCount: number;
  shareCount: number;
}

export interface AutoDmButtonPerformance {
  slotNo: number; // 1, 2, 3
  buttonName: string;
  url: string;
  uniqueClickers: number;
  totalClicks: number;
  ctr: number; // percentage
}

export interface AutoDmPerformanceRow {
  id: string;
  influencerHandle: string;
  influencerAvatar: string;
  influencerName: string;
  campaignId: string;
  campaignName: string;
  automationId: string;
  contentMetrics: AutoDmContentMetrics;
  uniqueRecipients: number;
  uniqueClickers: number;
  ctr: number; // percentage (uniqueClickers / uniqueRecipients * 100)
  followConversions: number;
  followConversionRate: number; // percentage
  buttonPerformance: AutoDmButtonPerformance[];
}

// ─── 계정 연동 상태 (OnTner) ────────────────────────
export interface AccountLinkingStatus {
  isLinked: boolean;
  linkedAt: string | null;
  instagramHandle: string | null;
  featuringStudioUrl: string;
}
