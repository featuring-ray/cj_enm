# CJ x 피처링 온스타일 크리에이터 플랫폼

## 프로젝트 개요

CJ 온스타일의 크리에이터 커머스 생태계를 위한 3개 플랫폼 목업 구현 프로젝트.
모든 데이터는 Mock 데이터를 사용하며, 실제 API 연동 없이 프론트엔드 목업으로 구현한다.

### 플랫폼 구성

| 플랫폼 | 코드 | 대상 | 설명 |
|--------|------|------|------|
| **온트너(Ontner)** | O | 크리에이터(인플루언서) | 크리에이터가 캠페인을 탐색하고 성과를 확인하는 서비스 |
| **온트러스트(Ontrust)** | T | CJ 내부 MD/관리자 | MD가 크리에이터를 탐색·추천·관리하고 캠페인 성과를 분석하는 내부 어드민 도구 (DM 어드민 설정 포함) |
| **파트너(Partner)** | P | 외부 협력사/브랜드 | 협력사가 온트너 등록 크리에이터만 제한적으로 조회하는 서비스 |

### IA (정보구조) ID 체계

화면 ID는 `{플랫폼}-{도메인}-{번호}` 형식을 따른다.

| 플랫폼 코드 | 도메인 코드 | 의미 |
|-------------|-------------|------|
| O (온트너) | A: 회원, B: 마이페이지, C: 캠페인, D: 성과, DM: DM관리 | 크리에이터 기능 |
| T (온트러스트) | A: 탐색/DM, B: 추천, C: 성과/리포트, D: 설정 | MD/관리자 기능 (DM 어드민 포함) |
| P (파트너) | A: 탐색, B: 추천, C: 성과/리포트 | 협력사 기능 |

### 4대 기능 도메인

| 도메인 | 화면 ID 범위 | 설명 |
|--------|-------------|------|
| **회원관리** | O-A-01, O-B-01~03, T-D-01 | 가입, 프로필, 계정 연계 |
| **캠페인 탐색 관리** | T-A-01~02, T-A-07~15, T-B-01, O-A-10, O-C-03~09, P-A-01~02, P-A-10, P-B-01 | 크리에이터/캠페인/콘텐츠 탐색, 추천, 북마크, 컨택 요청 |
| **성과 관리** | O-D-01~03, T-C-01~06, P-C-01~02 | 성과 조회, 인사이트 리포트 |
| **DM 관리** | T-A-03~06, T-A-05-1, A-A-01, O-DM-01 | DM 발송, 템플릿, 어드민, 크리에이터 자동DM |

### 핵심 용어

- **크리에이터**: 인스타그램/유튜브 인플루언서 (CJ 온스타일과 협업)
- **캠페인**: CJ가 운영하는 마케팅/판매 캠페인 (공동구매, 브랜드 협업 등)
- **어필리에이트/리워드 링크**: 크리에이터가 공유하는 성과 기반 수익 링크
- **공구 콘텐츠**: 공동구매 관련 인스타그램/유튜브 콘텐츠
- **크루찾기**: 팔로워 유사도 분석 기능 (베타)
- **인게이지먼트**: 좋아요, 댓글, 저장, 공유 등 콘텐츠 반응 지표
- **인게이지먼트 가중치**: 댓글 > 공유 > 저장/조회수 > 좋아요 > 팔로워 순 가중 점수
- **온트너 회원**: 온트너 플랫폼에 가입한 크리에이터 (전체 인플루언서의 일부)
- **배치 추천**: 1일 1회 주기로 사전 계산된 추천 결과 (실시간 연산 아님)
- **Fallback 로직**: 1순위 데이터 없을 시 차선 기준으로 순차 탐색하는 방식
- **D+14 확정 매출**: 캠페인 종료 후 14일 기준 취소/교환/반품 반영 최종 매출
- **컨택 요청**: MD가 크리에이터 탐색 후 내부 운영팀에 공식 컨택을 요청하는 워크플로우
- **에이전시 회원**: 복수의 크리에이터를 관리하는 MCN/에이전시 계정 (개인 크리에이터 회원과 구분)
- **대댓글 자동화 툴**: 소셜비즈 등 댓글 자동 생성 도구 (평균 댓글 수 옆에 사용 여부 표기)

### 인게이지먼트 가중치 점수 공식

크리에이터 탐색, 콘텐츠 랭킹, 추천 등에서 공통으로 사용하는 인게이지먼트 가중치 기반 스코어링:

