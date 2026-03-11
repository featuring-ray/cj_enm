"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Gift,
  Building2,
  FileText,
  Heart,
  MessageCircle,
  Bookmark,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { featuringApi } from "@/lib/featuring-api";
import type { Content } from "@/types/content";

type CampaignJson = {
  id: string;
  name: string;
  brand: string;
  brandCategory: string;
  status: string;
  startDate: string;
  endDate: string;
  reward: string;
  description: string;
  contentCount: number;
  creators: string[];
};

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<CampaignJson | null>(null);
  const [relatedContents, setRelatedContents] = useState<Content[]>([]);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    async function load() {
      const campaigns = await featuringApi.getNewCampaigns();
      const found = campaigns.find((c) => c.id === campaignId) || null;
      setCampaign(found);

      if (found) {
        const contents = await featuringApi.getContents({
          category: found.brandCategory,
          sortBy: "engagementScore",
          limit: 6,
        });
        // Filter out contents from same campaign
        setRelatedContents(
          contents.filter((c) => c.campaignId !== campaignId)
        );
      }
    }
    load();
  }, [campaignId]);

  if (!campaign) {
    return (
      <>
        <PageHeader title="캠페인 상세" />
        <main className="flex-1 p-4 md:p-6">
          <p className="text-sm text-muted-foreground text-center py-12">
            캠페인을 찾을 수 없습니다.
          </p>
        </main>
      </>
    );
  }

  const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    "진행중": "default",
    "모집중": "default",
    "완료": "secondary",
    "제안": "outline",
  };

  return (
    <>
      <PageHeader
        title={campaign.name}
        description={`${campaign.brand} · ${campaign.brandCategory}`}
        actions={
          <Button
            size="sm"
            disabled={applied || campaign.status === "완료"}
            onClick={() => setApplied(true)}
          >
            {applied ? "신청 완료" : "참여 신청"}
          </Button>
        }
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Campaign Basic Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">캠페인 정보</CardTitle>
              <Badge variant={STATUS_VARIANTS[campaign.status] || "outline"}>
                {campaign.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">브랜드</p>
                  <p className="text-sm font-medium">{campaign.brand}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">기간</p>
                  <p className="text-sm font-medium">
                    {campaign.startDate} ~ {campaign.endDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Gift className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">보상</p>
                  <p className="text-sm font-medium">{campaign.reward}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">콘텐츠</p>
                  <p className="text-sm font-medium">
                    {campaign.contentCount}건
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">상세 설명</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {campaign.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Apply Button (prominent) */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="w-full max-w-md"
            disabled={applied || campaign.status === "완료"}
            onClick={() => setApplied(true)}
          >
            {applied
              ? "참여 신청 완료"
              : campaign.status === "완료"
                ? "종료된 캠페인"
                : "이 캠페인에 참여 신청하기"}
          </Button>
        </div>

        {/* Related Content Recommendations */}
        {relatedContents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                이 캠페인과 어울리는 콘텐츠
              </CardTitle>
              <CardDescription>
                {campaign.brandCategory} 카테고리 참여도 상위 콘텐츠
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedContents.map((content) => (
                  <div
                    key={content.id}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      if (content.campaignId) {
                        router.push(`/ontner/campaign/${content.campaignId}`);
                      }
                    }}
                  >
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        {content.thumbnail}
                      </span>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {content.type}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {content.platform}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-auto">
                          점수 {content.engagementScore.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {content.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {content.comments.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bookmark className="h-3 w-3" />
                          {content.saves.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
