"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  CircleDashed,
  Instagram,
  Youtube,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { OtrToolbar, OtrTierBadge, OtrSearchPanel, OtrFormGrid, OtrFormField } from "@/components/ontrust";
import rawCreators from "@/data/mock/creators.json";
import rawCampaigns from "@/data/mock/campaigns.json";
import rawRecommendations from "@/data/mock/recommendations.json";

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
}

interface MockCampaign {
  id: string;
  name: string;
  brand: string;
  brandCategory: string;
  status: string;
}

interface CreatorRec {
  creatorId: string;
  score: number;
  reason: string;
}

interface MockRecommendation {
  campaignId: string;
  creators: CreatorRec[];
  updatedAt: string;
}

const CREATORS = rawCreators as MockCreator[];
const CAMPAIGNS = rawCampaigns as MockCampaign[];
const RECOMMENDATIONS = rawRecommendations as MockRecommendation[];

function getCreator(id: string) {
  return CREATORS.find((c) => c.id === id);
}

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString("ko-KR");
}

// 추천 점수에서 인게이지먼트/매출 분리 (60/40 배분 시뮬레이션)
function splitScore(score: number) {
  const eng = parseFloat((score * 0.6).toFixed(1));
  const sales = parseFloat((score * 0.4).toFixed(1));
  return { eng, sales };
}

const REASON_MAP: Record<string, { label: string; badge: string }> = {
  성과유사: { label: "성과 유사", badge: "otr-badge-purple" },
  카테고리유사: { label: "카테고리 유사", badge: "otr-badge-blue" },
  구매기반: { label: "구매 기반", badge: "otr-badge-green" },
};

const BATCH_DATE = "2026-03-14";