| 지표 | 가중치 | 비고 |
|------|--------|------|
| 댓글 수 | 5.0 | 최우선 지표 |
| 공유 수 | 4.0 | |
| 저장 수 | 3.0 | |
| 조회수 | 2.0 | 릴스/피드 조회수 |
| 좋아요 수 | 1.5 | |
| 팔로워 수 | 0.01 | 보조 지표 |

- **정규화**: 0~100 범위로 정규화
- **기준 기간**: 최근 3개월 데이터
- **적용 화면**: T-A-01(크리에이터 탐색), T-A-09(콘텐츠 탐색), O-C-05(콘텐츠→캠페인), T-B-01(크리에이터 추천)

### 배치 추천 처리 스펙

- **실행 주기**: 1일 1회 (새벽 시간대 시뮬레이션)
- **대상**: 크리에이터 추천(T-B-01), 캠페인 추천(O-C-06)
- **Stale 데이터 규칙**: `updatedAt`이 24시간 이상 경과 시 UI에 "⚠ 데이터 업데이트 지연" 경고 배너 표시
- **UI 표시**: 모든 추천 결과에 "배치 업데이트: YYYY-MM-DD HH:mm" 표시
- **Mock 구현**: `updatedAt` 필드를 현재 시점 기준으로 생성하여 정상 상태 시뮬레이션

### D+14 확정 매출 상태 머신

| 상태 | 조건 | UI 표시 |
|------|------|---------|
| 진행중 | 캠페인 진행 중 | `confirmedRevenue = null`, 실시간 매출만 표시 |
| 정산 대기 | 캠페인 종료 후 D+0 ~ D+13 | `confirmedRevenue = null`, "정산 대기 (D+{N})" 뱃지 |
| 확정 | 캠페인 종료 후 D+14+ | `confirmedRevenue = number`, "확정" 뱃지, 취교반 반영 최종 매출 |

---

## 기술 스택

