"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Users,
  RefreshCcw,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { featuringApi } from "@/lib/featuring-api";
import mockCampaignsJson from "@/data/mock/campaigns.json";

type CampaignJson = (typeof mockCampaignsJson)[number];

interface ThemeCampaign {
  campaignId: string;
  score: number;
  reason: string;
  reasonDetail: string;
}

interface RecommendTheme {
  theme: "성과기반" | "고객리텐션" | "유사크리에이터";
  themeLabel: string;
  themeDescription: string;
  updatedAt: string;
  campaigns: ThemeCampaign[];
}

interface CampaignRecommendation {
  creatorId: string;
  themes: RecommendTheme[];
}

const THEME_META: Record<
  string,
  { icon: React.ReactNode; color: string; badgeClass: string }
> = {
  성과기반: {
    icon: <TrendingUp className="w-4 h-4" />,
    color: "text-violet-700",
    badgeClass: "bg-violet-50 text-violet-700 border-violet-200",
  },
  고객리텐션: {
    icon: <RefreshCcw className="w-4 h-4" />,
    color: "text-emerald-700",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  유사크리에이터: {
    icon: <Users className="w-4 h-4" />,
    color: "text-blue-700",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

const STATUS_COLORS: Record<string, string> = {
  모집중: "bg-emerald-50 text-emerald-700 border-emerald-200",
  진행중: "bg-blue-50 text-blue-700 border-blue-200",
  완료: "bg-gray-50 text-gray-500 border-gray-200",
  제안: "bg-amber-50 text-amber-700 border-amber-200",
};

function ThemeCarousel({
  theme,
  campaigns,
}: {
  theme: RecommendTheme;
  campaigns: (ThemeCampaign & { campaignData: CampaignJson | null })[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const meta = THEME_META[theme.theme] || THEME_META["성과기반"];

  function checkScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 280;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <div className="space-y-3">
      {/* 테마 헤더 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={meta.color}>{meta.icon}</span>
          <div>
            <h4 className={`text-sm font-semibold ${meta.color}`}>
              {theme.themeLabel}
            </h4>
            <p className="text-xs text-muted-foreground">{theme.themeDescription}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={!canScrollLeft}
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={!canScrollRight}
            onClick={() => scroll("right")}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 가로 스크롤 캐러셀 */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-1"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {campaigns.map((item) => {
          const camp = item.campaignData;
          if (!camp) return null;
          return (
            <Link
              key={item.campaignId}
              href={`/ontner/campaign/${item.campaignId}`}
              className="shrink-0"
              style={{ scrollSnapAlign: "start", width: 248 }}
            >
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col gap-2 h-full">
                  {/* 배지 + 스코어 */}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={meta.badgeClass + " text-[11px] px-1.5 py-0"}>
                      {item.reason}
                    </Badge>
                    <span className="text-xs font-bold text-primary">
                      {item.score}점
                    </span>
                  </div>
                  {/* 캠페인명 / 브랜드 */}
                  <div>
                    <p className="text-sm font-semibold line-clamp-2 leading-snug">
                      {camp.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {camp.brand} · {camp.brandCategory}
                    </p>
                  </div>
                  {/* 상태 */}
                  <Badge
                    variant="outline"
                    className={`self-start text-[11px] px-1.5 py-0 ${STATUS_COLORS[camp.status] || ""}`}
                  >
                    {camp.status}
                  </Badge>
                  {/* 보상 */}
                  <p className="text-xs text-primary font-medium mt-auto pt-1 border-t border-border">
                    {camp.reward}
                  </p>
                  {/* 추천 이유 */}
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {item.reasonDetail}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

interface CampaignRecommendModuleProps {
  creatorId?: string;
  title?: string;
  compact?: boolean;
}

export function CampaignRecommendModule({
  creatorId = "creator-1",
  title = "나를 위한 추천 캠페인",
  compact = false,
}: CampaignRecommendModuleProps) {
  const [recommendation, setRecommendation] =
    useState<CampaignRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await featuringApi.getCampaignRecommendations(creatorId);
        setRecommendation(data as CampaignRecommendation | null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [creatorId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {compact ? null : (
          <div className="h-5 bg-muted rounded animate-pulse w-40" />
        )}
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-60 h-40 bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!recommendation) return null;

  const updatedAt = recommendation.themes[0]?.updatedAt
    ? new Date(recommendation.themes[0].updatedAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // 각 테마 캠페인 데이터 조인
  const themesWithData = recommendation.themes.map((theme) => ({
    ...theme,
    campaigns: theme.campaigns.map((item) => ({
      ...item,
      campaignData:
        mockCampaignsJson.find((c) => c.id === item.campaignId) || null,
    })),
  }));

  return (
    <div className="space-y-5">
      {!compact && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <h3 className="font-semibold text-base">{title}</h3>
          </div>
          {updatedAt && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              배치 업데이트: {updatedAt}
            </div>
          )}
        </div>
      )}

      <div className="space-y-6">
        {themesWithData.map((theme) => (
          <ThemeCarousel
            key={theme.theme}
            theme={theme}
            campaigns={theme.campaigns}
          />
        ))}
      </div>
    </div>
  );
}