// ─── 메인 컴포넌트 ────────────────────────────────────────
export default function CreatorRecommendPage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState(CAMPAIGNS[0]?.id ?? "");
  const [proposing, setProposing] = useState<string | null>(null);

  const recommendation = useMemo(
    () => RECOMMENDATIONS.find((r) => r.campaignId === selectedCampaignId) ?? RECOMMENDATIONS[0] ?? null,
    [selectedCampaignId]
  );

  const selectedCampaign = CAMPAIGNS.find((c) => c.id === selectedCampaignId);
  const topCreators = recommendation?.creators?.slice(0, 10) ?? [];

  function handlePropose(creatorId: string) {
    setProposing(creatorId);
    setTimeout(() => setProposing(null), 1500);
  }

  return (
    <>
      <PageHeader
        title="크리에이터 추천"
        description="T-B-01 · 캠페인 기반 최적 크리에이터 Top 10 자동 추천 (인게이지먼트 60% + 매출 실적 40%)"
      />

      <main className="flex-1 p-4 space-y-3">
        {/* ── 캠페인 선택 패널 ── */}
        <OtrSearchPanel>
          <OtrFormGrid columns={3}>
            <OtrFormField label="캠페인 선택" required span={2}>
              <select
                className="w-full"
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
              >
                {CAMPAIGNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.brandCategory}] {c.name} ({c.brand}) — {c.status}
                  </option>
                ))}
              </select>
            </OtrFormField>

            <OtrFormField label="배치 업데이트">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <RefreshCw className="w-3 h-3" />
                {BATCH_DATE}
                <span className="text-[10px] text-muted-foreground ml-1">(1일 1회 자동 갱신)</span>
              </div>
            </OtrFormField>
          </OtrFormGrid>
        </OtrSearchPanel>

        {/* ── 결과 툴바 ── */}
        <OtrToolbar
          leftContent={
            selectedCampaign ? (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: "var(--otr-accent-purple)" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--otr-text-primary)" }}>
                  [{selectedCampaign.brandCategory}] {selectedCampaign.name}
                </span>
                <span className="otr-badge otr-badge-blue">{selectedCampaign.brand}</span>
                <span style={{ fontSize: 11, color: "var(--otr-text-secondary)" }}>
                  · 추천 크리에이터 TOP {topCreators.length}
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground text-xs">캠페인을 선택하세요</span>
            )
          }
        >
          <Link href={`/ontrust/creator/search?campaign=${selectedCampaignId}`}>
            <button className="otr-btn-toolbar flex items-center gap-1.5">
              추천 조건으로 탐색
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </OtrToolbar>

        {/* ── 추천 결과 테이블 ── */}
        {topCreators.length === 0 ? (
          <div
            style={{
              border: "1px solid var(--otr-border)",
              background: "#fff",
              padding: "40px",
              textAlign: "center",
              color: "var(--otr-text-secondary)",
              fontSize: 13,
            }}
          >
            해당 캠페인에 대한 추천 데이터가 없습니다.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: 44, textAlign: "center" }}>순위</th>
                <th>크리에이터</th>
                <th style={{ width: 80, textAlign: "center" }}>플랫폼</th>
                <th style={{ width: 160 }}>카테고리</th>
                <th style={{ width: 80, textAlign: "right" }}>팔로워</th>
                <th style={{ width: 80, textAlign: "right" }}>참여율</th>
                <th style={{ width: 80, textAlign: "center" }}>등급</th>
                <th style={{ width: 100, textAlign: "right" }}>추천 점수</th>
                <th style={{ width: 90, textAlign: "right" }}>인게이지 ×60%</th>
                <th style={{ width: 90, textAlign: "right" }}>매출 ×40%</th>
                <th style={{ width: 120 }}>추천 사유</th>
                <th style={{ width: 70, textAlign: "center" }}>온트너</th>
                <th style={{ width: 80, textAlign: "center" }}>액션</th>
              </tr>
            </thead>
            <tbody>
              {topCreators.map((rec, idx) => {
                const creator = getCreator(rec.creatorId);
                if (!creator) return null;
                const reasonInfo = REASON_MAP[rec.reason] ?? { label: rec.reason, badge: "otr-badge-blue" };
                const { eng, sales } = splitScore(rec.score);
                return (
                  <tr key={rec.creatorId}>
                    {/* 순위 */}
                    <td style={{ textAlign: "center" }}>
                      {idx < 3 ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: ["#7c3aed", "#a78bfa", "#c4b5fd"][idx],
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {idx + 1}
                        </span>
                      ) : (
                        <span style={{ color: "var(--otr-text-secondary)", fontSize: 12 }}>{idx + 1}</span>
                      )}
                    </td>
                    {/* 크리에이터 */}
                    <td>
                      <Link
                        href={`/ontrust/creator/${creator.id}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            background: "var(--otr-accent-purple-light)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            fontWeight: 700,
                            color: "var(--otr-accent-purple)",
                            flexShrink: 0,
                          }}
                        >
                          {creator.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 12 }}>{creator.name}</div>
                          <div style={{ fontSize: 10, color: "var(--otr-text-secondary)" }}>@{creator.handle}</div>
                        </div>
                      </Link>
                    </td>
                    {/* 플랫폼 */}
                    <td style={{ textAlign: "center" }}>
                      <div className="flex items-center justify-center gap-1">
                        <Instagram style={{ width: 11, height: 11, color: "#e1306c" }} />
                        {creator.youtubeHandle && <Youtube style={{ width: 11, height: 11, color: "#ff0000" }} />}
                      </div>
                    </td>
                    {/* 카테고리 */}
                    <td>
                      <div className="flex flex-wrap gap-0.5">
                        {creator.category.slice(0, 2).map((cat) => (
                          <span key={cat} className="otr-badge otr-badge-blue">{cat}</span>
                        ))}
                      </div>
                    </td>
                    {/* 팔로워 */}
                    <td style={{ textAlign: "right", fontWeight: 600 }}>{formatNumber(creator.followers)}</td>
                    {/* 참여율 */}
                    <td style={{ textAlign: "right" }}>
                      <span style={{ color: creator.engagementRate >= 4 ? "#22c55e" : "var(--otr-text-primary)", fontWeight: 600 }}>
                        {creator.engagementRate.toFixed(1)}%
                      </span>
                    </td>
                    {/* 등급 */}
                    <td style={{ textAlign: "center" }}>
                      <OtrTierBadge tier={TIER_MAP[creator.tier]} />
                    </td>
                    {/* 추천 점수 */}
                    <td style={{ textAlign: "right" }}>
                      <span style={{ fontWeight: 700, color: "var(--otr-accent-purple)", fontSize: 14 }}>
                        {rec.score}
                      </span>
                      <span style={{ fontSize: 9, color: "var(--otr-text-secondary)", marginLeft: 2 }}>점</span>
                    </td>
                    {/* 인게이지 점수 */}
                    <td style={{ textAlign: "right", color: "var(--otr-text-secondary)", fontSize: 11 }}>{eng}</td>
                    {/* 매출 점수 */}
                    <td style={{ textAlign: "right", color: "var(--otr-text-secondary)", fontSize: 11 }}>{sales}</td>
                    {/* 추천 사유 */}
                    <td>
                      <span className={`otr-badge ${reasonInfo.badge}`}>{reasonInfo.label}</span>
                    </td>
                    {/* 온트너 */}
                    <td style={{ textAlign: "center" }}>
                      {creator.isOntnerMember ? (
                        <span className="flex items-center justify-center gap-1" style={{ color: "#22c55e", fontSize: 11 }}>
                          <CheckCircle2 style={{ width: 12, height: 12 }} />
                          회원
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1" style={{ color: "#999", fontSize: 11 }}>
                          <CircleDashed style={{ width: 12, height: 12 }} />
                          비회원
                        </span>
                      )}
                    </td>
                    {/* 액션 */}
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="otr-btn-primary flex items-center gap-1 mx-auto"
                        style={{ fontSize: 11 }}
                        disabled={proposing === creator.id}
                        onClick={() => handlePropose(creator.id)}
                      >
                        {proposing === creator.id ? (
                          <><RefreshCw className="w-3 h-3 animate-spin" />발송중</>
                        ) : (
                          <><Send className="w-3 h-3" />제안하기</>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* ── 알고리즘 안내 ── */}
        <div
          style={{
            border: "1px solid var(--otr-border)",
            background: "var(--otr-bg-toolbar)",
            padding: "10px 14px",
            fontSize: 11,
            color: "var(--otr-text-secondary)",
            borderRadius: 4,
          }}
        >
          <strong style={{ color: "var(--otr-text-primary)" }}>추천 알고리즘 기준:</strong>
          {" "}인게이지먼트 가중치 60% (댓글 &gt; 공유 &gt; 저장/조회수 &gt; 좋아요 &gt; 팔로워) +
          CJ 온트너 매출 실적 40%. CJ 캠페인 진행 이력 및 매출 데이터 보유 크리에이터에 가중치 부여.
          배치 기반 1일 1회 업데이트 — 탐색 화면 수치와 시간차가 있을 수 있습니다.
        </div>
      </main>
    </>
  );
}