- **프레임워크**: Next.js (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **컴포넌트**: shadcn/ui
- **차트**: Recharts
- **상태관리**: React Context (또는 Zustand)
- **Mock 데이터**: JSON 파일 또는 인메모리
- **아이콘**: Lucide React

---

## 프로젝트 구조

```
src/
├── app/
│   ├── ontner/                    # 온트너 (크리에이터용)
│   │   ├── signup/                # O-A-01 회원가입
│   │   ├── mypage/                # O-B-01~03 프로필 관리
│   │   │   ├── account/           # 계정 및 계좌관리 (CJ 자체 - disabled)
│   │   │   └── terms/             # 약관/계약 관리 (CJ 자체 - disabled)
│   │   ├── campaign/
│   │   │   ├── explore/           # O-C-03 캠페인 탐색/추천
│   │   │   ├── [id]/              # O-C-04 캠페인 상세
│   │   │   ├── content/           # O-C-05 콘텐츠 탐색→캠페인 추천
│   │   │   ├── recommend/         # O-C-06 캠페인 추천 모듈
│   │   │   ├── counter-proposal/  # O-C-07 브랜드 역제안
│   │   │   ├── analysis/          # O-C-08 참여 캠페인 현황 분석 (NEW)
│   │   │   ├── collaboration/     # O-C-09 캠페인 협업 관리 (NEW)
│   │   │   └── saved/             # 캠페인 찜 리스트 (CJ 자체 - disabled)
│   │   ├── dm/
│   │   │   └── settings/          # O-DM-01 자동 DM 설정 (NEW)
│   │   ├── creators/
│   │   │   └── bookmarks/         # O-A-10 나의 관심 크리에이터
│   │   ├── crew-finder/           # T-A-07 팔로워 유사도 (온트너 1:1)
│   │   ├── performance/           # O-D-01 캠페인별 성과 조회
│   │   └── insight/
│   │       ├── campaign/          # O-D-02 인사이트 리포트 (캠페인)
│   │       └── affiliate/         # O-D-03 인사이트 리포트 (어필리에이트)
│   ├── ontrust/                   # 온트러스트 (MD용)
│   │   ├── creator/
│   │   │   ├── search/            # T-A-01 크리에이터 탐색
│   │   │   ├── [id]/              # T-A-02 크리에이터 상세 리포트
│   │   │   ├── content/           # T-A-09 콘텐츠→크리에이터 추천
│   │   │   ├── recommend/         # T-B-01 크리에이터 추천
│   │   │   ├── similarity/        # T-A-07 유사도 분석 + T-A-08 이력
│   │   │   └── bookmark/          # T-A-10~14 그룹관리
│   │   ├── campaign/
│   │   │   ├── new/               # 캠페인 등록/조회
│   │   │   ├── collaboration/     # 크리에이터 협업 센터
│   │   │   └── contact-requests/  # T-A-15 컨택 요청 관리 (NEW)
│   │   ├── dm/                    # T-A-03~06 DM 관리
│   │   │   ├── admin/             # A-A-01 DM 어드민 설정
│   │   │   └── templates/         # T-A-05 DM 템플릿 관리
│   │   ├── performance/           # T-C-01~02 성과 조회
│   │   ├── insight/               # T-C-03~06 인사이트 리포트
│   │   ├── product/
│   │   │   └── partners/          # 협력사관리
│   │   ├── partners/
│   │   │   └── api-services/      # 서비스 목록관리
│   │   └── settings/              # T-D-01 피처링 계정 연계
│   └── partner/                   # 파트너 (협력사용)
│       ├── creator/
│       │   ├── [id]/              # P-A-02 크리에이터 상세
│       │   ├── recommend/         # P-B-01 크리에이터 추천 (NEW)
│       │   └── bookmark/          # P-A-10 관심 크리에이터 관리 (NEW)
│       ├── insight/               # P-C-01 인사이트 리포트
│       └── performance/           # P-C-02 캠페인별 성과 조회
├── components/
│   ├── ui/                        # shadcn/ui 기본 컴포넌트
│   ├── ontner/                    # 온트너 전용 컴포넌트
│   ├── ontrust/                   # 온트러스트 전용 컴포넌트
│   ├── partner/                   # 파트너 전용 컴포넌트
│   └── shared/                    # 공통 컴포넌트 (차트, 리포트, 테이블 등)
├── data/
│   └── mock/                      # Mock 데이터 (JSON)
├── types/                         # TypeScript 타입 정의
├── lib/                           # 유틸리티
└── hooks/                         # 커스텀 훅
```

### 공유 컴포넌트 레지스트리

플랫폼 간 재사용하는 공통 컴포넌트:

| 컴포넌트 | 사용 화면 | 설명 |
|----------|----------|------|
| content-ranking-feed | O-C-05, T-A-09 | 인게이지먼트 기반 콘텐츠 랭킹 피드 |
| performance-three-part-view | O-D-01, T-C-01, P-C-02 | 통합Summary + 콘텐츠상세 + 매출상세 3파트 뷰 |
| creator-bookmark-manager | T-A-10~14, O-A-10, P-A-10 | 크리에이터 그룹 관리 (CRUD, 500명 한도) |
| insight-report-shell | O-D-02~03, T-C-03~06, P-C-01 | 기간 설정 조회형 인사이트 리포트 프레임 |

---

## 플랫폼별 화면 상세 스펙

각 플랫폼의 화면 상세 스펙은 별도 문서를 참조한다. **해당 플랫폼 개발 시에만 참조할 것.**

| 문서 | 플랫폼 | 화면 수 | 설명 |
|------|--------|---------|------|
| **[ontner.md](ontner.md)** | 온트너 (O) | 16개 | 회원가입, 마이페이지, 캠페인 탐색/추천/분석, 자동DM, 성과 조회, 인사이트 리포트 |
| **[ontrust-partner.md](ontrust-partner.md)** | 온트러스트 (T) + 파트너 (P) | 30개 | 크리에이터 탐색/추천, 컨택 요청, DM 관리, 성과 조회, 인사이트 리포트, 계정 연계 |

### 전체 화면 ID 요약

**온트너 (O):** O-A-01, O-A-10, O-B-01~03, O-C-03~09, O-DM-01, O-D-01~03
**온트러스트 (T):** T-A-01~02, T-A-03~06, T-A-07~08, T-A-09~15, T-B-01, T-C-01~06, T-D-01, A-A-01
**파트너 (P):** P-A-01~02, P-A-10, P-B-01, P-C-01~02

---

## Mock 데이터 설계

### 크리에이터 (creators.json)
```typescript
interface Creator {
  id: string;
  handle: string;           // 인스타그램 핸들
  youtubeHandle?: string;
  name: string;
  profileImage: string;
  followers: number;
  engagementRate: number;
  category: string[];       // ["뷰티", "패션"]
  isOntnerMember: boolean;
  salesPrice?: number;      // 세일즈 단가 (일부만 존재)
  desiredCategory?: string;
  desiredRate?: number;     // 희망 단가
  introduction?: string;
  campaigns: string[];      // 참여 캠페인 ID 목록
  tier: "GOLD" | "SILVER" | "BRONZE";
  ontnerCampaignCount: number;  // 온트너 누적 캠페인 수
  memberType: "individual" | "agency";  // 개인 크리에이터 vs 에이전시
  contactEmail?: string;    // 컨택 가능 공식 이메일 (프로필 파싱)
  autoReplyToolUsed?: boolean;  // 대댓글 자동화 툴(소셜비즈 등) 사용 여부
}
```

### 캠페인 (campaigns.json)
```typescript
interface Campaign {
  id: string;
  name: string;
  brand: string;
  brandCategory: string;
  status: "모집중" | "진행중" | "완료" | "제안";
  startDate: string;
  endDate: string;
  reward: string;
  description: string;
  contentCount: number;
  creators: string[];       // 참여 크리에이터 ID 목록
}
```

### 콘텐츠 (contents.json)
```typescript
interface Content {
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
  views: number;
  engagementScore: number;
  category: string;
  postedAt: string;
  trackingData: TrackingPoint[];
}

interface TrackingPoint {
  timestamp: string;
  likes: number;
  comments: number;
  saves: number;
  views: number;
}
```

### 콘텐츠 랭킹 (content-rankings.json)
```typescript
interface ContentRanking {
  id: string;
  contentId: string;
  rank: number;
  engagementScore: number;   // 가중치 기반 점수
  category: string;
  period: "1w" | "1m" | "3m" | "6m";
  relatedCampaigns: string[];  // 매핑된 캠페인 ID
  relatedCreatorInfo: {
    creatorId: string;
    isOntnerMember: boolean;
  };
}
```

### 추천 결과 (recommendations.json)
```typescript
interface CampaignRecommendation {
  creatorId: string;
  theme: "성과기반" | "고객리텐션" | "유사크리에이터";
  campaigns: {
    campaignId: string;
    score: number;
    reason: string;
  }[];
  updatedAt: string;
}

interface CreatorRecommendation {
  campaignId: string;
  creators: {
    creatorId: string;
    score: number;              // 인게이지먼트 60% + 매출 40%
    engagementScore: number;
    salesScore: number;
    reason: "카테고리일치" | "브랜드유사" | "공구진행";
  }[];
  updatedAt: string;
}
```

### 팔로워 유사도 (similarity.json)
```typescript
interface SimilarityResult {
  creatorA: string;
  creatorB: string;
  matchRate: number;        // 0-100%
  analyzedAt: string;
  validUntil: string;       // 6개월 유효
  segmentA?: AudienceSegment;
  segmentB?: AudienceSegment;
}

interface AudienceSegment {
  gender: { male: number; female: number };
  ageGroups: { range: string; percentage: number }[];
}

interface SimilarityConfig {
  maxComparisons: {
    ontrust: number;         // 최대 5명
    ontner: number;          // 1:1만
  };
  tierLimits: {
    tier: string;
    dailyLimit: number;
  }[];
}
```

### 크리에이터 그룹 (creator-groups.json)
```typescript
interface CreatorGroup {
  id: string;
  name: string;
  ownerId: string;           // 생성한 MD ID
  creatorIds: string[];      // 최대 500명
  createdAt: string;
  updatedAt: string;
}
```

### DM (dm-templates.json, dm-history.json)
```typescript
interface DmTemplate {
  id: string;
  name: string;
  content: string;           // 변수 포함 ({크리에이터명}, {캠페인명}, {링크})
  type: "가입제안" | "캠페인제안" | "일반";
  createdAt: string;
}

interface DmHistory {
  id: string;
  templateId: string;
  senderId: string;
  recipientCreatorId: string;
  sentAt: string;
  status: "발송" | "읽음" | "실패";
  campaignId?: string;
}
```

### 성과 데이터 (performance.json)
```typescript
interface PerformanceDetail {
  campaignId: string;
  creatorId: string;
  summary: {
    totalRevenue: number;
    confirmedRevenue?: number;  // D+14 확정 매출
    totalOrders: number;
    contentCount: number;
    conversionRate: number;
  };
  hourlyOrders: { hour: string; orders: number; revenue: number }[];
  customerSegment: {
    ageGroups: { range: string; count: number }[];
    gender: { male: number; female: number };
  };
  topProducts: { productId: string; name: string; orders: number }[];
  cancelReturnRate: number;
  cancelReasons: { reason: string; count: number }[];
}
```

### 리텐션 분석 (retention.json)
```typescript
interface RetentionAnalysis {
  creatorId: string;
  period: string;
  campaignRetention: {
    fromCampaignId: string;
    toCampaignId: string;
    retentionRate: number;
  }[];
  topRepurchaseBrands: {
    brand: string;
    repurchaseRate: number;
  }[];
  repurchaseCycle: {
    productCategory: string;
    avgDays: number;
  }[];
}
```

### 컨택 요청 (contact-requests.json)
```typescript
interface ContactRequest {
  id: string;
  mdId: string;                // 요청한 MD ID
  creatorId: string;
  campaignId?: string;         // 관련 캠페인 (선택)
  requestType: "캠페인참여" | "가입제안" | "가입+캠페인";
  status: "대기" | "처리중" | "완료" | "반려";
  assignedTo?: string;         // 처리 담당자 ID
  note?: string;               // 요청 메모
  channel: "DM" | "이메일" | "전화";
  createdAt: string;
  processedAt?: string;
}
```

### 자동 DM 설정 (auto-dm-config.json)
```typescript
interface AutoDmConfig {
  id: string;
  creatorId: string;
  enabled: boolean;
  triggerConditions: {
    type: "캠페인참여" | "신규팔로워" | "댓글반응" | "일정시간";
    value: string;
  }[];
  templateId: string;          // 사용할 DM 템플릿
  scheduleType: "즉시" | "예약";
  timeSlots?: string[];        // 발송 가능 시간대 ["09:00-12:00", "14:00-18:00"]
  createdAt: string;
  updatedAt: string;
}
```

---

## UI/UX 가이드라인

### 공통
- 한국어 UI (모든 텍스트 한국어)
- 반응형 레이아웃 (데스크톱 우선)
- shadcn/ui 컴포넌트를 기본으로 사용
- 차트는 Recharts로 통일
- 온트너/온트러스트/파트너는 같은 앱 내 라우팅으로 구분하되, 각각 독립적인 레이아웃을 가진다

### 플랫폼별 UI/UX 및 네비게이션
- **온트너**: [ontner.md](ontner.md) 하단 UI/UX 가이드라인 참조
- **온트러스트 + 파트너**: [ontrust-partner.md](ontrust-partner.md) 하단 UI/UX 가이드라인 참조

---

## R&R (역할 분담)

| 영역 | CJ 단독 | 피처링 단독 | CJ+피처링 협업 |
|------|---------|------------|--------------|
| 회원가입 (O-A-01) | O | - | - |
| 동의 프로세스 (R009) | O | - | - |
| 프로필 관리 (O-B-01~03) | - | - | O (CJ: API, 피처링: 기획/화면) |
| 계정 연계 (T-D-01) | - | - | O |
| 크리에이터 탐색 (T-A-01~02) | - | - | O |
| 콘텐츠 탐색 (T-A-09, O-C-05) | - | - | O |
| 크리에이터 추천 (T-B-01) | - | O | - |
| 그룹관리 (T-A-10~14) | - | O | - |
| 캠페인 추천 (O-C-06) | - | - | O |
| 컨택 요청 관리 (T-A-15) | - | - | O |
| 팔로워 유사도 (T-A-07~08) | - | O | - |
| 자동 DM 설정 (O-DM-01) | - | O | - |
| 파트너 크리에이터 (P-A-01~02, P-B-01, P-A-10) | - | - | O |
| 브랜드 역제안 (O-C-07) | UI | API | - |
| 성과 조회 (O-D-01, T-C-01~02) | - | - | O |
| 인사이트 리포트 (O-D-02~03, T-C-03~06) | - | - | O |
| DM (T-A-03~06) | - | O | - |
| DM 어드민 (A-A-01) | - | - | O |

---

## 미결 사항

| # | 항목 | 선택지 | 관련 화면 |
|---|------|--------|----------|
| 1 | 콘텐츠 카테고리 분류 비용 | 피처링 자체 분류 (추가 비용) | T-A-09, O-C-05 |
| 2 | 콘텐츠 트래킹 비용 구조 | [A] D+0 시간단위 + D+1~ 일단위 (120원/회) vs [B] 전구간 일단위 | O-D-01, T-C-01 |
| 3 | 추천-탐색 메뉴 구조 | [A] 추천/탐색 별도 메뉴 vs [B] 탐색 내 추천 탭 | T-B-01 |
| 4 | 추천 가중치 비율 확정 | 현재: 인게이지먼트 60% + 매출 40% | T-B-01 |
| 5 | 리텐션 집계 기간 기준 | CJ 데이터팀 협의 필요 | O-D-02, T-C-06 |
| 6 | 수집 실패 시 보정 정책 | [A] 직전 데이터 유지 vs [B] 평균값/중앙값 | O-D-01 |
| 7 | 성과 조회 메뉴 구성 방향 | 기존 실시간 주문현황 메뉴 고도화 vs 별도 메뉴 신설 | T-C-01 |
| 8 | 피처링 계정 연계 방식 | [A] 이메일 자동연동 vs [B] 엑셀 업로드 vs [C] 수동 등록 | T-D-01 |

---

## 구현 우선순위

### Phase 1 (핵심)
1. 프로젝트 셋업 + 공통 레이아웃/내비게이션
2. Mock 데이터 생성
3. T-A-01: 크리에이터 탐색 (최우선)
4. T-A-02: 크리에이터 상세 리포트
5. T-A-07~08: 팔로워 유사도 분석 (핵심 기능)
6. O-C-03: 캠페인 탐색/추천

### Phase 2 (주요)
7. T-B-01: 크리에이터 추천
8. T-A-09: 콘텐츠 탐색 → 크리에이터 추천
9. O-C-05: 콘텐츠 탐색을 통한 캠페인 추천
10. O-C-06: 캠페인 추천 모듈
11. T-A-03~06: DM 관리
12. O-D-01: 캠페인별 성과 조회
13. T-C-01~02: 성과 조회 (온트러스트)
14. T-A-15: 컨택 요청 관리 (NEW)

### Phase 3 (보조)
15. O-D-02~03: 인사이트 리포트 (온트너)
16. T-C-03~06: 인사이트 리포트 (온트러스트)
17. T-A-10~14: 관심 크리에이터 관리
18. O-B-01~03: 마이페이지
19. O-C-04: 캠페인 상세
20. O-C-07: 브랜드 역제안
21. T-D-01: 피처링 계정 연계
22. O-A-01: 회원가입
23. A-A-01: DM 어드민 설정
24. P-C-01: 파트너 인사이트 리포트
25. O-A-10: 나의 관심 크리에이터
26. O-C-08: 참여 캠페인 현황 분석 (NEW)
27. O-C-09: 캠페인 협업 관리 (NEW)
28. O-DM-01: 자동 DM 설정 (NEW)
29. P-A-01~02: 파트너 크리에이터 탐색/상세 (NEW)
30. P-B-01: 파트너 크리에이터 추천 (NEW)
31. P-A-10: 파트너 관심 크리에이터 관리 (NEW)
32. P-C-02: 파트너 캠페인별 성과 조회 (NEW)

---

## 주의사항

- 모든 데이터는 Mock이다. API 호출 시뮬레이션은 `setTimeout`으로 딜레이만 넣는다.
- "불가" 표시된 필터(세일즈 단가, 온트너 회원 필터링)는 UI에 넣되, 비활성화 상태 + 툴팁으로 "데이터 미제공" 안내를 표시한다.
- 추천 알고리즘 결과는 Mock 데이터에서 미리 계산된 값으로 표시한다. 실제 ML 로직은 구현하지 않는다.
- 크루찾기(팔로워 유사도)의 "분석 중" 상태를 반드시 구현한다 (배치 처리 시뮬레이션).
- 인사이트 리포트에서 AI 텍스트 생성은 제외한다. 고정 텍스트 템플릿에 숫자만 동적으로 바인딩한다.
- 콘텐츠 트래킹 데이터는 시간대별 Mock 데이터를 생성하여 차트로 표시한다.
- 댓글 키워드 워드 클라우드는 Mock 키워드 빈도 데이터로 구현한다.
- 온트너/온트러스트/파트너/어드민은 같은 앱 내 라우팅으로 구분하되, 각각 독립적인 레이아웃을 가진다.
- 캠페인 상세(O-C-04)의 연관 콘텐츠 Fallback 로직을 반드시 구현한다 (상품→브랜드→소분류→숨김).
- 캠페인별 성과 조회에서 D+14 확정 매출 상태를 표시한다 (진행중 vs 확정 구분 UI).
- 캠페인 추천 모듈(O-C-06)은 쇼핑몰식 가로 롤링 UI로 구현한다 (3테마 각각 독립 캐러셀).
- 파트너 플랫폼은 온트너 회원 크리에이터만 검색 가능하도록 데이터 필터링을 적용한다.
- 브랜드 역제안(O-C-07)은 피처링 API 응답 Mock으로만 구현하고 CJ UI 영역은 기본 레이아웃만 구현한다.
