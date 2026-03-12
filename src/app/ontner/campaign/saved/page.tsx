"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, BookmarkX, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import mockBookmarksJson from "@/data/mock/campaign-bookmarks.json";
import mockCampaignsJson from "@/data/mock/campaigns.json";

/* 현재 로그인 크리에이터 (Mock) */
const CURRENT_CREATOR_ID = "creator-1";

const STATUS_COLORS: Record<string, string> = {
  모집중: "bg-emerald-50 text-emerald-700 border-emerald-200",
  진행중: "bg-blue-50 text-blue-700 border-blue-200",
  완료: "bg-gray-50 text-gray-600 border-gray-200",
  제안: "bg-amber-50 text-amber-700 border-amber-200",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
  });
}

export default function OntnerSavedCampaignsPage() {
  const [bookmarks, setBookmarks] = useState(
    mockBookmarksJson.filter((b) => b.creatorId === CURRENT_CREATOR_ID)
  );

  const savedCampaigns = bookmarks
    .map((b) => {
      const campaign = mockCampaignsJson.find((c) => c.id === b.campaignId);
      return campaign ? { ...b, campaign } : null;
    })
    .filter(Boolean) as Array<(typeof bookmarks)[0] & { campaign: (typeof mockCampaignsJson)[0] }>;

  function removeBookmark(campaignId: string) {
    setBookmarks((prev) => prev.filter((b) => b.campaignId !== campaignId));
  }

  return (
    <>
      <PageHeader
        title="저장한 캠페인"
        description={`총 ${savedCampaigns.length}개의 캠페인을 저장했습니다`}
      />

      <main className="flex-1 p-4 md:p-6">
        {savedCampaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <Bookmark className="h-10 w-10 opacity-30" />
            <p className="text-sm">저장한 캠페인이 없습니다.</p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/ontner/campaign/explore">캠페인 탐색하기</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {savedCampaigns.map(({ campaign, savedAt }) => (
              <Card key={campaign.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[11px] px-1.5 py-0.5 rounded border font-medium ${STATUS_COLORS[campaign.status] ?? ""}`}
                        >
                          {campaign.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {campaign.brandCategory}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          저장일 {formatDate(savedAt)}
                        </span>
                      </div>
                      <Link
                        href={`/ontner/campaign/${campaign.id}`}
                        className="group flex items-center gap-1"
                      >
                        <p className="text-sm font-semibold group-hover:text-violet-600 transition-colors">
                          {campaign.name}
                        </p>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-violet-600" />
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {campaign.brand} · {campaign.reward}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {campaign.startDate} ~ {campaign.endDate}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-violet-500 hover:text-red-500 hover:bg-red-50"
                      onClick={() => removeBookmark(campaign.id)}
                      title="저장 취소"
                    >
                      <BookmarkX className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
