"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Users,
  Heart,
  MessageSquare,
  TrendingUp,
  Star,
  Bookmark,
  Send,
  AlertTriangle,
  Eye,
  Share2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { PageHeader } from "@/components/layout/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { featuringApi } from "@/lib/featuring-api";
import type { Creator } from "@/types/creator";
import type { CreatorScoring } from "@/types/analytics";
import type { Campaign } from "@/types/campaign";

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return n.toLocaleString("ko-KR");
}

const TIER_COLORS: Record<string, string> = {
  S: "bg-yellow-100 text-yellow-800 border-yellow-300",
  A: "bg-purple-100 text-purple-800 border-purple-300",
  B: "bg-blue-100 text-blue-800 border-blue-300",
  C: "bg-green-100 text-green-800 border-green-300",
  D: "bg-gray-100 text-gray-800 border-gray-300",
};

const MOCK_AUDIENCE_GENDER = [
  { label: "여성 18-24", value: 22 },
  { label: "여성 25-34", value: 35 },
  { label: "여성 35-44", value: 18 },
  { label: "남성 18-24", value: 8 },
  { label: "남성 25-34", value: 12 },
  { label: "남성 35-44", value: 5 },
];

const MOCK_REGION = [
  { region: "서울", ratio: 38 },
  { region: "경기", ratio: 22 },
  { region: "부산", ratio: 8 },
  { region: "대구", ratio: 5 },
  { region: "인천", ratio: 7 },
  { region: "기타", ratio: 20 },
];

const MOCK_CONTENT_ENGAGEMENT = [
  { date: "2월 1주", likes: 4200, comments: 320, shares: 180 },
  { date: "2월 2주", likes: 5100, comments: 410, shares: 220 },
  { date: "2월 3주", likes: 3800, comments: 280, shares: 150 },
  { date: "2월 4주", likes: 6200, comments: 520, shares: 310 },
  { date: "3월 1주", likes: 7100, comments: 610, shares: 380 },
  { date: "3월 2주", likes: 5800, comments: 480, shares: 260 },
];

export default function CreatorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [creator, setCreator] = useState<Creator | null>(null);
  const [scoring, setScoring] = useState<CreatorScoring | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const report = await featuringApi.getCreatorDetailReport(id);
        setCreator(report.creator);
        setScoring(report.scoring);
        setCampaigns(report.recentCampaigns);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading || !creator || !scoring) {
    return (
      <>
        <PageHeader title="크리에이터 상세" description="로딩 중..." />
        <main className="flex-1 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-64 bg-muted rounded-lg" />
          </div>
        </main>
      </>
    );
  }

  const statusLabels: Record<string, string> = {
    draft: "초안",
    proposed: "제안됨",
    in_progress: "진행중",
    completed: "완료",
    cancelled: "취소",
  };

  return (
    <>
      <PageHeader
        title={`${creator.displayName} 상세`}
        description="크리에이터 프로필 및 성과 분석"
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl font-bold">
                  {creator.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{creator.displayName}</h2>
                  <Badge
                    variant="outline"
                    className={TIER_COLORS[scoring.tier] || ""}
                  >
                    {scoring.tier} 티어
                  </Badge>
                  {creator.isOntnerMember && (
                    <Badge variant="secondary" className="text-xs">
                      온트너 회원
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  @{creator.username} · {creator.platform}
                </p>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">팔로워</span>{" "}
                    <span className="font-semibold">{formatNumber(creator.followerCount)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">참여율</span>{" "}
                    <span className="font-semibold">{creator.engagementRate}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">스코어</span>{" "}
                    <span className="font-semibold">{scoring.overallScore}점</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">카테고리</span>{" "}
                    {creator.categories.map((cat) => (
                      <Badge key={cat} variant="outline" className="text-xs ml-1">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scoring KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="참여 점수"
            value={`${scoring.engagementScore}점`}
            icon={Heart}
            description="콘텐츠 인터랙션 기반"
          />
          <StatsCard
            title="전환 점수"
            value={`${scoring.conversionScore}점`}
            icon={TrendingUp}
            description="구매 전환 효율"
          />
          <StatsCard
            title="성장 점수"
            value={`${scoring.growthScore}점`}
            icon={Users}
            description="팔로워 증가세"
          />
          <StatsCard
            title="일관성 점수"
            value={`${scoring.consistencyScore}점`}
            icon={Star}
            description="업로드 빈도 기반"
          />
        </div>

        {/* Audience Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">성별/연령대 분포</CardTitle>
              <CardDescription>콘텐츠 반응 기준 오디언스 분석</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={MOCK_AUDIENCE_GENDER} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 40]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="label" width={90} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">지역 분포</CardTitle>
              <CardDescription>팔로워 지역 분석</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={MOCK_REGION}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Bar dataKey="ratio" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            콘텐츠 반응 기준 예측 데이터 (실제 팔로워 기준과 다를 수 있음)
          </span>
        </div>

        {/* Content Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">콘텐츠 반응 추이</CardTitle>
            <CardDescription>최근 6주간 콘텐츠 인터랙션 추이</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={MOCK_CONTENT_ENGAGEMENT}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="likes" stroke="hsl(var(--primary))" name="좋아요" strokeWidth={2} />
                <Line type="monotone" dataKey="comments" stroke="#f59e0b" name="댓글" strokeWidth={2} />
                <Line type="monotone" dataKey="shares" stroke="#10b981" name="공유" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">캠페인 이력</CardTitle>
            <CardDescription>참여했거나 제안받은 캠페인 목록</CardDescription>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                캠페인 이력이 없습니다
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>캠페인명</TableHead>
                    <TableHead>브랜드</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>기간</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium text-sm">{c.title}</TableCell>
                      <TableCell className="text-sm">{c.brandName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{c.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {statusLabels[c.status] || c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(c.startDate).toLocaleDateString("ko-KR")} ~{" "}
                        {new Date(c.endDate).toLocaleDateString("ko-KR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              featuringApi.toggleBookmark(creator.id);
              alert("북마크에 추가되었습니다.");
            }}
          >
            <Bookmark className="h-4 w-4 mr-1.5" />
            북마크에 추가
          </Button>
          <Button variant="outline">
            <Send className="h-4 w-4 mr-1.5" />
            DM 발송
          </Button>
          <Button>
            <MessageSquare className="h-4 w-4 mr-1.5" />
            캠페인 제안
          </Button>
        </div>
      </main>
    </>
  );
}
