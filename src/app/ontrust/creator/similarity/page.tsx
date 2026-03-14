"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { OtrSearchPanel, OtrFormGrid, OtrFormField, OtrToolbar, OtrTierBadge } from "@/components/ontrust";
import rawCreators from "@/data/mock/creators.json";
import rawSimilarity from "@/data/mock/similarity.json";

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

interface SimilarityRecord {
  creatorA: string;
  creatorB: string;
  matchRate: number;
  analyzedAt: string;
  validUntil: string;
}

const CREATORS = rawCreators as MockCreator[];
const SIMILARITY_DATA = rawSimilarity as SimilarityRecord[];

const MAX_CREATORS = 5;

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString("ko-KR");
}

function getSimilarity(a: string, b: string): SimilarityRecord | null {
  return (
    SIMILARITY_DATA.find(
      (s) => (s.creatorA === a && s.creatorB === b) || (s.creatorA === b && s.creatorB === a)
    ) ?? null
  );
}

// 분석 이력 Mock
const MOCK_HISTORY = [
  {
    id: "hist-1",
    creators: ["creator-1", "creator-3"],
    analyzedAt: "2026-03-08",
    avgMatchRate: 34.2,
    status: "완료",
  },
  {
    id: "hist-2",
    creators: ["creator-2", "creator-6", "creator-5"],
    analyzedAt: "2026-03-05",
    avgMatchRate: 28.6,
    status: "완료",
  },
  {
    id: "hist-3",
    creators: ["creator-7", "creator-8"],
    analyzedAt: "2026-03-10",
    avgMatchRate: 0,
    status: "분석중",
  },
];

// ─── 메인 컴포넌트 ────────────────────────────────────────
export default function SimilarityPage() {
  return (
    <Suspense>
      <SimilarityContent />
    </Suspense>
  );
}

