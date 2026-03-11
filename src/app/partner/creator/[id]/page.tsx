"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, Heart, MessageCircle, Eye } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { featuringApi } from "@/lib/featuring-api";
import type { Creator } from "@/types/creator";
import type { Campaign } from "@/types/campaign";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
  draft: "초안",
  proposed: "제안됨",
  in_progress: "진행 중",
  completed: "완료",
};

function formatNumber(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString("ko-KR");
}

export default function PartnerCreatorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [c, detail] = await Promise.all([
          featuringApi.getCreatorById(id),
          featuringApi.getCreatorDetailReport(id),
        ]);
        if (!c || !c.isOntnerMember) {
          setCreator(null);
          setLoading(false);
          return;
        }
        setCreator(c);
        setRecentCampaigns(detail?.recentCampaigns ?? []);
      } catch (err) {
        console.error("크리에이터 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <PageHeader title="크리에이터 상세" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="flex flex-col flex-1">
        <PageHeader title="크리에이터 상세" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              크리에이터를 찾을 수 없거나 온트너 회원이 아닙니다.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/partner/creator")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <PageHeader
        title={creator.displayName}
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/partner/creator")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            목록
          </Button>
        }
      />

      <div className="flex-1 p-6 space-y-6">
        {/* 기본 프로필 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">기본 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">핸들</p>
                <p className="font-medium">@{creator.username}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">플랫폼</p>
                <p className="font-medium capitalize">{creator.platform}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">팔로워</p>
                <p className="font-medium">
                  {formatNumber(creator.followerCount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">참여율</p>
                <p className="font-medium">
                  {creator.engagementRate.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">카테고리</p>
              <div className="flex gap-2 flex-wrap">
                {creator.categories.map((cat) => (
                  <Badge key={cat} variant="secondary">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 참여 지표 요약 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">참여 지표 요약</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">팔로워</p>
                  <p className="font-semibold">
                    {formatNumber(creator.followerCount)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Heart className="h-5 w-5 text-rose-500" />
                <div>
                  <p className="text-xs text-muted-foreground">평균 좋아요</p>
                  <p className="font-semibold">
                    {formatNumber(creator.averageLikes)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <MessageCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">평균 댓글</p>
                  <p className="font-semibold">
                    {formatNumber(creator.averageComments)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Eye className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">평균 조회수</p>
                  <p className="font-semibold">
                    {formatNumber(creator.averageViews)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 최근 캠페인 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">최근 캠페인</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentCampaigns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                참여한 캠페인이 없습니다
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>캠페인명</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>카테고리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">
                        {campaign.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {CAMPAIGN_STATUS_LABELS[campaign.status] ??
                            campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {campaign.category}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
