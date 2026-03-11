"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Sparkles } from "lucide-react";
import { z } from "zod/v4";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { featuringApi } from "@/lib/featuring-api";
import type { Recommendation } from "@/types/recommendation";
import mockCreatorsJson from "@/data/mock/creators.json";

const CATEGORIES = ["뷰티", "패션", "푸드", "리빙", "테크", "엔터테인먼트", "여행", "육아"];

const campaignSchema = z.object({
  title: z.string().min(2, "캠페인 제목은 2자 이상이어야 합니다"),
  brandName: z.string().min(1, "브랜드를 입력하세요"),
  category: z.string().min(1, "카테고리를 선택하세요"),
  budget: z.number().min(10000, "예산은 1만원 이상이어야 합니다"),
  startDate: z.string().min(1, "시작일을 입력하세요"),
  endDate: z.string().min(1, "종료일을 입력하세요"),
  description: z.string().min(10, "설명은 10자 이상이어야 합니다"),
});

type FormData = {
  title: string;
  brandName: string;
  category: string;
  budget: string;
  startDate: string;
  endDate: string;
  description: string;
};

function getCreatorInfo(id: string) {
  return mockCreatorsJson.find((c) => c.id === id);
}

const REASON_LABELS: Record<string, string> = {
  "성과유사": "성과 유사",
  "구매기반": "구매 기반",
  "카테고리유사": "카테고리 유사",
};

export default function CampaignNewPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    title: "",
    brandName: "",
    category: "",
    budget: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);

  // Auto-load recommendations when category changes
  useEffect(() => {
    if (!form.category) {
      setRecommendations(null);
      return;
    }
    async function loadRecs() {
      // Use a mock campaign ID that matches category for demo
      const campaignId =
        form.category === "뷰티"
          ? "campaign-1"
          : form.category === "푸드"
            ? "campaign-2"
            : form.category === "패션"
              ? "campaign-3"
              : "campaign-1";
      const rec = await featuringApi.getCreatorRecommendations(campaignId);
      setRecommendations(rec);
    }
    loadRecs();
  }, [form.category]);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    const parsed = campaignSchema.safeParse({
      ...form,
      budget: Number(form.budget) || 0,
    });

    if (!parsed.success) {
      const newErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!newErrors[key]) {
          newErrors[key] = issue.message;
        }
      }
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      await featuringApi.createCampaign({
        title: form.title,
        brandName: form.brandName,
        category: form.category,
        budget: Number(form.budget),
        description: form.description,
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
      });
      alert("캠페인이 등록되었습니다.");
      router.push("/ontrust/campaign");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="캠페인 등록"
        description="새 캠페인을 등록합니다"
        actions={
          <Button size="sm" onClick={handleSubmit} disabled={saving}>
            <Save className="h-4 w-4 mr-1.5" />
            {saving ? "저장 중..." : "캠페인 등록"}
          </Button>
        }
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>캠페인 제목 *</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="캠페인 제목을 입력하세요"
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive">{errors.title}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>브랜드 *</Label>
                    <Input
                      value={form.brandName}
                      onChange={(e) => updateField("brandName", e.target.value)}
                      placeholder="브랜드명"
                    />
                    {errors.brandName && (
                      <p className="text-xs text-destructive">{errors.brandName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>카테고리 *</Label>
                    <Select
                      value={form.category}
                      onValueChange={(v) => updateField("category", v)}
                    >
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
                    {errors.category && (
                      <p className="text-xs text-destructive">{errors.category}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>예산 (원) *</Label>
                  <Input
                    type="number"
                    value={form.budget}
                    onChange={(e) => updateField("budget", e.target.value)}
                    placeholder="5000000"
                  />
                  {errors.budget && (
                    <p className="text-xs text-destructive">{errors.budget}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>시작일 *</Label>
                    <Input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => updateField("startDate", e.target.value)}
                    />
                    {errors.startDate && (
                      <p className="text-xs text-destructive">{errors.startDate}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>종료일 *</Label>
                    <Input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => updateField("endDate", e.target.value)}
                    />
                    {errors.endDate && (
                      <p className="text-xs text-destructive">{errors.endDate}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>캠페인 설명 *</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="캠페인 상세 설명을 입력하세요..."
                    rows={5}
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive">{errors.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar - recommended creators */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  추천 크리에이터 Top 10
                </CardTitle>
                <CardDescription>
                  {form.category
                    ? `"${form.category}" 카테고리 기반 추천`
                    : "카테고리를 선택하면 추천이 표시됩니다"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!form.category ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    카테고리를 선택하세요
                  </p>
                ) : !recommendations ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {recommendations.creators.slice(0, 10).map((rec, idx) => {
                      const info = getCreatorInfo(rec.creatorId);
                      return (
                        <li
                          key={rec.creatorId}
                          className="flex items-center gap-2.5"
                        >
                          <span className="text-xs font-bold text-muted-foreground w-5 text-center">
                            {idx + 1}
                          </span>
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[10px]">
                              {info?.name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {info?.name || rec.creatorId}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {rec.score}점 · {REASON_LABELS[rec.reason] || rec.reason}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
