"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Upload,
  ChevronRight,
  ChevronLeft,
  Instagram,
  Youtube,
  FileText,
  Shield,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const STEPS = [
  { id: 1, label: "계정 정보", icon: User },
  { id: 2, label: "사업자 등록", icon: FileText },
  { id: 3, label: "동의", icon: Shield },
  { id: 4, label: "완료", icon: CheckCircle2 },
];

export default function OntnerSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    instagramHandle: "",
    youtubeHandle: "",
    businessFile: null as File | null,
    businessNumber: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreeThirdParty: false,
    agreeMarketing: false,
  });

  const handleNext = () => {
    if (step < 4) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const canProceedStep1 =
    form.name.trim() &&
    form.email.trim() &&
    (form.instagramHandle.trim() || form.youtubeHandle.trim());

  const canProceedStep2 = form.businessNumber.trim();

  const canProceedStep3 =
    form.agreeTerms && form.agreePrivacy && form.agreeThirdParty;

  const canProceed =
    step === 1
      ? !!canProceedStep1
      : step === 2
        ? !!canProceedStep2
        : step === 3
          ? !!canProceedStep3
          : true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* 로고 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-purple-700">온트너</h1>
          <p className="text-sm text-muted-foreground mt-1">
            CJ 온스타일 크리에이터 파트너 플랫폼
          </p>
        </div>

        {/* 진행 단계 */}
        <div className="flex items-center justify-between mb-6 px-2">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = step > s.id;
            const isCurrent = step === s.id;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isCompleted
                        ? "bg-purple-600 border-purple-600 text-white"
                        : isCurrent
                          ? "border-purple-600 text-purple-600 bg-white"
                          : "border-gray-200 text-gray-400 bg-white"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] mt-1 ${
                      isCurrent
                        ? "text-purple-700 font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mb-4 mx-1 ${
                      step > s.id ? "bg-purple-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* 폼 카드 */}
        <Card className="shadow-lg border-0">
          {/* Step 1: 계정 정보 */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="text-lg">계정 정보 입력</CardTitle>
                <CardDescription>
                  온트너 가입에 필요한 기본 정보를 입력해주세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름 (활동명) *</Label>
                  <Input
                    id="name"
                    placeholder="활동명을 입력하세요"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="010-0000-0000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>SNS 계정 (1개 이상 필수)</Label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-500" />
                    <Input
                      placeholder="인스타그램 핸들 (@제외)"
                      value={form.instagramHandle}
                      onChange={(e) =>
                        setForm({ ...form, instagramHandle: e.target.value })
                      }
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                    <Input
                      placeholder="유튜브 채널명 (@제외)"
                      value={form.youtubeHandle}
                      onChange={(e) =>
                        setForm({ ...form, youtubeHandle: e.target.value })
                      }
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    입력한 SNS 계정 기준으로 피처링 크리에이터 데이터와 연동됩니다
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: 사업자 등록 */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="text-lg">사업자 정보</CardTitle>
                <CardDescription>
                  정산 처리를 위한 사업자 정보를 입력해주세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bizNum">사업자등록번호 *</Label>
                  <Input
                    id="bizNum"
                    placeholder="000-00-00000"
                    value={form.businessNumber}
                    onChange={(e) =>
                      setForm({ ...form, businessNumber: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>사업자등록증 업로드</Label>
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    {form.businessFile ? (
                      <div>
                        <p className="text-sm font-medium text-primary">
                          {form.businessFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          클릭하여 다시 선택
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          파일을 클릭하여 업로드
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, JPG, PNG (최대 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    id="fileInput"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setForm({ ...form, businessFile: file });
                    }}
                  />
                </div>

                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-xs text-blue-700">
                    사업자등록증은 계약 체결 및 정산 처리에만 사용되며, 외부에 공개되지 않습니다.
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: 동의 */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="text-lg">약관 동의</CardTitle>
                <CardDescription>
                  서비스 이용을 위한 약관에 동의해주세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 전체 동의 */}
                <div
                  className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100 cursor-pointer"
                  onClick={() => {
                    const allChecked =
                      form.agreeTerms &&
                      form.agreePrivacy &&
                      form.agreeThirdParty &&
                      form.agreeMarketing;
                    setForm({
                      ...form,
                      agreeTerms: !allChecked,
                      agreePrivacy: !allChecked,
                      agreeThirdParty: !allChecked,
                      agreeMarketing: !allChecked,
                    });
                  }}
                >
                  <Checkbox
                    checked={
                      form.agreeTerms &&
                      form.agreePrivacy &&
                      form.agreeThirdParty &&
                      form.agreeMarketing
                    }
                    onCheckedChange={() => {}}
                  />
                  <span className="text-sm font-semibold text-purple-800">
                    전체 동의
                  </span>
                </div>

                <Separator />

                {[
                  {
                    key: "agreeTerms" as const,
                    label: "이용약관 동의",
                    required: true,
                  },
                  {
                    key: "agreePrivacy" as const,
                    label: "개인정보 처리방침 동의",
                    required: true,
                  },
                  {
                    key: "agreeThirdParty" as const,
                    label: "제3자 정보 제공 동의 (피처링)",
                    required: true,
                    description:
                      "크리에이터 분석 데이터 제공을 위해 피처링에 정보가 공유됩니다",
                  },
                  {
                    key: "agreeMarketing" as const,
                    label: "마케팅 정보 수신 동의",
                    required: false,
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-start gap-3 cursor-pointer"
                    onClick={() =>
                      setForm({ ...form, [item.key]: !form[item.key] })
                    }
                  >
                    <Checkbox
                      checked={form[item.key]}
                      onCheckedChange={() => {}}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.label}</span>
                        {item.required ? (
                          <Badge variant="default" className="text-[10px] px-1.5 py-0">
                            필수
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            선택
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </>
          )}

          {/* Step 4: 완료 */}
          {step === 4 && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">가입 신청 완료!</CardTitle>
                <CardDescription>
                  {form.name}님의 온트너 가입 신청이 접수되었습니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">이름</span>
                    <span className="font-medium">{form.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">이메일</span>
                    <span className="font-medium">{form.email}</span>
                  </div>
                  {form.instagramHandle && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">인스타그램</span>
                      <span className="font-medium">@{form.instagramHandle}</span>
                    </div>
                  )}
                  {form.youtubeHandle && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">유튜브</span>
                      <span className="font-medium">@{form.youtubeHandle}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-xs text-blue-700">
                    가입 검토 후 등록된 이메일로 승인 안내를 드립니다. 영업일 기준 1~3일이 소요될 수 있습니다.
                  </p>
                </div>

                <Button
                  className="w-full"
                  onClick={() => router.push("/ontner/dashboard")}
                >
                  온트너 시작하기
                </Button>
              </CardContent>
            </>
          )}

          {/* 하단 네비게이션 */}
          {step < 4 && (
            <div className="px-6 pb-6 flex gap-2">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  이전
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="flex-1"
                disabled={!canProceed}
              >
                {step === 3 ? "가입 신청" : "다음"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          이미 계정이 있으신가요?{" "}
          <button
            onClick={() => router.push("/ontner/dashboard")}
            className="text-purple-600 hover:underline"
          >
            로그인
          </button>
        </p>
      </div>
    </div>
  );
}
