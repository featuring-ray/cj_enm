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

// --- Types -------------------------------------------------------------------
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
  categoryMatch: boolean;
  brandSimilarity: boolean;
  coPurchaseStatus: boolean;
  engagementScore: number;
  salesScore: number | null;
  avgComments: number;
  avgViews: number;
  ontnerCampaignCount: number;
  cumulativeSales: number | null;
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
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString("ko-KR");
}

// --- Main --------------------------------------------------------------------
export default function CreatorRecommendPage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState(CAMPAIGNS[0]?.id ?? "");
  const [proposing, setProposing] = useState<string | null>(null);

  const recommendation = useMemo(
    () => RECOMMENDATIONS.find((r) => r.campaignId === selectedCampaignId) ?? RECOMMENDATIONS[0] ?? null,
    [selectedCampaignId],
  );

  const selectedCampaign = CAMPAIGNS.find((c) => c.id === selectedCampaignId);
  const topCreators = recommendation?.creators?.slice(0, 10) ?? [];

  const batchLabel = useMemo(() => {
    if (!recommendation?.updatedAt) return "---";
    const d = new Date(recommendation.updatedAt);
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mi = String(d.getUTCMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  }, [recommendation]);

  const moreSearchHref = useMemo(() => {
    if (!selectedCampaign) return "/ontrust/creator/search";
    const cats = selectedCampaign.brandCategory;
    const brand = selectedCampaign.brand;
    return `/ontrust/creator/search?categories=${encodeURIComponent(cats)}&brand=${encodeURIComponent(brand)}`;
  }, [selectedCampaign]);

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
        {/* Campaign selector */}
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
                {batchLabel}
                <span className="text-[10px] text-muted-foreground ml-1">(1일 1회 자동 갱신)</span>
              </div>
            </OtrFormField>
          </OtrFormGrid>
        </OtrSearchPanel>

        {/* Toolbar */}
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
          <Link href={moreSearchHref}>
            <button className="otr-btn-toolbar flex items-center gap-1.5">
              더보기
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </OtrToolbar>

        {/* Recommendation table */}
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
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 44, textAlign: "center" }}>순위</th>
                  <th style={{ minWidth: 160 }}>크리에이터</th>
                  <th style={{ width: 70, textAlign: "center" }}>플랫폼</th>
                  <th style={{ width: 140 }}>카테고리</th>
                  <th style={{ width: 80, textAlign: "right" }}>팔로워 수</th>
                  <th style={{ width: 64, textAlign: "right" }}>ER (%)</th>
                  <th style={{ width: 76, textAlign: "right" }}>평균 댓글</th>
                  <th style={{ width: 84, textAlign: "right" }}>평균 조회수</th>
                  <th style={{ width: 80, textAlign: "center" }}>온트너 캠페인 수</th>
                  <th style={{ width: 90, textAlign: "right" }}>누적 매출</th>
                  <th style={{ width: 64, textAlign: "center" }}>총점수</th>
                  <th style={{ width: 200 }}>추천 사유</th>
                  <th style={{ width: 160 }}>스코어링 방식</th>
                  <th style={{ width: 80, textAlign: "center" }}>액션</th>
                </tr>
              </thead>
              <tbody>
                {topCreators.map((rec, idx) => {
                  const creator = getCreator(rec.creatorId);
                  if (!creator) return null;

                  const reasonBadges: { label: string; cls: string }[] = [];
                  if (rec.categoryMatch) reasonBadges.push({ label: "카테고리 일치", cls: "otr-badge-blue" });
                  if (rec.brandSimilarity) reasonBadges.push({ label: "브랜드 유사", cls: "otr-badge-purple" });
                  if (rec.coPurchaseStatus) reasonBadges.push({ label: "공구 진행", cls: "otr-badge-green" });

                  const scoringLabel =
                    rec.salesScore !== null ? "인게이지 60%+매출 40%" : "인게이지 100%";

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
                          <Instagram style={{ width: 12, height: 12, color: "#e1306c" }} />
                          {creator.youtubeHandle && (
                            <Youtube style={{ width: 12, height: 12, color: "#ff0000" }} />
                          )}
                        </div>
                      </td>

                      {/* 카테고리 */}
                      <td>
                        <div className="flex flex-wrap gap-0.5">
                          {creator.category.slice(0, 3).map((cat) => (
                            <span key={cat} className="otr-badge otr-badge-blue">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* 팔로워 수 */}
                      <td style={{ textAlign: "right", fontWeight: 600, fontSize: 12 }}>
                        {formatNumber(creator.followers)}
                      </td>

                      {/* ER (%) */}
                      <td style={{ textAlign: "right" }}>
                        <span
                          style={{
                            color: creator.engagementRate >= 4 ? "#22c55e" : "var(--otr-text-primary)",
                            fontWeight: 600,
                            fontSize: 12,
                          }}
                        >
                          {creator.engagementRate.toFixed(1)}%
                        </span>
                      </td>

                      {/* 평균 댓글 */}
                      <td style={{ textAlign: "right", fontSize: 12 }}>{formatNumber(rec.avgComments)}</td>

                      {/* 평균 조회수 */}
                      <td style={{ textAlign: "right", fontSize: 12 }}>{formatNumber(rec.avgViews)}</td>

                      {/* 온트너 캠페인 수 */}
                      <td style={{ textAlign: "center", fontSize: 12 }}>
                        {rec.ontnerCampaignCount > 0 ? (
                          <span className="flex items-center justify-center gap-1">
                            <CheckCircle2 style={{ width: 11, height: 11, color: "#22c55e" }} />
                            <span style={{ fontWeight: 600 }}>{rec.ontnerCampaignCount}회</span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-1" style={{ color: "#999" }}>
                            <CircleDashed style={{ width: 11, height: 11 }} />
                            0회
                          </span>
                        )}
                      </td>

                      {/* 누적 매출 */}
                      <td style={{ textAlign: "right", fontSize: 12, fontWeight: 600 }}>
                        {rec.cumulativeSales !== null ? formatNumber(rec.cumulativeSales) : (
                          <span style={{ color: "var(--otr-text-secondary)" }}>&mdash;</span>
                        )}
                      </td>

                      {/* 총점수 */}
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: "var(--otr-accent-purple)",
                            fontSize: 16,
                          }}
                        >
                          {rec.score}
                        </span>
                      </td>

                      {/* 추천 사유 */}
                      <td>
                        <div className="flex flex-wrap gap-0.5">
                          {reasonBadges.length > 0 ? (
                            reasonBadges.map((b) => (
                              <span key={b.label} className={`otr-badge ${b.cls}`}>
                                {b.label}
                              </span>
                            ))
                          ) : (
                            <span
                              className="otr-badge otr-badge-blue"
                              style={{ opacity: 0.6 }}
                            >
                              기타
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 스코어링 방식 */}
                      <td>
                        <span
                          style={{
                            fontSize: 10,
                            color: rec.salesScore !== null ? "var(--otr-text-primary)" : "var(--otr-text-secondary)",
                            background: rec.salesScore !== null ? "var(--otr-accent-purple-light)" : "var(--otr-bg-toolbar)",
                            padding: "2px 6px",
                            borderRadius: 3,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {scoringLabel}
                        </span>
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
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              발송중
                            </>
                          ) : (
                            <>
                              <Send className="w-3 h-3" />
                              제안하기
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Algorithm explanation */}
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
          <strong style={{ color: "var(--otr-text-primary)" }}>추천 알고리즘 기준:</strong>{" "}
          인게이지먼트 가중치 60% (댓글 &gt; 조회수 &gt; 좋아요 &gt; 팔로워) +
          CJ 온트너 매출 실적 40%. CJ 캠페인 진행 이력 및 매출 데이터 보유 크리에이터에 가중치 부여.
          매출 데이터가 없는 크리에이터는 인게이지먼트 100%로 스코어링합니다.
          배치 기반 1일 1회 업데이트 — 탐색 화면 수치와 시간차가 있을 수 있습니다.
          ※ 공유하기 지표는 수집 불가하여 점수 산정에서 제외되었습니다.
        </div>
      </main>
    </>
  );
}
