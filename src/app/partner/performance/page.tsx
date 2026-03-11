"use client";

import { TrendingUp, ShoppingCart, Percent } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_MAP: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  in_progress: { label: "진행중", variant: "default" },
  completed: { label: "완료", variant: "secondary" },
};

// 정적 목데이터 (파트너 캠페인 성과)
const mockPerformanceData = {
  totalRevenue: 84500000,
  totalOrders: 1842,
  conversionRate: 4.2,
  campaigns: [
    {
      id: "camp-p1",
      title: "봄맞이 스킨케어 프로모션",
      status: "in_progress",
      category: "뷰티",
      revenue: 32000000,
      orders: 680,
      conversionRate: 5.1,
    },
    {
      id: "camp-p2",
      title: "신상 패션 룩북 캠페인",
      status: "completed",
      category: "패션",
      revenue: 28500000,
      orders: 520,
      conversionRate: 3.8,
    },
    {
      id: "camp-p3",
      title: "프리미엄 푸드 체험단",
      status: "completed",
      category: "푸드",
      revenue: 15200000,
      orders: 412,
      conversionRate: 4.5,
    },
    {
      id: "camp-p4",
      title: "테크 가제트 리뷰 캠페인",
      status: "in_progress",
      category: "테크",
      revenue: 8800000,
      orders: 230,
      conversionRate: 3.2,
    },
  ],
};

function formatRevenue(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toLocaleString()}만`;
  return n.toLocaleString("ko-KR");
}

export default function PartnerPerformancePage() {
  const data = mockPerformanceData;

  return (
    <div className="flex flex-col flex-1">
      <PageHeader
        title="캠페인 성과"
        description="파트너 캠페인 성과를 확인합니다"
      />

      <div className="flex-1 p-6 space-y-6">
        {/* KPI 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="총 매출"
            value={`${formatRevenue(data.totalRevenue)}원`}
            trend={{ value: "+12.3%", positive: true }}
            icon={TrendingUp}
          />
          <StatsCard
            title="총 주문"
            value={`${data.totalOrders.toLocaleString()}건`}
            trend={{ value: "+8.7%", positive: true }}
            icon={ShoppingCart}
          />
          <StatsCard
            title="전환율"
            value={`${data.conversionRate}%`}
            trend={{ value: "+0.4%p", positive: true }}
            icon={Percent}
          />
        </div>

        {/* 캠페인 성과 테이블 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">캠페인별 성과</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[260px]">캠페인명</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead className="text-right">매출</TableHead>
                  <TableHead className="text-right">주문수</TableHead>
                  <TableHead className="text-right">전환율</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.campaigns.map((campaign) => {
                  const status = STATUS_MAP[campaign.status];
                  return (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">
                        {campaign.title}
                      </TableCell>
                      <TableCell>
                        {status ? (
                          <Badge variant={status.variant}>
                            {status.label}
                          </Badge>
                        ) : (
                          <Badge variant="outline">{campaign.status}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {campaign.category}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatRevenue(campaign.revenue)}원
                      </TableCell>
                      <TableCell className="text-right">
                        {campaign.orders.toLocaleString()}건
                      </TableCell>
                      <TableCell className="text-right">
                        {campaign.conversionRate}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
