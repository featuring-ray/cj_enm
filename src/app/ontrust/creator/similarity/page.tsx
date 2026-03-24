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
  RefreshCw,
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
  hasFollowerData: boolean;
  audienceGender: { male: number; female: number };
  audienceAge: Record<string, number>;
}

interface SimilarityRecord {
  id: string;
  requesterId: string;
  requesterName: string;
  creatorA: string;
  creatorB: string;
  matchRate: number;
  analyzedAt: string;
  validUntil: string;
  status: "완료" | "분석중";
}

const CREATORS = rawCreators as MockCreator[];
const SIMILARITY_DATA = rawSimilarity as SimilarityRecord[];

const MAX_CREATORS = 2;

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

function isExpired(analyzedAt: string): boolean {
  const d = new Date(analyzedAt);
  d.setMonth(d.getMonth() + 6);
  return d < new Date();
}

function getCreatorName(id: string): string {
  return CREATORS.find((c) => c.id === id)?.name ?? id;
}

// ─── 세그먼트 시각화 ─────────────────────────────────────
function GenderBar({ male, female }: { male: number; female: number }) {
  return (
    <div>
      <div style={{ display: "flex", height: 18, border: "1px solid var(--otr-border)", overflow: "hidden" }}>
        <div
          style={{
            width: `${female}%`,
            background: "var(--otr-accent-purple)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            color: "#fff",
            fontWeight: 600,
          }}
        >
          {female >= 15 && `${female}%`}
        </div>
        <div
          style={{
            width: `${male}%`,
            background: "#94a3b8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            color: "#fff",
            fontWeight: 600,
          }}
        >
          {male >= 15 && `${male}%`}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--otr-text-secondary)", marginTop: 3 }}>
        <span>여성 {female}%</span>
        <span>남성 {male}%</span>
      </div>
    </div>
  );
}

