"use client";

import { useState } from "react";
import { User, Instagram, Youtube, Edit, Eye } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import mockCreatorsJson from "@/data/mock/creators.json";
import mockCampaignsJson from "@/data/mock/campaigns.json";

const CATEGORIES = ["뷰티", "패션", "푸드", "리빙", "테크", "육아", "헬스", "여행", "라이프스타일", "인테리어"];

type CreatorJson = (typeof mockCreatorsJson)[number];

function formatKRW(amount: number) {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억원`;
  if (amount >= 10000) return `${Math.round(amount / 10000)}만원`;
  return `${amount.toLocaleString("ko-KR")}원`;
}

export default function MyPagePage() {
  const creator = mockCreatorsJson.find((c) => c.id === "creator-1")!;
  const allCampaigns = mockCampaignsJson.filter((c) =>
    (creator.campaigns as string[]).includes(c.id)
  );

  // Profile edit state
  const [editOpen, setEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(creator.desiredCategory || "");
  const [editRate, setEditRate] = useState(String(creator.desiredRate || ""));
  const [editIntro, setEditIntro] = useState(creator.introduction || "");

  // Campaign public state
  const [publicOpen, setPublicOpen] = useState(false);
  const [publicCampaigns, setPublicCampaigns] = useState<string[]>(
    allCampaigns.filter((c) => c.status === "완료" || c.status === "진행중").map((c) => c.id)
  );

  const visibleCampaigns = allCampaigns.filter((c) =>
    publicCampaigns.includes(c.id)
  );

  const handleSaveProfile = () => {
    // Mock save
    setEditOpen(false);
  };

  const handleSavePublicSettings = () => {
    setPublicOpen(false);
  };

  const toggleCampaignPublic = (campaignId: string) => {
    setPublicCampaigns((prev) =>
      prev.includes(campaignId)
        ? prev.filter((id) => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  return (
    <>
      <PageHeader
        title="마이페이지"
        description="프로필 및 캠페인 공개 설정을 관리하세요"
        actions={
          <div className="flex gap-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  프로필 수정
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>프로필 수정</DialogTitle>
                  <DialogDescription>
                    프로필 정보를 수정합니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={creator.profileImage} />
                      <AvatarFallback>{creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      이미지 업로드
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>희망 카테고리</Label>
                    <Select value={editCategory} onValueChange={setEditCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>희망 단가 (원)</Label>
                    <Input
                      type="number"
                      value={editRate}
                      onChange={(e) => setEditRate(e.target.value)}
                      placeholder="예: 2000000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>RS (판매 단가)</Label>
                    <Input
                      type="number"
                      defaultValue={creator.salesPrice || ""}
                      placeholder="예: 1500000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>자기소개</Label>
                    <Textarea
                      value={editIntro}
                      onChange={(e) => setEditIntro(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleSaveProfile}>저장</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={publicOpen} onOpenChange={setPublicOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  캠페인 공개 설정
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>캠페인 공개 설정</DialogTitle>
                  <DialogDescription>
                    프로필에 공개할 캠페인을 선택하세요.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto">
                  {allCampaigns.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 p-2 rounded-md border"
                    >
                      <Checkbox
                        id={`pub-${c.id}`}
                        checked={publicCampaigns.includes(c.id)}
                        onCheckedChange={() => toggleCampaignPublic(c.id)}
                      />
                      <label
                        htmlFor={`pub-${c.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.brand} · {c.status}
                        </p>
                      </label>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPublicOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleSavePublicSettings}>저장</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Creator Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={creator.profileImage} />
                <AvatarFallback className="text-2xl">
                  {creator.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">{creator.name}</h2>
                  <Badge>{creator.tier}</Badge>
                  {creator.isOntnerMember && (
                    <Badge variant="secondary">온트너 회원</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {editIntro || creator.introduction}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">팔로워</p>
                    <p className="text-sm font-semibold">
                      {creator.followers.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">참여율</p>
                    <p className="text-sm font-semibold">
                      {creator.engagementRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">희망 카테고리</p>
                    <p className="text-sm font-semibold">
                      {editCategory || creator.desiredCategory || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">희망 단가</p>
                    <p className="text-sm font-semibold">
                      {formatKRW(Number(editRate) || creator.desiredRate || 0)}
                    </p>
                  </div>
                </div>
                {creator.salesPrice && (
                  <div className="pt-1">
                    <p className="text-xs text-muted-foreground">
                      RS (판매 단가):{" "}
                      <span className="font-semibold text-foreground">
                        {formatKRW(creator.salesPrice)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SNS Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">SNS 계정 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Instagram className="h-5 w-5 text-pink-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Instagram</p>
                  <p className="text-sm font-medium">@{creator.handle}</p>
                </div>
              </div>
              {"youtubeHandle" in creator && (creator as CreatorJson).youtubeHandle && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Youtube className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">YouTube</p>
                    <p className="text-sm font-medium">
                      @{(creator as CreatorJson).youtubeHandle}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Public Campaign History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">공개 캠페인 이력</CardTitle>
            <CardDescription>
              공개 설정된 캠페인 {visibleCampaigns.length}건
            </CardDescription>
          </CardHeader>
          <CardContent>
            {visibleCampaigns.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                공개된 캠페인이 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {visibleCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {campaign.name}
                        </span>
                        <Badge
                          variant={
                            campaign.status === "진행중"
                              ? "default"
                              : campaign.status === "완료"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {campaign.brand} · {campaign.brandCategory} ·{" "}
                        {campaign.startDate} ~ {campaign.endDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">보상</p>
                      <p className="text-sm font-medium">{campaign.reward}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