function SimilarityContent() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"analyze" | "history">("analyze");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCreators, setSelectedCreators] = useState<MockCreator[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  // URL 파라미터로 크리에이터 사전 선택
  useEffect(() => {
    const ids = searchParams.get("ids");
    if (ids) {
      const preSelected = ids
        .split(",")
        .map((id) => CREATORS.find((c) => c.id === id))
        .filter(Boolean) as MockCreator[];
      setSelectedCreators(preSelected.slice(0, MAX_CREATORS));
    }
  }, [searchParams]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return CREATORS.filter(
      (c) =>
        !selectedCreators.some((s) => s.id === c.id) &&
        (c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [searchQuery, selectedCreators]);

  function addCreator(creator: MockCreator) {
    if (selectedCreators.length >= MAX_CREATORS) return;
    if (selectedCreators.some((c) => c.id === creator.id)) return;
    setSelectedCreators((prev) => [...prev, creator]);
    setSearchQuery("");
    setAnalyzed(false);
  }

  function removeCreator(id: string) {
    setSelectedCreators((prev) => prev.filter((c) => c.id !== id));
    setAnalyzed(false);
  }

  function handleAnalyze() {
    if (selectedCreators.length < 2) return;
    setAnalyzing(true);
    setAnalyzed(false);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2200);
  }

  // 결과 매트릭스 (크리에이터 쌍별 일치율)
  const matrixPairs = useMemo(() => {
    const pairs: { a: MockCreator; b: MockCreator; result: SimilarityRecord | null }[] = [];
    for (let i = 0; i < selectedCreators.length; i++) {
      for (let j = i + 1; j < selectedCreators.length; j++) {
        const a = selectedCreators[i];
        const b = selectedCreators[j];
        pairs.push({ a, b, result: getSimilarity(a.id, b.id) });
      }
    }
    return pairs;
  }, [selectedCreators]);

  return (
    <>
      <PageHeader
        title="팔로워 유사도 분석"
        description="T-A-07/08 · 크리에이터 2~5명의 팔로워 중복도를 분석합니다 (배치 처리, 820원/회)"
      />

      <main className="flex-1 p-4 space-y-3">
        {/* ── 탭 ── */}
        <div className="flex gap-1">
          <button
            className={tab === "analyze" ? "otr-platform-active" : "otr-platform-inactive"}
            onClick={() => setTab("analyze")}
          >
            유사도 분석
          </button>
          <button
            className={tab === "history" ? "otr-platform-active" : "otr-platform-inactive"}
            onClick={() => setTab("history")}
          >
            분석 이력
          </button>
        </div>

        {/* ── 분석 탭 ── */}
        {tab === "analyze" && (
          <div className="space-y-3">
            {/* 크리에이터 선택 패널 */}
            <OtrSearchPanel>
              <OtrFormGrid columns={2}>
                <OtrFormField label="크리에이터 검색" span={2}>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      className="w-full pl-7 pr-3"
                      placeholder="이름 또는 핸들로 검색 (2~5명 선택)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={selectedCreators.length >= MAX_CREATORS}
                    />
                  </div>
                  {/* 검색 결과 드롭다운 */}
                  {searchResults.length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: 50,
                        background: "#fff",
                        border: "1px solid var(--otr-border)",
                        borderRadius: 4,
                        marginTop: 2,
                        width: "100%",
                        maxHeight: 200,
                        overflowY: "auto",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      {searchResults.map((creator) => (
                        <div
                          key={creator.id}
                          style={{
                            padding: "6px 12px",
                            cursor: "pointer",
                            fontSize: 12,
                            borderBottom: "1px solid var(--otr-border)",
                          }}
                          className="hover:bg-[var(--otr-bg-toolbar)]"
                          onClick={() => addCreator(creator)}
                        >
                          <span style={{ fontWeight: 600 }}>{creator.name}</span>
                          <span style={{ color: "var(--otr-text-secondary)", marginLeft: 6 }}>
                            @{creator.handle} · {formatNumber(creator.followers)} 팔로워
                          </span>
                          {creator.isOntnerMember && (
                            <span
                              style={{
                                marginLeft: 6,
                                fontSize: 10,
                                color: "#22c55e",
                                fontWeight: 600,
                              }}
                            >
                              ✓ 온트너
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </OtrFormField>
              </OtrFormGrid>

              {/* 선택된 크리에이터 태그 */}
              {selectedCreators.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedCreators.map((creator) => (
                    <div
                      key={creator.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "3px 8px 3px 10px",
                        background: "var(--otr-accent-purple-light)",
                        border: "1px solid var(--otr-accent-purple)",
                        borderRadius: 20,
                        fontSize: 12,
                        color: "var(--otr-accent-purple)",
                        fontWeight: 600,
                      }}
                    >
                      {creator.name}
                      <button onClick={() => removeCreator(creator.id)}>
                        <X style={{ width: 12, height: 12 }} />
                      </button>
                    </div>
                  ))}
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--otr-text-secondary)",
                      alignSelf: "center",
                    }}
                  >
                    {selectedCreators.length}/{MAX_CREATORS}명 선택
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <span style={{ fontSize: 11, color: "var(--otr-text-secondary)" }}>
                  * 사전 모수 미파악 크리에이터는 분석 요청 후 최대 3일 소요됩니다.
                  분석 비용: 820원/회
                </span>
                <div className="flex gap-2">
                  {selectedCreators.length < 2 && (
                    <span style={{ fontSize: 11, color: "#ef4444" }}>
                      최소 2명을 선택하세요
                    </span>
                  )}
                  <button
                    className="otr-btn-primary flex items-center gap-1.5"
                    disabled={selectedCreators.length < 2 || analyzing}
                    onClick={handleAnalyze}
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        분석 중...
                      </>
                    ) : (
                      "분석 요청"
                    )}
                  </button>
                </div>
              </div>
            </OtrSearchPanel>

            {/* 분석 중 상태 */}
            {analyzing && (
              <div
                style={{
                  border: "2px solid var(--otr-accent-purple)",
                  background: "var(--otr-accent-purple-light)",
                  borderRadius: 4,
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <Loader2
                  style={{
                    width: 32,
                    height: 32,
                    margin: "0 auto 12px",
                    color: "var(--otr-accent-purple)",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--otr-accent-purple)" }}>
                  팔로워 유사도 분석 중...
                </div>
                <div style={{ fontSize: 11, color: "var(--otr-text-secondary)", marginTop: 4 }}>
                  배치 처리 시뮬레이션 중입니다. 실제 분석 시 최대 3일 소요됩니다.
                </div>
              </div>
            )}

            {/* 분석 결과 */}
            {analyzed && !analyzing && (
              <div className="space-y-3">
                {/* 결과 헤더 */}
                <OtrToolbar
                  leftContent={
                    <div className="flex items-center gap-2">
                      <CheckCircle2 style={{ width: 16, height: 16, color: "#22c55e" }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--otr-text-primary)" }}>
                        분석 완료 — {selectedCreators.length}명 · 유효기간 6개월
                      </span>
                    </div>
                  }
                />

                {/* 크리에이터별 정보 */}
                <table>
                  <thead>
                    <tr>
                      <th>크리에이터</th>
                      <th style={{ width: 80, textAlign: "right" }}>팔로워</th>
                      <th style={{ width: 80, textAlign: "right" }}>참여율</th>
                      <th style={{ width: 80, textAlign: "center" }}>등급</th>
                      <th style={{ width: 150 }}>카테고리</th>
                      <th style={{ width: 70, textAlign: "center" }}>온트너</th>
                      <th style={{ width: 80, textAlign: "center" }}>상세</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCreators.map((creator) => (
                      <tr key={creator.id}>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 12 }}>{creator.name}</div>
                          <div style={{ fontSize: 10, color: "var(--otr-text-secondary)" }}>@{creator.handle}</div>
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 600 }}>{formatNumber(creator.followers)}</td>
                        <td style={{ textAlign: "right" }}>
                          <span style={{ color: creator.engagementRate >= 4 ? "#22c55e" : "inherit", fontWeight: 600 }}>
                            {creator.engagementRate.toFixed(1)}%
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <OtrTierBadge tier={TIER_MAP[creator.tier]} />
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-0.5">
                            {creator.category.slice(0, 2).map((cat) => (
                              <span key={cat} className="otr-badge otr-badge-blue">{cat}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {creator.isOntnerMember ? (
                            <CheckCircle2 style={{ width: 13, height: 13, color: "#22c55e", display: "inline" }} />
                          ) : (
                            <span style={{ fontSize: 10, color: "#999" }}>비회원</span>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <Link href={`/ontrust/creator/${creator.id}`}>
                            <button className="otr-btn-toolbar" style={{ padding: "0 8px" }}>
                              <Eye style={{ width: 12, height: 12 }} />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* 유사도 매트릭스 */}
                <div>
                  <div
                    className="otr-section-marker"
                    style={{ fontSize: 12, fontWeight: 600, padding: "6px 0 8px" }}
                  >
                    팔로워 유사도 매트릭스 (크리에이터 쌍별 일치율)
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: 180 }}>크리에이터 A</th>
                        <th style={{ width: 180 }}>크리에이터 B</th>
                        <th style={{ width: 120, textAlign: "center" }}>팔로워 일치율</th>
                        <th style={{ width: 120 }}>분석일</th>
                        <th style={{ width: 120 }}>유효기간</th>
                        <th style={{ width: 80, textAlign: "center" }}>상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matrixPairs.map(({ a, b, result }) => {
                        // Mock 결과 생성 (없는 경우)
                        const matchRate = result?.matchRate ?? Math.floor(Math.random() * 40 + 10);
                        const analyzedAt = result?.analyzedAt ?? "2026-03-14T00:00:00Z";
                        const validUntil = result?.validUntil ?? "2026-09-14T00:00:00Z";
                        const isValid = new Date(validUntil) > new Date();
                        return (
                          <tr key={`${a.id}-${b.id}`}>
                            <td style={{ fontWeight: 600 }}>{a.name}</td>
                            <td style={{ fontWeight: 600 }}>{b.name}</td>
                            <td style={{ textAlign: "center" }}>
                              <div className="flex items-center justify-center gap-2">
                                <div
                                  style={{
                                    width: 80,
                                    height: 8,
                                    background: "#f0f0f0",
                                    borderRadius: 4,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${matchRate}%`,
                                      height: "100%",
                                      background: matchRate >= 30 ? "#22c55e" : matchRate >= 20 ? "#f59e0b" : "var(--otr-accent-purple)",
                                      borderRadius: 4,
                                    }}
                                  />
                                </div>
                                <span style={{ fontWeight: 700, color: "var(--otr-accent-purple)", fontSize: 13 }}>
                                  {matchRate.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                            <td style={{ color: "var(--otr-text-secondary)", fontSize: 11 }}>
                              {new Date(analyzedAt).toLocaleDateString("ko-KR")}
                            </td>
                            <td style={{ fontSize: 11 }}>
                              {isValid ? (
                                <span style={{ color: "#22c55e" }}>
                                  ~{new Date(validUntil).toLocaleDateString("ko-KR")}
                                </span>
                              ) : (
                                <span style={{ color: "#ef4444" }}>
                                  만료 (업데이트 필요)
                                </span>
                              )}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <CheckCircle2 style={{ width: 13, height: 13, color: "#22c55e", display: "inline" }} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 이력 탭 ── */}
        {tab === "history" && (
          <div className="space-y-3">
            <OtrToolbar
              leftContent={
                <span style={{ fontSize: 12, color: "var(--otr-text-secondary)" }}>
                  총 <strong style={{ color: "var(--otr-text-primary)" }}>{MOCK_HISTORY.length}</strong>건의 분석 이력
                </span>
              }
            />

            <table>
              <thead>
                <tr>
                  <th>분석 대상 크리에이터</th>
                  <th style={{ width: 100 }}>분석일</th>
                  <th style={{ width: 120, textAlign: "right" }}>평균 일치율</th>
                  <th style={{ width: 80, textAlign: "center" }}>상태</th>
                  <th style={{ width: 80, textAlign: "center" }}>액션</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_HISTORY.map((hist) => {
                  const names = hist.creators
                    .map((id) => CREATORS.find((c) => c.id === id)?.name ?? id)
                    .join(", ");
                  return (
                    <tr key={hist.id}>
                      <td>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{names}</div>
                        <div style={{ fontSize: 10, color: "var(--otr-text-secondary)" }}>
                          {hist.creators.length}명
                        </div>
                      </td>
                      <td style={{ color: "var(--otr-text-secondary)", fontSize: 11 }}>
                        {hist.analyzedAt}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {hist.status === "완료" ? (
                          <span style={{ fontWeight: 700, color: "var(--otr-accent-purple)" }}>
                            {hist.avgMatchRate.toFixed(1)}%
                          </span>
                        ) : (
                          <span style={{ color: "var(--otr-text-secondary)" }}>—</span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {hist.status === "완료" ? (
                          <span className="flex items-center justify-center gap-1 text-xs" style={{ color: "#22c55e" }}>
                            <CheckCircle2 style={{ width: 12, height: 12 }} />
                            완료
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-1 text-xs" style={{ color: "#f59e0b" }}>
                            <Clock style={{ width: 12, height: 12 }} />
                            분석중
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          className="otr-btn-toolbar"
                          style={{ fontSize: 11, padding: "0 8px" }}
                          onClick={() => {
                            const preSelected = hist.creators
                              .map((id) => CREATORS.find((c) => c.id === id))
                              .filter(Boolean) as MockCreator[];
                            setSelectedCreators(preSelected);
                            setTab("analyze");
                            if (hist.status === "완료") setAnalyzed(true);
                          }}
                        >
                          재조회
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div
              style={{
                fontSize: 11,
                color: "var(--otr-text-secondary)",
                padding: "6px 10px",
                background: "var(--otr-bg-toolbar)",
                border: "1px solid var(--otr-border)",
                borderRadius: 4,
              }}
            >
              <AlertTriangle style={{ width: 11, height: 11, display: "inline", marginRight: 4, color: "#f59e0b" }} />
              마지막 분석일 기준 6개월 초과 시 업데이트가 필요합니다.
            </div>
          </div>
        )}
      </main>
    </>
  );
}
