"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDashed,
  Bookmark,
  Send,
  Megaphone,
  GitCompare,
  AlertTriangle,
  Instagram,
  Youtube,
  Heart,
  MessageSquare,
  Bookmark as BookmarkIcon,
  Eye,
  Share2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { PageHeader } from "@/components/layout/page-header";
import { OtrTierBadge, OtrToolbar } from "@/components/ontrust";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import rawCreators from "@/data/mock/creators.json";
import rawCampaigns from "@/data/mock/campaigns.json";
import rawContents from "@/data/mock/contents.json";

// ─── 타입 ───────────────────────────────────────────────
type TierLevel = "GOLD" | "SILVER" | "BRONZE";
const TIER_MAP: Record<TierLevel, "purple" | "green" | "blue"> = {
  GOLD: "purple",
  SILVER: "green",
  BRONZE: "blue",
};

interface MockCreator {
  id: string;
  handle: string;
  youtubeHandle?: string;
  name: string;
  followers: number;
  engagementRate: number;
  category: string[];
  isOntnerMember: boolean;
  salesPrice?: number;
  campaigns: string[];
  tier: TierLevel;
  introduction?: string;
  desiredCategory?: string;
  desiredRate?: number;
}

interface MockCampaign {
  id: string;
  name: string;
  brand: string;
  brandCategory: string;
  status: string;
  startDate: string;
  endDate: string;
  reward: string;
  creators: string[];
}

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}천`;
  return n.toLocaleString("ko-KR");
}

// ── 오디언스 Mock 데이터 (크리에이터별로 약간 다르게)
function getAudienceData(creatorId: string) {
  const seed = parseInt(creatorId.replace("creator-", ""), 10) || 1;
  const base = seed * 7;
  return {
    gender: [
      { label: "여성 18-24", value: 18 + (base % 10) },
      { label: "여성 25-34", value: 30 + (base % 8) },
      { label: "여성 35-44", value: 14 + (base % 6) },
      { label: "남성 18-24", value: 8 + (base % 5) },
      { label: "남성 25-34", value: 12 + (base % 4) },
      { label: "남성 35-44", value: 5 + (base % 3) },
    ],
    region: [
      { region: "서울", ratio: 35 + (base % 8) },
      { region: "경기", ratio: 20 + (base % 6) },
      { region: "부산", ratio: 8 + (base % 4) },
      { region: "대구", ratio: 5 + (base % 3) },
      { region: "인천", ratio: 6 + (base % 3) },
      { region: "기타", ratio: 20 },
    ],
    engagementTrend: [
      { week: "2월 1주", rate: 3.8 + (base % 3) * 0.4 },
      { week: "2월 2주", rate: 4.1 + (base % 2) * 0.5 },
      { week: "2월 3주", rate: 3.6 + (base % 4) * 0.3 },
      { week: "2월 4주", rate: 4.5 + (base % 3) * 0.4 },
      { week: "3월 1주", rate: 4.8 + (base % 2) * 0.6 },
      { week: "3월 2주", rate: 4.2 + (base % 3) * 0.3 },
    ],
  };
}

const STATUS_LABELS: Record<string, string> = {
  모집중: "모집중",
  진행중: "진행중",
  완료: "완료",
  제안: "제안",
};

const STATUS_COLORS: Record<string, string> = {
  모집중: "bg-blue-100 text-blue-700",
  진행중: "bg-green-100 text-green-700",
  완료: "bg-gray-100 text-gray-600",
  제안: "bg-purple-100 text-purple-700",
};

// ─── 메인 컴포넌트 ────────────────────────────────────────
export default function CreatorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const creator = useMemo(
    () => (rawCreators as MockCreator[]).find((c) => c.id === id) ?? null,
    [id]
  );

  const creatorCampaigns = useMemo(
    () =>
      (rawCampaigns as MockCampaign[]).filter((c) =>
        creator?.campaigns.includes(c.id)
      ),
    [creator]
  );

  const creatorContents = useMemo(
    () => rawContents.filter((c) => c.creatorId === id).slice(0, 5),
    [id]
  );

  const audience = useMemo(() => getAudienceData(id), [id]);

  if (!creator) {
    return (
      <>
        <PageHeader title="크리에이터 상세" description="크리에이터를 찾을 수 없습니다" />
        <main className="flex-1 p-6">
          <p className="text-muted-foreground text-sm">
            해당 크리에이터를 찾을 수 없습니다.{" "}
            <Link href="/ontrust/creator/search" className="underline text-primary">
              탐색 화면으로 돌아가기
            </Link>
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`${creator.name} 크리에이터 상세 리포트`}
        description={`T-A-02 · @${creator.handle} · 피처링 + 온트너 통합 정보`}
      />

      <main className="flex-1 p-4 space-y-4">
        {/* 상단 내비게이션 */}
        <div className="flex items-center justify-between">
          <button
            className="otr-btn-toolbar flex items-center gap-1.5"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            목록으로
          </button>
          <div className="flex items-center gap-2">
            <Link href={`/ontrust/creator/similarity?ids=${creator.id}`}>
              <button className="otr-btn-toolbar flex items-center gap-1.5">
                <GitCompare className="w-3.5 h-3.5" />
                유사도 분석
              </button>
            </Link>
            <button className="otr-btn-toolbar flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" />
              북마크
            </button>
            <button className="otr-btn-toolbar flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              DM 발송
            </button>
            <button className="otr-btn-primary flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5" />
              캠페인 제안
            </button>
          </div>
        </div>

        {/* ── 프로필 헤더 ── */}
        <div
          style={{
            border: "1px solid var(--otr-border)",
            background: "#fff",
            borderRadius: 4,
            padding: "16px 20px",
          }}
        >
          <div className="flex items-start gap-4">
            {/* 아바타 */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--otr-accent-purple-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 700,
                color: "var(--otr-accent-purple)",
                flexShrink: 0,
                border: "2px solid var(--otr-accent-purple)",
              }}
            >
              {creator.name.charAt(0)}
            </div>

            {/* 정보 */}
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <span style={{ fontSize: 18, fontWeight: 700, color: "var(--otr-text-primary)" }}>
                  {creator.name}
                </span>
                <OtrTierBadge tier={TIER_MAP[creator.tier]} />
                {creator.isOntnerMember ? (
                  <span
                    className="flex items-center gap-1"
                    style={{
                      background: "#dcfce7",
                      color: "#15803d",
                      border: "1px solid #86efac",
                      borderRadius: 4,
                      padding: "1px 6px",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    <CheckCircle2 style={{ width: 11, height: 11 }} />
                    온트너 회원
                  </span>
                ) : (
                  <span
                    className="flex items-center gap-1"
                    style={{
                      background: "#f5f5f5",
                      color: "#888",
                      border: "1px solid #e0e0e0",
                      borderRadius: 4,
                      padding: "1px 6px",
                      fontSize: 11,
                    }}
                  >
                    <CircleDashed style={{ width: 11, height: 11 }} />
                    온트너 비회원
                  </span>
                )}
              </div>

              {/* 핸들 + 플랫폼 */}
              <div className="flex items-center gap-3 mb-3" style={{ fontSize: 12, color: "var(--otr-text-secondary)" }}>
                <span className="flex items-center gap-1">
                  <Instagram style={{ width: 12, height: 12, color: "#e1306c" }} />
                  @{creator.handle}
                </span>
                {creator.youtubeHandle && (
                  <span className="flex items-center gap-1">
                    <Youtube style={{ width: 12, height: 12, color: "#ff0000" }} />
                    @{creator.youtubeHandle}
                  </span>
                )}
              </div>

              {/* KPI 지표 */}
              <div className="flex flex-wrap gap-6">
                {[
                  { label: "팔로워", value: formatNumber(creator.followers) },
                  { label: "인게이지먼트율", value: `${creator.engagementRate}%` },
                  { label: "CJ 캠페인 참여", value: `${creator.campaigns.length}회` },
                  { label: "세일즈 단가", value: creator.salesPrice ? `${(creator.salesPrice / 10000).toFixed(0)}만원` : "—" },
                  { label: "희망 단가", value: creator.desiredRate ? `${(creator.desiredRate / 10000).toFixed(0)}만원` : "—" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, color: "var(--otr-text-secondary)", marginBottom: 2 }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--otr-text-primary)" }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 카테고리 + 소개 */}
            <div style={{ width: 220, flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: "var(--otr-text-secondary)", marginBottom: 4 }}>
                주요 카테고리
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {creator.category.map((cat) => (
                  <span key={cat} className="otr-badge otr-badge-blue">{cat}</span>
                ))}
              </div>
              {creator.introduction && (
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--otr-text-secondary)",
                    lineHeight: 1.6,
                    borderTop: "1px solid var(--otr-border)",
                    paddingTop: 8,
                  }}
                >
                  {creator.introduction}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 오디언스 분석 ── */}
        <div style={{ borderTop: "2px solid var(--otr-accent-purple)", paddingTop: 2 }}>
          <div
            className="otr-section-marker"
            style={{ fontSize: 12, fontWeight: 600, padding: "6px 0 8px" }}
          >
            오디언스 분석
          </div>

          <div
            style={{
              display: "flex",
              gap: 1,
              border: "1px solid var(--otr-border)",
              background: "#fff",
            }}
          >
            {/* 성별/연령 */}
            <div style={{ flex: 1, padding: 16, borderRight: "1px solid var(--otr-border)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--otr-text-primary)", marginBottom: 8 }}>
                성별/연령대 분포
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={audience.gender} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 45]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="label" width={80} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Bar dataKey="value" fill="var(--otr-accent-purple)" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 지역 */}
            <div style={{ flex: 1, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--otr-text-primary)", marginBottom: 8 }}>
                지역 분포
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={audience.region} margin={{ bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Bar dataKey="ratio" fill="var(--otr-accent-purple)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "#b45309",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: 4,
              padding: "6px 10px",
              marginTop: 4,
            }}
          >
            <AlertTriangle style={{ width: 12, height: 12, flexShrink: 0 }} />
            콘텐츠 반응 기준 예측 데이터 (실제 팔로워 기준과 다를 수 있음)
          </div>
        </div>

        {/* ── 인게이지먼트 추이 ── */}
        <div style={{ borderTop: "2px solid var(--otr-accent-purple)", paddingTop: 2 }}>
          <div
            className="otr-section-marker"
            style={{ fontSize: 12, fontWeight: 600, padding: "6px 0 8px" }}
          >
            콘텐츠 인게이지먼트
          </div>

          <div
            style={{
              border: "1px solid var(--otr-border)",
              background: "#fff",
              padding: 16,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: "var(--otr-text-primary)" }}>
              평균 인게이지먼트율 추이 (최근 6주)
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={audience.engagementTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} domain={[0, 8]} />
                <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--otr-accent-purple)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="인게이지먼트율"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 최근 콘텐츠 목록 */}
          {creatorContents.length > 0 && (
            <div style={{ marginTop: 4 }}>
              <table>
                <thead>
                  <tr>
                    <th>콘텐츠 유형</th>
                    <th>플랫폼</th>
                    <th style={{ textAlign: "right" }}>좋아요</th>
                    <th style={{ textAlign: "right" }}>댓글</th>
                    <th style={{ textAlign: "right" }}>저장</th>
                    <th style={{ textAlign: "right" }}>공유</th>
                    <th style={{ textAlign: "right" }}>참여 점수</th>
                    <th>게시일</th>
                  </tr>
                </thead>
                <tbody>
                  {creatorContents.map((content) => (
                    <tr key={content.id}>
                      <td>
                        <span className="otr-badge otr-badge-purple">{content.type}</span>
                      </td>
                      <td>
                        {content.platform === "instagram" ? (
                          <span className="flex items-center gap-1 text-xs">
                            <Instagram style={{ width: 11, height: 11, color: "#e1306c" }} />
                            인스타그램
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs">
                            <Youtube style={{ width: 11, height: 11, color: "#ff0000" }} />
                            유튜브
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>{formatNumber(content.likes)}</td>
                      <td style={{ textAlign: "right" }}>{formatNumber(content.comments)}</td>
                      <td style={{ textAlign: "right" }}>{formatNumber(content.saves)}</td>
                      <td style={{ textAlign: "right" }}>{formatNumber(content.shares ?? 0)}</td>
                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: 700,
                          color: "var(--otr-accent-purple)",
                        }}
                      >
                        {content.engagementScore.toFixed(1)}
                      </td>
                      <td style={{ color: "var(--otr-text-secondary)" }}>
                        {new Date(content.postedAt).toLocaleDateString("ko-KR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── 캠페인 이력 ── */}
        <div style={{ borderTop: "2px solid var(--otr-accent-purple)", paddingTop: 2 }}>
          <div
            className="otr-section-marker"
            style={{ fontSize: 12, fontWeight: 600, padding: "6px 0 8px" }}
          >
            CJ 온트너 캠페인 이력
          </div>

          {creatorCampaigns.length === 0 ? (
            <div
              style={{
                border: "1px solid var(--otr-border)",
                background: "#fff",
                padding: "24px",
                textAlign: "center",
                color: "var(--otr-text-secondary)",
                fontSize: 12,
              }}
            >
              캠페인 이력이 없습니다.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>캠페인명</th>
                  <th>브랜드</th>
                  <th>카테고리</th>
                  <th style={{ textAlign: "center" }}>상태</th>
                  <th>보상</th>
                  <th>기간</th>
                </tr>
              </thead>
              <tbody>
                {creatorCampaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td style={{ fontWeight: 600 }}>{campaign.name}</td>
                    <td>{campaign.brand}</td>
                    <td>
                      <span className="otr-badge otr-badge-blue">{campaign.brandCategory}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          padding: "1px 8px",
                          borderRadius: 10,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                        className={STATUS_COLORS[campaign.status] ?? "bg-gray-100 text-gray-600"}
                      >
                        {STATUS_LABELS[campaign.status] ?? campaign.status}
                      </span>
                    </td>
                    <td style={{ color: "var(--otr-text-secondary)", fontSize: 11 }}>
                      {campaign.reward}
                    </td>
                    <td style={{ color: "var(--otr-text-secondary)", fontSize: 11 }}>
                      {campaign.startDate} ~ {campaign.endDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── 하단 액션 ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            paddingTop: 8,
            borderTop: "1px solid var(--otr-border)",
          }}
        >
          <Link href={`/ontrust/creator/similarity?ids=${creator.id}`}>
            <button className="otr-btn-toolbar flex items-center gap-1.5">
              <GitCompare className="w-3.5 h-3.5" />
              유사도 분석
            </button>
          </Link>
          <button className="otr-btn-toolbar flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5" />
            북마크에 추가
          </button>
          <button className="otr-btn-toolbar flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" />
            DM 발송
          </button>
          {creator.isOntnerMember ? (
            <button className="otr-btn-primary flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5" />
              캠페인 참여 제안
            </button>
          ) : (
            <button className="otr-btn-primary flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5" />
              온트너 가입 + 캠페인 제안
            </button>
          )}
        </div>
      </main>
    </>
  );
}
