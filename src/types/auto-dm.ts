// 자동 DM 자동화 상태
export type AutomationStatus = "초안" | "실행 중" | "중단됨";

// 트리거 모드
export type TriggerMode = "keywords" | "all";

// 인스타그램 게시물 (mock)
export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  postedAt: string;
  likeCount: number;
  commentCount: number;
  usedInAutomationId: string | null;
}

// DM CTA 버튼
export interface DmCtaButton {
  enabled: boolean;
  name: string; // max 20자
  url: string;
}

// 팔로워 유도 플로우 설정
export interface FollowerFlowConfig {
  enabled: boolean;
  actionAMessage: string; // 미팔로우 시 메시지
  actionAButtonName: string;
  actionBMessage: string; // 팔로우 시 메시지
  actionBButtonName: string;
}

// 자동 DM 자동화 데이터 모델
export interface AutoDmAutomation {
  id: string;
  name: string;
  status: AutomationStatus;

  // 섹션 1: 게시물 선택
  postId: string | null;
  postSnapshot: InstagramPost | null;

  // 섹션 2: 트리거
  triggerMode: TriggerMode;
  keywords: string[];

  // 섹션 3: 자동 대댓글
  autoReplyEnabled: boolean;
  replyTexts: string[];

  // 섹션 4: DM 발송 설정
  dmMessageBody: string;
  dmImageUrl: string | null;
  buttons: [DmCtaButton, DmCtaButton, DmCtaButton];

  // 섹션 5: 팔로워 유도
  followerFlow: FollowerFlowConfig;

  // MD 초안 출처 (null이면 크리에이터 직접 생성)
  sourceDraftId: string | null;
  sourceCampaignId: string | null;
  sourceCampaignName: string | null;

  // 통계
  sentCount: number;
  replyCount: number;
  clickCount: number;

  createdAt: string;
  updatedAt: string;
  lastRefreshedAt: string | null;
}

// 폼 상태
export interface AutoDmFormState {
  name: string;
  postId: string | null;
  triggerMode: TriggerMode;
  keywordsInput: string;
  autoReplyEnabled: boolean;
  replyTexts: string[];
  dmMessageBody: string;
  dmImageUrl: string | null;
  buttons: [DmCtaButton, DmCtaButton, DmCtaButton];
  followerFlow: FollowerFlowConfig;
}

// 필드별 에러
export type AutoDmFormErrors = Partial<Record<string, string>>;

// 기본 버튼 초기값
export const DEFAULT_BUTTONS: [DmCtaButton, DmCtaButton, DmCtaButton] = [
  { enabled: false, name: "", url: "" },
  { enabled: false, name: "", url: "" },
  { enabled: false, name: "", url: "" },
];

// 기본 팔로워 플로우 초기값
export const DEFAULT_FOLLOWER_FLOW: FollowerFlowConfig = {
  enabled: false,
  actionAMessage:
    "아직 팔로우를 하지 않으셨네요! 팔로우하고 혜택을 받아보세요.",
  actionAButtonName: "팔로우 완료했어요",
  actionBMessage: "팔로우 감사합니다! 아래 링크에서 혜택을 확인하세요.",
  actionBButtonName: "혜택 확인하기",
};

// 빈 폼 초기값
export const EMPTY_FORM_STATE: AutoDmFormState = {
  name: "",
  postId: null,
  triggerMode: "keywords",
  keywordsInput: "",
  autoReplyEnabled: false,
  replyTexts: ["", "", ""],
  dmMessageBody: "",
  dmImageUrl: null,
  buttons: [...DEFAULT_BUTTONS] as [DmCtaButton, DmCtaButton, DmCtaButton],
  followerFlow: { ...DEFAULT_FOLLOWER_FLOW },
};
