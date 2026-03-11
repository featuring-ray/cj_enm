"use client";

import { useState } from "react";
import {
  PlayCircle,
  FileCheck,
  Send,
  CheckCircle2,
  Bell,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ── CJ 내부 자체 개발 범위 — 목업 레이아웃만 구현 ── */

const mockPerformanceTrend = [
  { date: "03/01", views: 4200, likes: 320, comments: 45 },
  { date: "03/02", views: 5100, likes: 410, comments: 62 },
  { date: "03/03", views: 3800, likes: 290, comments: 38 },
  { date: "03/04", views: 6200, likes: 520, comments: 78 },
  { date: "03/05", views: 7500, likes: 610, comments: 92 },
  { date: "03/06", views: 5900, likes: 480, comments: 55 },
  { date: "03/07", views: 8100, likes: 680, comments: 105 },
  { date: "03/08", views: 7200, likes: 590, comments: 88 },
  { date: "03/09", views: 9400, likes: 780, comments: 112 },
  { date: "03/10", views: 8800, likes: 720, comments: 98 },
];

const mockActiveCampaigns = [
  {
    id: "campaign-1",
    name: "올리브영 봄 신상 공구",
    avgLikes: 12400,
    avgComments: 890,
    avgSaves: 2100,
  },
  {
    id: "campaign-2",
    name: "CJ제일제당 비비고 봄 캠페인",
    avgLikes: 9800,
    avgComments: 1230,
    avgSaves: 1800,
  },
];

const mockNotifications = [
  {
    id: "n1",
    type: "campaign" as const,
    message: "무신사 봄 컬렉션 공구 캠페인이 모집중입니다.",
    date: "2026-03-11",
    isNew: true,
  },
  {
    id: "n2",
    type: "system" as const,
    message: "3월 정산 예정일: 2026-03-25",
    date: "2026-03-10",
    isNew: true,
  },
  {
    id: "n3",
    type: "campaign" as const,
    message: "올리브영 봄 신상 공구 캠페인 성과가 업데이트되었습니다.",
    date: "2026-03-09",
    isNew: false,
  },
  {
    id: "n4",
    type: "system" as const,
    message: "온트너 포털 v2.0 업데이트 안내",
    date: "2026-03-08",
    isNew: false,
  },
  {
    id: "n5",
    type: "campaign" as const,
    message: "CJ더마켓 식품 기획전 새 캠페인이 등록되었습니다.",
    date: "2026-03-07",
    isNew: false,
  },
];

export default function CreatorDashboardPage() {
  const [selectedLine, setSelectedLine] = useState<"views" | "likes" | "comments">("views");

  return (
    <>
      <PageHeader
        title="내 대시보드"
        description="CJ 내부 자체 개발 범위 — 목업 레이아웃만 구현"
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Campaign Progress Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="진행중"
            value="2"
            description="현재 활성 캠페인"
            icon={PlayCircle}
            trend={{ value: "+1", positive: true }}
          />
          <StatsCard
            title="신청"
            value="3"
            description="참여 신청한 캠페인"
            icon={FileCheck}
          />
          <StatsCard
            title="제안"
            value="5"
            description="수신된 제안"
            icon={Send}
            trend={{ value: "+2", positive: true }}
          />
          <StatsCard
            title="완료"
            value="8"
            description="누적 완료 캠페인"
            icon={CheckCircle2}
          />
        </div>

        {/* Campaign Performance Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">캠페인 성과 트렌드</CardTitle>
            <CardDescription>최근 10일간 콘텐츠 성과 추이</CardDescription>
            <div className="flex gap-2 pt-2">
              {(
                [
                  { key: "views", label: "조회수", color: "#6366f1" },
                  { key: "likes", label: "좋아요", color: "#f43f5e" },
                  { key: "comments", label: "댓글", color: "#10b981" },
                ] as const
              ).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setSelectedLine(item.key)}
                  className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                    selectedLine === item.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={mockPerformanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                {selectedLine === "views" && (
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#6366f1"
                    strokeWidth={2}
                    name="조회수"
                  />
                )}
                {selectedLine === "likes" && (
                  <Line
                    type="monotone"
                    dataKey="likes"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    name="좋아요"
                  />
                )}
                {selectedLine === "comments" && (
                  <Line
                    type="monotone"
                    dataKey="comments"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="댓글"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Campaign Engagement Averages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">진행중 캠페인 참여 평균</CardTitle>
              <CardDescription>현재 활성 캠페인별 평균 참여 지표</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActiveCampaigns.map((c) => (
                  <div key={c.id} className="border rounded-lg p-3 space-y-2">
                    <p className="text-sm font-medium">{c.name}</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">평균 좋아요</p>
                        <p className="text-sm font-semibold">
                          {c.avgLikes.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">평균 댓글</p>
                        <p className="text-sm font-semibold">
                          {c.avgComments.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">평균 저장</p>
                        <p className="text-sm font-semibold">
                          {c.avgSaves.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications / Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                최근 알림
              </CardTitle>
              <CardDescription>공지사항 및 캠페인 알림</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 py-2 border-b last:border-0"
                  >
                    <div
                      className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                        n.isNew ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge
                          variant={n.type === "campaign" ? "default" : "secondary"}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {n.type === "campaign" ? "캠페인" : "시스템"}
                        </Badge>
                        {n.isNew && (
                          <span className="text-[10px] text-blue-500 font-medium">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-sm truncate">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {n.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
