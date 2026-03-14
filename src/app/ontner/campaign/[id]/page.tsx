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
  BookmarkCheck,
  ChevronRight,
  CheckCircle2,
  XCircle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { featuringApi } from "@/lib/featuring-api";
import type { Content } from "@/types/content";
import mockBookmarksJson from "@/data/mock/campaign-bookmarks.json";
import mockProposalsJson from "@/data/mock/campaign-proposals.json";
import { CampaignRecommendModule } from "@/components/ontner/campaign-recommend-module";

/* 현재 로그인 크리에이터 (Mock) */
const CURRENT_CREATOR_ID = "creator-1";

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

  /* 찜하기 상태 */
  const [bookmarked, setBookmarked] = useState(
    mockBookmarksJson.some(
      (b) => b.creatorId === CURRENT_CREATOR_ID && b.campaignId === campaignId
    )
  );

  /* 이 캠페인에 대한 MD 제안 (대기 상태) */
  const pendingProposal = mockProposalsJson.find(
    (p) =>
      p.campaignId === campaignId &&
      p.creatorId === CURRENT_CREATOR_ID &&
      p.status === "대기"
  );
  const [proposalStatus, setProposalStatus] = useState<"대기" | "수락" | "거절" | null>(
    pendingProposal ? "대기" : null
  );

  /* 제안 수락 확인 다이얼로그 */
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);

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
        setRelatedContents(contents.filter((c) => c.campaignId !== campaignId));
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
    진행중: "default",
    모집중: "default",
    완료: "secondary",
    제안: "outline",
  };

  return (
    <>
      <PageHeader
        title={campaign.name}
        description={`${campaign.brand} · ${campaign.brandCategory}`}
        actions={
          <div className="flex items-center gap-2">
            {/* 찜하기 버튼 */}
            <Button
              variant="outline"
              size="sm"
              className={bookmarked ? "text-violet-600 border-violet-300 bg-violet-50" : ""}
              onClick={() => setBookmarked((v) => !v)}
            >
              {bookmarked ? (
                <>
                  <BookmarkCheck className="h-4 w-4 mr-1" />
                  저장됨
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 mr-1" />
                  저장
                </>
              )}
            </Button>

            {/* 참여 신청 버튼 */}
            <Button
              size="sm"
              disabled={applied || campaign.status === "완료"}
              onClick={() => setApplied(true)}
            >
              {applied ? "신청 완료" : "참여 신청"}
            </Button>
          </div>
        }
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* MD 제안 배너 */}
        {proposalStatus && (
          <Card className={`border-2 ${proposalStatus === "대기" ? "border-violet-200 bg-violet-50/50" : proposalStatus === "수락" ? "border-emerald-200 bg-emerald-50/50" : "border-gray-200"}`}>
            <CardContent className="p-4">
              {proposalStatus === "대기" && (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-violet-800 mb-0.5">
                      이 캠페인에 참여 제안이 왔어요!
                    </p>
                    <p className="text-xs text-violet-600">
                      {pendingProposal?.message ?? "MD로부터 이 캠페인에 참여 제안이 도착했습니다."}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      className="bg-violet-600 hover:bg-violet-700 h-8"
                      onClick={() => setAcceptDialogOpen(true)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      수락
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setProposalStatus("거절")}
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      거절
                    </Button>
                  </div>
                </div>
              )}
              {proposalStatus === "수락" && (
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <p className="text-sm font-medium">제안을 수락했습니다. 캠페인이 진행됩니다.</p>
                </div>
              )}
              {proposalStatus === "거절" && (
                <div className="flex items-center gap-2 text-gray-500">
                  <XCircle className="h-4 w-4" />
                  <p className="text-sm">제안을 거절했습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
                  <p className="text-sm font-medium">{campaign.contentCount}건</p>
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
        <div className="flex gap-3 justify-center">
          <Button
            size="lg"
            className="flex-1 max-w-sm"
            disabled={applied || campaign.status === "완료"}
            onClick={() => setApplied(true)}
          >
            {applied
              ? "참여 신청 완료"
              : campaign.status === "완료"
                ? "종료된 캠페인"
                : "이 캠페인에 참여 신청하기"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className={`shrink-0 ${bookmarked ? "text-violet-600 border-violet-300 bg-violet-50" : ""}`}
            onClick={() => setBookmarked((v) => !v)}
          >
            {bookmarked ? (
              <BookmarkCheck className="h-5 w-5" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
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
        {/* O-C-06: 캠페인 추천 모듈 */}
        <div className="rounded-lg border bg-card p-5 space-y-4">
          <CampaignRecommendModule
            creatorId="creator-1"
            title="이런 캠페인은 어떠세요?"
          />
        </div>
      </main>

      {/* 제안 수락 확인 다이얼로그 */}
      <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>제안을 수락하시겠어요?</DialogTitle>
            <DialogDescription>
              &ldquo;{campaign?.name}&rdquo; 캠페인 참여 제안을 수락합니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAcceptDialogOpen(false)}>
              취소
            </Button>
            <Button
              className="bg-violet-600 hover:bg-violet-700"
              onClick={() => {
                setProposalStatus("수락");
                setAcceptDialogOpen(false);
              }}
            >
              수락하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
