"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { OtrFormGrid } from "./otr-form-grid";
import { OtrFormField } from "./otr-form-field";
import { OtrRangeInput } from "./otr-range-input";

const CATEGORIES = ["뷰티", "패션", "푸드", "테크", "리빙", "육아", "헬스", "여행", "라이프스타일", "인테리어"];

const UPLOAD_PERIODS = [
  { value: "", label: "전체" },
  { value: "1w", label: "1주 이하" },
  { value: "1m", label: "1개월 이하" },
  { value: "3m", label: "3개월 이하" },
  { value: "6m", label: "6개월 이하" },
  { value: "6m+", label: "6개월 이상" },
];

const AGE_OPTIONS = [
  { value: "", label: "전체" },
  { value: "17", label: "~17세" },
  { value: "25", label: "18~24세" },
  { value: "35", label: "25~34세" },
  { value: "45", label: "35~44세" },
  { value: "55", label: "45~54세" },
  { value: "100", label: "55세+" },
];

export interface AdvancedFilterState {
  selectedCategories: string[];
  recentUploadPeriod: string;
  followerMin: string;
  followerMax: string;
  hasVerificationBadge: string;
  avgFeedLikesMin: string;
  avgFeedLikesMax: string;
  avgVideoLikesMin: string;
  avgVideoLikesMax: string;
  avgVideoViewsMin: string;
  avgVideoViewsMax: string;
  erMin: string;
  erMax: string;
  estimatedReachMin: string;
  estimatedReachMax: string;
  avgShortsViewsMin: string;
  avgShortsViewsMax: string;
  audienceGender: string;
  audienceAgeMin: string;
  audienceAgeMax: string;
}

export const defaultAdvancedFilters: AdvancedFilterState = {
  selectedCategories: [],
  recentUploadPeriod: "",
  followerMin: "",
  followerMax: "",
  hasVerificationBadge: "all",
  avgFeedLikesMin: "",
  avgFeedLikesMax: "",
  avgVideoLikesMin: "",
  avgVideoLikesMax: "",
  avgVideoViewsMin: "",
  avgVideoViewsMax: "",
  erMin: "",
  erMax: "",
  estimatedReachMin: "",
  estimatedReachMax: "",
  avgShortsViewsMin: "",
  avgShortsViewsMax: "",
  audienceGender: "all",
  audienceAgeMin: "",
  audienceAgeMax: "",
};

interface OtrAdvancedFilterPanelProps {
  platform: "instagram" | "youtube" | "";
  filters: AdvancedFilterState;
  onChange: (filters: AdvancedFilterState) => void;
}

function countActiveFilters(filters: AdvancedFilterState): number {
  let count = 0;
  if (filters.selectedCategories.length > 0) count++;
  if (filters.recentUploadPeriod) count++;
  if (filters.followerMin || filters.followerMax) count++;
  if (filters.hasVerificationBadge !== "all") count++;
  if (filters.avgFeedLikesMin || filters.avgFeedLikesMax) count++;
  if (filters.avgVideoLikesMin || filters.avgVideoLikesMax) count++;
  if (filters.avgVideoViewsMin || filters.avgVideoViewsMax) count++;
  if (filters.erMin || filters.erMax) count++;
  if (filters.estimatedReachMin || filters.estimatedReachMax) count++;
  if (filters.avgShortsViewsMin || filters.avgShortsViewsMax) count++;
  if (filters.audienceGender !== "all") count++;
  if (filters.audienceAgeMin || filters.audienceAgeMax) count++;
  return count;
}

