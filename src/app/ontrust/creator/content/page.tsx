"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Instagram,
  Youtube,
  X,
  CheckCircle2,
  CircleDashed,
  Eye,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { OtrToolbar, OtrSearchPanel, OtrFormGrid, OtrFormField, OtrTierBadge, OtrPlatformToggle } from "@/components/ontrust";
import rawContents from "@/data/mock/contents.json";
import rawCreators from "@/data/mock/creators.json";
import rawCampaigns from "@/data/mock/campaigns.json";

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
  name: string;
  followers: number;
  engagementRate: number;
  category: string[];
  isOntnerMember: boolean;
  campaigns: string[];
  tier: TierLevel;
}

interface MockContent {
  id: string;
  creatorId: string;
  campaignId?: string;
  platform: string;
  type: string;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  views?: number;
  engagementScore: number;
  category: string;
  postedAt: string;
}

interface MockCampaign {
  id: string;
  name: string;
  brand: string;
  brandCategory: string;
  status: string;
}

const CREATORS = rawCreators as MockCreator[];
const CONTENTS = rawContents as MockContent[];
const CAMPAIGNS = rawCampaigns as MockCampaign[];

const CONTENT_CATEGORIES = ["전체", "뷰티", "패션", "푸드", "테크", "리빙", "육아", "헬스", "여행"];
const PERIOD_OPTIONS = [
  { value: "1w", label: "1주일" },
  { value: "1m", label: "1개월" },
  { value: "3m", label: "3개월" },
  { value: "6m", label: "6개월" },
];

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}천`;
  return n.toLocaleString("ko-KR");
}

function getCreator(id: string) {
  return CREATORS.find((c) => c.id === id);
}

function getCampaign(id?: string) {
  if (!id) return null;
  return CAMPAIGNS.find((c) => c.id === id);
}

// ─── 메인 컴포넌트 ────────────────────────────────────────
export default function OntrustCreatorContentPage() {
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [period, setPeriod] = useState("1m");
  const [contentType, setContentType] = useState("전체");
  const [sortBy, setSortBy] = useState<"engagementScore" | "comments" | "shares" | "saves" | "likes">("engagementScore");
  const [selectedContent, setSelectedContent] = useState<MockContent | null>(null);

  // 적용 조건 (조회 버튼)
  const [appliedCategory, setAppliedCategory] = useState("전체");
  const [appliedPlatforms, setAppliedPlatforms] = useState<string[]>([]);
  const [appliedType, setAppliedType] = useState("전체");

  function handleSearch() {
    setAppliedCategory(categoryFilter);
    setAppliedPlatforms(platforms);
    setAppliedType(contentType);
    setSelectedContent(null);
  }

  function handleReset() {
    setCategoryFilter("전체");
    setPlatforms([]);
    setPeriod("1m");
    setContentType("전체");
    setAppliedCategory("전체");
    setAppliedPlatforms([]);
    setAppliedType("전체");
    setSelectedContent(null);
  }

  const filtered = useMemo(() => {
    let list = [...CONTENTS];
    if (appliedCategory !== "전체") {
      list = list.filter((c) => c.category === appliedCategory);
    }
    if (appliedPlatforms.length > 0) {
      list = list.filter((c) => appliedPlatforms.includes(c.platform));
    }
    if (appliedType !== "전체") {
      list = list.filter((c) => c.type === appliedType);
    }
    list.sort((a, b) => {
      if (sortBy === "comments") return b.comments - a.comments;
      if (sortBy === "shares") return b.shares - a.shares;
      if (sortBy === "saves") return b.saves - a.saves;
      if (sortBy === "likes") return b.likes - a.likes;
      return b.engagementScore - a.engagementScore;
    });
    return list.slice(0, 100);
  }, [appliedCategory, appliedPlatforms, appliedType, sortBy]);

  const selectedCreator = selectedContent ? getCreator(selectedContent.creatorId) : null;
  const selectedCampaign = selectedContent ? getCampaign(selectedContent.campaignId) : null;

  return (
    <>
      <PageHeader
        title="콘텐츠 탐색"
        description="T-A-09 · 인게이지먼트 상위 공구 콘텐츠 Top 100 랭킹으로 크리에이터를 발굴하세요"
      />

      <main className="flex-1 p-4 space-y-3">
        {/* ── 검색 조건 ── */}
        <OtrSearchPanel onSearch={handleSearch} onReset={handleReset}>
          <OtrFormGrid columns={4}>
            <OtrFormField label="카테고리">
              <select
                className="w-full"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {CONTENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </OtrFormField>

            <OtrFormField label="플랫폼">
              <OtrPlatformToggle
                platforms={[
                  { id: "instagram", label: "인스타그램" },
                  { id: "youtube", label: "유튜브" },
                ]}
                selected={platforms}
                onChange={setPlatforms}
              />
            </OtrFormField>

            <OtrFormField label="콘텐츠 유형">
              <select
                className="w-full"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option value="전체">전체</option>
                <option value="공구">공구</option>
                <option value="리뷰">리뷰</option>
                <option value="일반">일반</option>
                <option value="광고">광고</option>
              </select>
            </OtrFormField>

            <OtrFormField label="기간">
              <div className="flex gap-1">
                {PERIOD_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPeriod(opt.value)}
                    className={period === opt.value ? "otr-platform-active" : "otr-platform-inactive"}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </OtrFormField>
          </OtrFormGrid>
        </OtrSearchPanel>

        {/* ── 결과 영역 ── */}
        <div className="flex gap-3">
          {/* 메인 테이블 */}
          <div className="flex-1 min-w-0">
            <OtrToolbar
              leftContent={
                <span className="text-xs text-muted-foreground">
                  인게이지먼트 가중치 기준 Top{" "}
                  <strong className="text-foreground">{filtered.length}</strong>개
                  <span className="ml-2 text-[10px] text-muted-foreground">
                    (댓글 &gt; 공유 &gt; 저장/조회수 &gt; 좋아요 &gt; 팔로워)
                  </span>
                </span>
              }
            >
              <select
                style={{ height: "var(--otr-btn-height)", fontSize: "var(--otr-font-body)" }}
                className="border border-[var(--otr-border)] rounded px-2 bg-background"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="engagementScore">인게이지먼트 점수순</option>
                <option value="comments">댓글순</option>
                <option value="shares">공유순</option>
                <option value="saves">저장순</option>
                <option value="likes">좋아요순</option>
              </select>
            </OtrToolbar>

            <table>
              <thead>
                <tr>
                  <th style={{ width: 44, textAlign: "center" }}>순위</th>
                  <th style={{ width: 70, textAlign: "center" }}>플랫폼</th>
                  <th style={{ width: 70, textAlign: "center" }}>유형</th>
                  <th>크리에이터</th>
                  <th style={{ width: 80 }}>카테고리</th>
                  <th style={{ width: 80, textAlign: "right" }}>인게이지 점수</th>
                  <th style={{ width: 70, textAlign: "right" }}>댓글</th>
                  <th style={{ width: 70, textAlign: "right" }}>공유</th>
                  <th style={{ width: 70, textAlign: "right" }}>저장</th>
                  <th style={{ width: 70, textAlign: "right" }}>좋아요</th>
                  <th style={{ width: 80 }}>연관 캠페인</th>
                  <th style={{ width: 70, textAlign: "center" }}>온트너</th>
                  <th style={{ width: 60, textAlign: "center" }}>상세</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={13} style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
                      해당 조건의 콘텐츠가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map((content, idx) => {
                    const creator = getCreator(content.creatorId);
                    const campaign = getCampaign(content.campaignId);
                    const isSelected = selectedContent?.id === content.id;
                    return (
                      <tr
                        key={content.id}
                        style={{
                          cursor: "pointer",
                          backgroundColor: isSelected ? "var(--otr-accent-purple-light)" : undefined,
                        }}
                        onClick={() => setSelectedContent(isSelected ? null : content)}
                      >
                        {/* 순위 */}
                        <td style={{ textAlign: "center" }}>
                          {idx < 3 ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: ["#7c3aed", "#a78bfa", "#c4b5fd"][idx],
                                color: "#fff",
                                fontSize: 10,
                                fontWeight: 700,
                              }}
                            >
                              {idx + 1}
                            </span>
                          ) : (
                            <span style={{ fontSize: 11, color: "var(--otr-text-secondary)" }}>{idx + 1}</span>
                          )}
                        </td>
                        {/* 플랫폼 */}
                        <td style={{ textAlign: "center" }}>
                          {content.platform === "instagram" ? (
                            <Instagram style={{ width: 13, height: 13, color: "#e1306c", display: "inline" }} />
                          ) : (
                            <Youtube style={{ width: 13, height: 13, color: "#ff0000", display: "inline" }} />
                          )}
                        </td>
                        {/* 유형 */}
                        <td style={{ textAlign: "center" }}>
                          <span className="otr-badge otr-badge-purple">{content.type}</span>
                        </td>
                        {/* 크리에이터 */}
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 12 }}>{creator?.name ?? "—"}</div>
                          <div style={{ fontSize: 10, color: "var(--otr-text-secondary)" }}>
                            @{creator?.handle ?? content.creatorId}
                          </div>
                        </td>
                        {/* 카테고리 */}
                        <td>
                          <span className="otr-badge otr-badge-blue">{content.category}</span>
                        </td>
                        {/* 인게이지 점수 */}
                        <td style={{ textAlign: "right" }}>
                          <span style={{ fontWeight: 700, color: "var(--otr-accent-purple)", fontSize: 13 }}>
                            {content.engagementScore.toFixed(1)}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>{formatNumber(content.comments)}</td>
                        <td style={{ textAlign: "right" }}>{formatNumber(content.shares)}</td>
                        <td style={{ textAlign: "right" }}>{formatNumber(content.saves)}</td>
                        <td style={{ textAlign: "right" }}>{formatNumber(content.likes)}</td>
                        {/* 연관 캠페인 */}
                        <td>
                          {campaign ? (
                            <span style={{ fontSize: 10, color: "var(--otr-accent-purple)" }}>
                              {campaign.brand}
                            </span>
                          ) : (
                            <span style={{ color: "#ccc", fontSize: 10 }}>—</span>
                          )}
                        </td>
                        {/* 온트너 */}
                        <td style={{ textAlign: "center" }}>
                          {creator?.isOntnerMember ? (
                            <CheckCircle2 style={{ width: 13, height: 13, color: "#22c55e", display: "inline" }} />
                          ) : (
                            <CircleDashed style={{ width: 13, height: 13, color: "#ccc", display: "inline" }} />
                          )}
                        </td>
                        {/* 상세 */}
                        <td style={{ textAlign: "center" }}>
                          <Link
                            href={`/ontrust/creator/${content.creatorId}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="otr-btn-toolbar"
                              style={{ padding: "0 8px" }}
                            >
                              <Eye style={{ width: 12, height: 12 }} />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* 사이드 패널 */}
          {selectedContent && selectedCreator && (
            <div
              style={{
                width: 260,
                flexShrink: 0,
                border: "2px solid var(--otr-accent-purple)",
                background: "#fff",
                borderRadius: 4,
                padding: 16,
                alignSelf: "flex-start",
                position: "sticky",
                top: 16,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--otr-accent-purple)" }}>
                  크리에이터 정보
                </span>
                <button
                  onClick={() => setSelectedContent(null)}
                  style={{ fontSize: 11, color: "var(--otr-text-secondary)", cursor: "pointer" }}
                >
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>

              {/* 크리에이터 */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--otr-accent-purple-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--otr-accent-purple)",
                    flexShrink: 0,
                  }}
                >
                  {selectedCreator.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{selectedCreator.name}</div>
                  <div style={{ fontSize: 10, color: "var(--otr-text-secondary)" }}>
                    @{selectedCreator.handle}
                  </div>
                </div>
              </div>

              {/* 지표 */}
              {[
                { label: "팔로워", value: formatNumber(selectedCreator.followers) },
                { label: "참여율", value: `${selectedCreator.engagementRate}%` },
                { label: "CJ 캠페인", value: `${selectedCreator.campaigns.length}회` },
                { label: "카테고리", value: selectedCreator.category.join(", ") },
                { label: "콘텐츠 유형", value: selectedContent.type },
                { label: "게시일", value: new Date(selectedContent.postedAt).toLocaleDateString("ko-KR") },
                { label: "인게이지 점수", value: selectedContent.engagementScore.toFixed(1) },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 0",
                    borderBottom: "1px solid var(--otr-border)",
                    fontSize: 11,
                  }}
                >
                  <span style={{ color: "var(--otr-text-secondary)" }}>{label}</span>
                  <span style={{ fontWeight: 600, color: "var(--otr-text-primary)" }}>{value}</span>
                </div>
              ))}

              {/* 연관 캠페인 */}
              {selectedCampaign && (
                <div
                  style={{
                    marginTop: 8,
                    padding: "6px 8px",
                    background: "var(--otr-accent-purple-light)",
                    borderRadius: 4,
                    fontSize: 11,
                  }}
                >
                  <div style={{ fontSize: 10, color: "var(--otr-text-secondary)", marginBottom: 2 }}>
                    연관 캠페인
                  </div>
                  <div style={{ fontWeight: 600, color: "var(--otr-accent-purple)" }}>
                    {selectedCampaign.name}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--otr-text-secondary)" }}>
                    {selectedCampaign.brand} · {selectedCampaign.status}
                  </div>
                </div>
              )}

              {/* 온트너 상태 */}
              <div className="flex items-center gap-1 mt-3" style={{ fontSize: 11 }}>
                {selectedCreator.isOntnerMember ? (
                  <>
                    <CheckCircle2 style={{ width: 13, height: 13, color: "#22c55e" }} />
                    <span style={{ color: "#22c55e", fontWeight: 600 }}>온트너 회원</span>
                  </>
                ) : (
                  <>
                    <CircleDashed style={{ width: 13, height: 13, color: "#999" }} />
                    <span style={{ color: "#999" }}>온트너 비회원</span>
                  </>
                )}
              </div>

              {/* 액션 */}
              <div className="flex flex-col gap-2 mt-4">
                <OtrTierBadge tier={TIER_MAP[selectedCreator.tier]} long />
                <Link href={`/ontrust/creator/${selectedCreator.id}`} className="w-full">
                  <button className="otr-btn-primary w-full flex items-center justify-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    크리에이터 상세 보기
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
