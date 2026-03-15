"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, TrendingUp, RefreshCcw, Users, ChevronRight } from "lucide-react";
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

const THEME_CONFIG: Record<
  string,
  {
    icon: React.ElementType;
    gradientClass: string;
    bgClass: string;
    badgeClass: string;
    scoreClass: string;
    dotActive: string;
  }
> = {
  성과기반: {
    icon: TrendingUp,
    gradientClass: "from-violet-600 to-violet-800",
    bgClass: "bg-violet-50",
    badgeClass: "bg-violet-100 text-violet-700",
    scoreClass: "text-violet-600",
    dotActive: "bg-white",
  },
  고객리텐션: {
    icon: RefreshCcw,
    gradientClass: "from-emerald-600 to-emerald-800",
    bgClass: "bg-emerald-50",
    badgeClass: "bg-emerald-100 text-emerald-700",
    scoreClass: "text-emerald-600",
    dotActive: "bg-white",
  },
  유사크리에이터: {
    icon: Users,
    gradientClass: "from-blue-600 to-blue-800",
    bgClass: "bg-blue-50",
    badgeClass: "bg-blue-100 text-blue-700",
    scoreClass: "text-blue-600",
    dotActive: "bg-white",
  },
};

const ROTATE_INTERVAL = 5000;

interface OntnRecommendBannerProps {
  creatorId?: string;
}

export function OntnRecommendBanner({
  creatorId = "creator-1",
}: OntnRecommendBannerProps) {
  const [recommendation, setRecommendation] =
    useState<CampaignRecommendation | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    featuringApi
      .getCampaignRecommendations(creatorId)
      .then((data) => setRecommendation(data as CampaignRecommendation | null));
  }, [creatorId]);

  useEffect(() => {
    if (!recommendation) return;
    const len = recommendation.themes.length;
    timerRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % len);
        setFading(false);
      }, 300);
    }, ROTATE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recommendation]);

  function goTo(i: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    setFading(true);
    setTimeout(() => {
      setActiveIndex(i);
      setFading(false);
    }, 200);
    if (recommendation) {
      timerRef.current = setInterval(() => {
        setFading(true);
        setTimeout(() => {
          setActiveIndex((prev) => (prev + 1) % recommendation.themes.length);
          setFading(false);
        }, 300);
      }, ROTATE_INTERVAL);
    }
  }

  if (!recommendation) return null;

  const theme = recommendation.themes[activeIndex];
  const config = THEME_CONFIG[theme.theme] ?? THEME_CONFIG["성과기반"];
  const Icon = config.icon;

  const cards = theme.campaigns
    .map((item) => ({
      ...item,
      campaignData:
        (mockCampaignsJson.find((c) => c.id === item.campaignId) as CampaignJson | undefined) ??
        null,
    }))
    .filter((item) => item.campaignData !== null)
    .slice(0, 4);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
      {/* Gradient header */}
      <div
        className={`bg-gradient-to-r ${config.gradientClass} px-4 py-2.5 flex items-center justify-between`}
      >
        <div className="flex items-center gap-2 text-white min-w-0">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs font-bold shrink-0">AI 맞춤 추천</span>
          <span className="text-white/50 text-xs">·</span>
          <span className="text-white/80 text-xs truncate">{theme.themeLabel}</span>
        </div>
        {/* Dot indicators */}
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {recommendation.themes.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-4 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content area */}
      <div
        className={`${config.bgClass} px-4 pt-3 pb-4 transition-opacity duration-300 ${
          fading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Theme description row */}
        <div className="flex items-center gap-1.5 mb-3">
          <Icon className={`w-3.5 h-3.5 ${config.scoreClass} shrink-0`} />
          <p className="text-xs text-gray-500 line-clamp-1">{theme.themeDescription}</p>
        </div>

        {/* Horizontal scroll campaign cards */}
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-0.5">
          {cards.map((item) => {
            const camp = item.campaignData!;
            return (
              <Link
                key={item.campaignId}
                href={`/ontner/campaign/${item.campaignId}`}
                className="shrink-0 w-[136px] bg-white rounded-lg border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all p-2.5 flex flex-col gap-1.5"
              >
                {/* Score + reason badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${config.badgeClass}`}
                  >
                    {item.reason}
                  </span>
                  <span className={`text-[11px] font-bold ${config.scoreClass}`}>
                    {item.score}
                  </span>
                </div>

                {/* Brand image placeholder */}
                <div className="w-full aspect-square rounded bg-gray-50 flex items-center justify-center text-[10px] text-gray-400 border border-gray-100 overflow-hidden relative">
                  {camp.imageUrl ? (
                    <img 
                      src={camp.imageUrl} 
                      alt={camp.brand}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    camp.brand
                  )}
                </div>

                {/* Campaign name */}
                <p className="text-[11px] font-medium text-gray-800 line-clamp-2 leading-snug">
                  {camp.name}
                </p>

                {/* Category + reward */}
                <p className="text-[10px] text-gray-400">{camp.brandCategory}</p>
                <p className={`text-[10px] font-medium ${config.scoreClass} truncate`}>
                  {camp.reward}
                </p>
              </Link>
            );
          })}

          {/* More arrow */}
          <div className="shrink-0 w-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Reason detail of first item */}
        {cards[0] && (
          <p className="mt-2 text-[11px] text-gray-400 line-clamp-1">
            <span className={`font-medium ${config.scoreClass}`}>
              추천 이유:
            </span>{" "}
            {cards[0].reasonDetail}
          </p>
        )}
      </div>
    </div>
  );
}