export function OtrAdvancedFilterPanel({ platform, filters, onChange }: OtrAdvancedFilterPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const activeCount = countActiveFilters(filters);

  const update = (partial: Partial<AdvancedFilterState>) => {
    onChange({ ...filters, ...partial });
  };

  const toggleCategory = (cat: string) => {
    const prev = filters.selectedCategories;
    update({
      selectedCategories: prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    });
  };

  const isYoutube = platform === "youtube";

  return (
    <div
      style={{
        border: "1px solid var(--otr-border)",
        background: "var(--otr-bg-toolbar)",
        borderRadius: 4,
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--otr-text-primary)",
        }}
      >
        <span>
          고급 필터
          {activeCount > 0 && (
            <span
              style={{
                marginLeft: 6,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "var(--otr-accent-purple)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {activeCount}
            </span>
          )}
        </span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {expanded && (
        <div style={{ padding: "4px 12px 12px" }}>
          {/* 인플루언서 정보 */}
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--otr-text-secondary)", marginBottom: 6, marginTop: 4 }}>
            [인플루언서 정보]
          </div>
          <OtrFormGrid columns={4}>
            <OtrFormField label="카테고리" span={3}>
              <div className="flex flex-wrap gap-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={filters.selectedCategories.includes(cat) ? "otr-classification-active" : "otr-classification"}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </OtrFormField>

            <OtrFormField label="최근 콘텐츠 업로드">
              <select
                className="w-full"
                value={filters.recentUploadPeriod}
                onChange={(e) => update({ recentUploadPeriod: e.target.value })}
              >
                {UPLOAD_PERIODS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </OtrFormField>

            <OtrFormField label={isYoutube ? "구독자 수" : "팔로워 수"}>
              <OtrRangeInput
                minValue={filters.followerMin}
                maxValue={filters.followerMax}
                onMinChange={(v) => update({ followerMin: v })}
                onMaxChange={(v) => update({ followerMax: v })}
              />
            </OtrFormField>

            {!isYoutube && (
              <OtrFormField label="인증 배지">
                <select
                  className="w-full"
                  value={filters.hasVerificationBadge}
                  onChange={(e) => update({ hasVerificationBadge: e.target.value })}
                >
                  <option value="all">전체</option>
                  <option value="yes">있음</option>
                  <option value="no">없음</option>
                </select>
              </OtrFormField>
            )}
          </OtrFormGrid>

          {/* 콘텐츠 지표 */}
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--otr-text-secondary)", marginBottom: 6, marginTop: 12 }}>
            [콘텐츠 지표]
          </div>
          <OtrFormGrid columns={4}>
            {!isYoutube && (
              <OtrFormField label="평균 피드 좋아요 수">
                <OtrRangeInput
                  minValue={filters.avgFeedLikesMin}
                  maxValue={filters.avgFeedLikesMax}
                  onMinChange={(v) => update({ avgFeedLikesMin: v })}
                  onMaxChange={(v) => update({ avgFeedLikesMax: v })}
                />
              </OtrFormField>
            )}

            {isYoutube && (
              <OtrFormField label="평균 쇼츠 조회 수">
                <OtrRangeInput
                  minValue={filters.avgShortsViewsMin}
                  maxValue={filters.avgShortsViewsMax}
                  onMinChange={(v) => update({ avgShortsViewsMin: v })}
                  onMaxChange={(v) => update({ avgShortsViewsMax: v })}
                />
              </OtrFormField>
            )}

            {!isYoutube && (
              <OtrFormField label="평균 동영상 좋아요 수">
                <OtrRangeInput
                  minValue={filters.avgVideoLikesMin}
                  maxValue={filters.avgVideoLikesMax}
                  onMinChange={(v) => update({ avgVideoLikesMin: v })}
                  onMaxChange={(v) => update({ avgVideoLikesMax: v })}
                />
              </OtrFormField>
            )}

            <OtrFormField label="평균 동영상 조회 수">
              <OtrRangeInput
                minValue={filters.avgVideoViewsMin}
                maxValue={filters.avgVideoViewsMax}
                onMinChange={(v) => update({ avgVideoViewsMin: v })}
                onMaxChange={(v) => update({ avgVideoViewsMax: v })}
              />
            </OtrFormField>

            <OtrFormField label="ER(%)">
              <OtrRangeInput
                minValue={filters.erMin}
                maxValue={filters.erMax}
                onMinChange={(v) => update({ erMin: v })}
                onMaxChange={(v) => update({ erMax: v })}
                minPlaceholder="최소%"
                maxPlaceholder="최대%"
              />
            </OtrFormField>

            {!isYoutube && (
              <OtrFormField label="예상 평균 도달 수">
                <OtrRangeInput
                  minValue={filters.estimatedReachMin}
                  maxValue={filters.estimatedReachMax}
                  onMinChange={(v) => update({ estimatedReachMin: v })}
                  onMaxChange={(v) => update({ estimatedReachMax: v })}
                />
              </OtrFormField>
            )}
          </OtrFormGrid>

          {/* 오디언스 */}
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--otr-text-secondary)", marginBottom: 6, marginTop: 12 }}>
            [오디언스]
          </div>
          <OtrFormGrid columns={4}>
            <OtrFormField label="주요 오디언스 성별">
              <select
                className="w-full"
                value={filters.audienceGender}
                onChange={(e) => update({ audienceGender: e.target.value })}
              >
                <option value="all">전체</option>
                <option value="female">여성</option>
                <option value="male">남성</option>
              </select>
            </OtrFormField>

            <OtrFormField label="주요 오디언스 나이">
              <div className="flex items-center gap-1">
                <select
                  className="flex-1"
                  value={filters.audienceAgeMin}
                  onChange={(e) => update({ audienceAgeMin: e.target.value })}
                >
                  {AGE_OPTIONS.map((opt) => (
                    <option key={`min-${opt.value}`} value={opt.value}>{opt.value ? opt.label : "최소"}</option>
                  ))}
                </select>
                <span className="text-muted-foreground text-xs shrink-0">~</span>
                <select
                  className="flex-1"
                  value={filters.audienceAgeMax}
                  onChange={(e) => update({ audienceAgeMax: e.target.value })}
                >
                  {AGE_OPTIONS.map((opt) => (
                    <option key={`max-${opt.value}`} value={opt.value}>{opt.value ? opt.label : "최대"}</option>
                  ))}
                </select>
              </div>
            </OtrFormField>
          </OtrFormGrid>
        </div>
      )}
    </div>
  );
}