function AgeChart({ data }: { data: Record<string, number> }) {
  const maxVal = Math.max(...Object.values(data), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {Object.entries(data).map(([range, pct]) => (
        <div key={range} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 48, fontSize: 11, color: "var(--otr-text-secondary)", textAlign: "right", flexShrink: 0 }}>
            {range}
          </span>
          <div style={{ flex: 1, height: 14, background: "#f0f0f0" }}>
            <div
              style={{
                width: `${(pct / maxVal) * 100}%`,
                height: "100%",
                background: "var(--otr-accent-purple)",
                minWidth: pct > 0 ? 2 : 0,
              }}
            />
          </div>
          <span style={{ width: 32, fontSize: 11, fontWeight: 600, color: "var(--otr-text-primary)", textAlign: "right", flexShrink: 0 }}>
            {pct}%
          </span>
        </div>
      ))}
    </div>
  );
}

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

  // 모수 수집 상태
  const [collectionRequested, setCollectionRequested] = useState<Record<string, boolean>>({});
  const [collectionInProgress, setCollectionInProgress] = useState<Record<string, boolean>>({});

  // 이력 탭 검색
  const [historySearchQuery, setHistorySearchQuery] = useState("");

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

  // 분석 가능 여부
  const canAnalyze = useMemo(() => {
    if (selectedCreators.length !== 2) return false;
    return selectedCreators.every((c) => c.hasFollowerData || collectionRequested[c.id]);
  }, [selectedCreators, collectionRequested]);

  const needsCollection = useMemo(() => {
    return selectedCreators.some((c) => !c.hasFollowerData && !collectionRequested[c.id]);
  }, [selectedCreators, collectionRequested]);

  const allCollectionDone = useMemo(() => {
    const missing = selectedCreators.filter((c) => !c.hasFollowerData);
    return missing.length > 0 && missing.every((c) => collectionRequested[c.id] && !collectionInProgress[c.id]);
  }, [selectedCreators, collectionRequested, collectionInProgress]);

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

  function handleCollectionRequest() {
    const missing = selectedCreators.filter((c) => !c.hasFollowerData && !collectionRequested[c.id]);
    const newRequested: Record<string, boolean> = {};
    const newInProgress: Record<string, boolean> = {};
    missing.forEach((c) => {
      newRequested[c.id] = true;
      newInProgress[c.id] = true;
    });
    setCollectionRequested((prev) => ({ ...prev, ...newRequested }));
    setCollectionInProgress((prev) => ({ ...prev, ...newInProgress }));

    // 수집 완료 시뮬레이션 (1.5초)
    setTimeout(() => {
      const done: Record<string, boolean> = {};
      missing.forEach((c) => {
        done[c.id] = false;
      });
      setCollectionInProgress((prev) => ({ ...prev, ...done }));
    }, 1500);
  }

  function handleAnalyze() {
    if (selectedCreators.length !== 2) return;
    setAnalyzing(true);
    setAnalyzed(false);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2200);
  }

  // 분석 결과 (1:1)
  const analysisResult = useMemo(() => {
    if (selectedCreators.length !== 2) return null;
    const [a, b] = selectedCreators;
    const existing = getSimilarity(a.id, b.id);
    const matchRate = existing?.matchRate ?? Math.floor(Math.random() * 40 + 10);
    return { creatorA: a, creatorB: b, matchRate };
  }, [selectedCreators]);

  // 이력 필터링
  const filteredHistory = useMemo(() => {
    if (!historySearchQuery.trim()) return SIMILARITY_DATA;
    const q = historySearchQuery.toLowerCase();
    return SIMILARITY_DATA.filter((record) => {
      const nameA = getCreatorName(record.creatorA).toLowerCase();
      const nameB = getCreatorName(record.creatorB).toLowerCase();
      return nameA.includes(q) || nameB.includes(q) || record.requesterName.toLowerCase().includes(q);
    });
  }, [historySearchQuery]);

  function getDataStatus(creator: MockCreator): { label: string; color: string; icon: "check" | "warn" | "loading" } {
    if (creator.hasFollowerData) return { label: "모수 확보", color: "#22c55e", icon: "check" };
    if (collectionInProgress[creator.id]) return { label: "수집 중", color: "#f59e0b", icon: "loading" };
    if (collectionRequested[creator.id]) return { label: "수집 완료", color: "#22c55e", icon: "check" };
    return { label: "모수 미확보", color: "#f59e0b", icon: "warn" };
  }

  return (
    <>
      <PageHeader
        title="팔로워 유사도 분석"
        description="크리에이터 2명의 팔로워 유사도를 1:1 분석합니다 (배치 처리, 820원/회)"
      />

      <main className="flex-1 p-4 space-y-3">
        {/* ── 탭 ── */}
        <div className="flex gap-1">
          <button
            className={tab === "analyze" ? "otr-platform-active" : "otr-platform-inactive"}
            onClick={() => setTab("analyze")}
          >
            겹침률 분석
          </button>
          <button
            className={tab === "history" ? "otr-platform-active" : "otr-platform-inactive"}
            onClick={() => setTab("history")}
          >
            분석 이력
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════
            분석 탭
           ══════════════════════════════════════════════════════ */}
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
                      placeholder="이름 또는 핸들로 검색 (2명 선택)..."
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
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                          className="hover:bg-[var(--otr-bg-toolbar)]"
                          onClick={() => addCreator(creator)}
                        >
                          <div>
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
                          <span
                            style={{
                              fontSize: 10,
                              color: creator.hasFollowerData ? "#22c55e" : "#f59e0b",
                              fontWeight: 600,
                            }}
                          >
                            {creator.hasFollowerData ? "모수 확보" : "모수 미확보"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </OtrFormField>
              </OtrFormGrid>

              {/* 선택된 크리에이터 태그 */}
              {selectedCreators.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedCreators.map((creator) => {
                    const status = getDataStatus(creator);
                    return (
                      <div
                        key={creator.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 8px 4px 10px",
                          background: "var(--otr-accent-purple-light)",
                          border: "1px solid var(--otr-accent-purple)",
                          borderRadius: 20,
                          fontSize: 12,
                          color: "var(--otr-accent-purple)",
                          fontWeight: 600,
                        }}
                      >
                        {creator.name}
                        <span
                          style={{
                            fontSize: 10,
                            color: status.color,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          {status.icon === "check" && <CheckCircle2 style={{ width: 10, height: 10 }} />}
                          {status.icon === "warn" && <AlertTriangle style={{ width: 10, height: 10 }} />}
                          {status.icon === "loading" && <Loader2 style={{ width: 10, height: 10 }} className="animate-spin" />}
                          {status.label}
                        </span>
                        <button onClick={() => removeCreator(creator.id)}>
                          <X style={{ width: 12, height: 12, color: "var(--otr-accent-purple)" }} />
                        </button>
                      </div>
                    );
                  })}
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
                  * 사전 모수 미확보 크리에이터는 수집 요청 후 최대 3~4일 소요됩니다. 분석 비용: 820원/회
                </span>
                <div className="flex gap-2 items-center">
                  {selectedCreators.length < 2 && (
                    <span style={{ fontSize: 11, color: "#ef4444" }}>
                      2명을 선택하세요
                    </span>
                  )}

                  {/* 모수 수집 요청 버튼 */}
                  {selectedCreators.length === 2 && needsCollection && (
                    <button
                      className="otr-btn-secondary flex items-center gap-1.5"
                      style={{ background: "#fef3c7", borderColor: "#f59e0b", color: "#92400e" }}
                      onClick={handleCollectionRequest}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      모수 수집 요청
                    </button>
                  )}

                  {/* 수집 진행 중 메시지 */}
                  {selectedCreators.length === 2 && !needsCollection && selectedCreators.some((c) => collectionInProgress[c.id]) && (
                    <span style={{ fontSize: 11, color: "#f59e0b" }} className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      수집 중...
                    </span>
                  )}

                  {/* 수집 완료 안내 */}
                  {allCollectionDone && (
                    <span style={{ fontSize: 11, color: "#22c55e" }} className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      수집 완료
                    </span>
                  )}

                  {/* 분석하기 버튼 */}
                  <button
                    className="otr-btn-primary flex items-center gap-1.5"
                    disabled={!canAnalyze || analyzing}
                    onClick={handleAnalyze}
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        분석 중...
                      </>
                    ) : (
                      "분석하기"
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
                  배치 처리 시뮬레이션 중입니다. 실제 분석 시 최대 3~4일 소요됩니다.
                </div>
              </div>
            )}

            {/* ── 분석 결과 ── */}
            {analyzed && !analyzing && analysisResult && (
              <div className="space-y-3">
                {/* 결과 헤더 */}
                <OtrToolbar
                  leftContent={
                    <div className="flex items-center gap-2">
                      <CheckCircle2 style={{ width: 16, height: 16, color: "#22c55e" }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--otr-text-primary)" }}>
                        분석 완료 — 2명 · 유효기간 6개월
                      </span>
                    </div>
                  }
                />

                {/* 일치율 요약 */}
                <div
                  style={{
                    border: "2px solid var(--otr-accent-purple)",
                    background: "var(--otr-accent-purple-light)",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <div
                    className="otr-section-marker"
                    style={{ fontSize: 12, fontWeight: 600, padding: "0 0 12px", textAlign: "center" }}
                  >
                    팔로워 일치율
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: "var(--otr-accent-purple)", lineHeight: 1 }}>
                    {analysisResult.matchRate.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: 11, color: "var(--otr-text-secondary)", marginTop: 8 }}>
                    산출 공식: (일치 팔로워 수 / min(A 샘플수, B 샘플수)) × 100
                  </div>
                  <div style={{ fontSize: 12, color: "var(--otr-text-secondary)", marginTop: 4 }}>
                    {analysisResult.creatorA.name} vs {analysisResult.creatorB.name}
                  </div>
                </div>

                {/* 크리에이터 세그먼트 비교 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {/* 크리에이터 A */}
                  <div style={{ border: "1px solid var(--otr-border)", padding: 12 }}>
                    <div
                      className="otr-section-marker"
                      style={{ fontSize: 12, fontWeight: 600, paddingBottom: 10 }}
                    >
                      {analysisResult.creatorA.name} 팔로워 세그먼트
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--otr-text-primary)", marginBottom: 6 }}>
                        성별 분포
                      </div>
                      <GenderBar
                        male={analysisResult.creatorA.audienceGender.male}
                        female={analysisResult.creatorA.audienceGender.female}
                      />
                    </div>

                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--otr-text-primary)", marginBottom: 6 }}>
                        연령대 분포
                      </div>
                      <AgeChart data={analysisResult.creatorA.audienceAge} />
                    </div>
                  </div>

                  {/* 크리에이터 B */}
                  <div style={{ border: "1px solid var(--otr-border)", padding: 12 }}>
                    <div
                      className="otr-section-marker"
                      style={{ fontSize: 12, fontWeight: 600, paddingBottom: 10 }}
                    >
                      {analysisResult.creatorB.name} 팔로워 세그먼트
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--otr-text-primary)", marginBottom: 6 }}>
                        성별 분포
                      </div>
                      <GenderBar
                        male={analysisResult.creatorB.audienceGender.male}
                        female={analysisResult.creatorB.audienceGender.female}
                      />
                    </div>

                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--otr-text-primary)", marginBottom: 6 }}>
                        연령대 분포
                      </div>
                      <AgeChart data={analysisResult.creatorB.audienceAge} />
                    </div>
                  </div>
                </div>

                {/* 크리에이터 요약 테이블 */}
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
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            이력 탭
           ══════════════════════════════════════════════════════ */}
        {tab === "history" && (
          <div className="space-y-3">
            {/* 검색 필터 */}
            <OtrToolbar
              leftContent={
                <span style={{ fontSize: 12, color: "var(--otr-text-secondary)" }}>
                  총 <strong style={{ color: "var(--otr-text-primary)" }}>{filteredHistory.length}</strong>건의 분석 이력
                </span>
              }
            >
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <input
                  type="text"
                  style={{ width: 200, paddingLeft: 24, fontSize: 11 }}
                  placeholder="크리에이터 / 요청자 검색..."
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                />
              </div>
            </OtrToolbar>

            <table>
              <thead>
                <tr>
                  <th style={{ width: 70 }}>분석ID</th>
                  <th style={{ width: 70 }}>요청자</th>
                  <th>크리에이터A</th>
                  <th>크리에이터B</th>
                  <th style={{ width: 100, textAlign: "center" }}>일치율</th>
                  <th style={{ width: 100 }}>분석일자</th>
                  <th style={{ width: 100, textAlign: "center" }}>유효상태</th>
                  <th style={{ width: 80, textAlign: "center" }}>액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((record) => {
                  const expired = record.status === "완료" && isExpired(record.analyzedAt);
                  const creatorAObj = CREATORS.find((c) => c.id === record.creatorA);
                  const creatorBObj = CREATORS.find((c) => c.id === record.creatorB);

                  return (
                    <tr key={record.id}>
                      <td style={{ fontSize: 11, color: "var(--otr-text-secondary)" }}>{record.id}</td>
                      <td style={{ fontSize: 11 }}>{record.requesterName}</td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 12 }}>{getCreatorName(record.creatorA)}</div>
                        {creatorAObj && (
                          <div style={{ fontSize: 10, color: "var(--otr-text-secondary)" }}>@{creatorAObj.handle}</div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 12 }}>{getCreatorName(record.creatorB)}</div>
                        {creatorBObj && (
                          <div style={{ fontSize: 10, color: "var(--otr-text-secondary)" }}>@{creatorBObj.handle}</div>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {record.status === "완료" ? (
                          <div className="flex items-center justify-center gap-2">
                            <div
                              style={{
                                width: 60,
                                height: 8,
                                background: "#f0f0f0",
                                borderRadius: 4,
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${record.matchRate}%`,
                                  height: "100%",
                                  background: record.matchRate >= 30 ? "#22c55e" : record.matchRate >= 20 ? "#f59e0b" : "var(--otr-accent-purple)",
                                  borderRadius: 4,
                                }}
                              />
                            </div>
                            <span style={{ fontWeight: 700, color: "var(--otr-accent-purple)", fontSize: 12 }}>
                              {record.matchRate.toFixed(1)}%
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: "var(--otr-text-secondary)" }}>—</span>
                        )}
                      </td>
                      <td style={{ color: "var(--otr-text-secondary)", fontSize: 11 }}>
                        {new Date(record.analyzedAt).toLocaleDateString("ko-KR")}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {record.status === "분석중" ? (
                          <span className="flex items-center justify-center gap-1 text-xs" style={{ color: "#f59e0b" }}>
                            <Clock style={{ width: 12, height: 12 }} />
                            분석중
                          </span>
                        ) : expired ? (
                          <div>
                            <span
                              style={{
                                fontSize: 10,
                                padding: "1px 6px",
                                background: "#fef2f2",
                                border: "1px solid #fca5a5",
                                color: "#dc2626",
                                fontWeight: 600,
                              }}
                            >
                              만료
                            </span>
                            <div style={{ fontSize: 9, color: "#dc2626", marginTop: 2 }}>업데이트 필요</div>
                          </div>
                        ) : (
                          <span className="flex items-center justify-center gap-1 text-xs" style={{ color: "#22c55e" }}>
                            <CheckCircle2 style={{ width: 12, height: 12 }} />
                            유효
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {record.status === "분석중" ? (
                          <button className="otr-btn-toolbar" style={{ fontSize: 10, padding: "0 6px", opacity: 0.5 }} disabled>
                            대기 중
                          </button>
                        ) : expired ? (
                          <button
                            className="otr-btn-toolbar flex items-center gap-1"
                            style={{ fontSize: 10, padding: "0 6px", color: "#dc2626", borderColor: "#fca5a5" }}
                            onClick={() => {
                              const a = CREATORS.find((c) => c.id === record.creatorA);
                              const b = CREATORS.find((c) => c.id === record.creatorB);
                              if (a && b) {
                                setSelectedCreators([a, b]);
                                setAnalyzed(false);
                                setTab("analyze");
                              }
                            }}
                          >
                            <RefreshCw style={{ width: 10, height: 10 }} />
                            재분석
                          </button>
                        ) : (
                          <button
                            className="otr-btn-toolbar"
                            style={{ fontSize: 10, padding: "0 6px" }}
                            onClick={() => {
                              const a = CREATORS.find((c) => c.id === record.creatorA);
                              const b = CREATORS.find((c) => c.id === record.creatorB);
                              if (a && b) {
                                setSelectedCreators([a, b]);
                                setTab("analyze");
                                setAnalyzed(true);
                              }
                            }}
                          >
                            재조회
                          </button>
                        )}
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
              마지막 분석일 기준 6개월 초과 시 업데이트가 필요합니다. 한 번 분석된 내역은 최대 6개월간 유효합니다.
            </div>
          </div>
        )}
      </main>
    </>
  );
}
