"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2, Upload, X } from "lucide-react";
import { registerCreatorSchema, type RegisterCreatorInput } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TOTAL_STEPS = 3;

const ELECTRONIC_CONTRACT_TERMS = `전자계약 동의서

본 계약은 CJ ENM(이하 "회사")과 온트너 크리에이터(이하 "크리에이터") 간에 체결되는 콘텐츠 커머스 협력에 관한 계약입니다.

제1조 (목적)
본 계약은 회사의 온트너 플랫폼을 통해 크리에이터가 상품 공동구매 캠페인에 참여함에 있어, 상호 간의 권리와 의무를 규정함을 목적으로 합니다.

제2조 (크리에이터의 의무)
1. 크리에이터는 회사가 제공하는 캠페인 가이드라인에 따라 콘텐츠를 제작하여야 합니다.
2. 크리에이터는 허위·과장 광고를 하여서는 아니 됩니다.
3. 크리에이터는 캠페인 기간 내 정해진 일정에 따라 콘텐츠를 업로드하여야 합니다.

제3조 (수익 배분)
캠페인별 수익 배분율(RS)은 별도 협의에 따르며, 매월 정산일에 지급합니다.

제4조 (계약 기간)
본 계약은 체결일로부터 1년간 유효하며, 상호 이의가 없는 경우 자동 연장됩니다.`;

const THIRD_PARTY_CONSENT_TERMS = `제3자 정보 제공 동의서

CJ ENM 주식회사(이하 "회사")는 온트너 플랫폼 서비스 제공을 위해 아래와 같이 제3자에게 개인정보를 제공합니다.

1. 제공받는 자: 피처링(Featuring) 주식회사
2. 제공 목적: 크리에이터 성과 분석 및 캠페인 매칭 서비스 제공
3. 제공 항목: SNS 계정 정보, 팔로워 데이터, 콘텐츠 성과 데이터, 판매 실적 데이터
4. 보유 및 이용 기간: 회원 탈퇴 시 또는 동의 철회 시까지

귀하는 위 동의를 거부할 권리가 있으나, 동의를 거부하실 경우 온트너 캠페인 참여 서비스 이용이 제한될 수 있습니다.

캠페인 진행 중에는 동의를 철회할 수 없으며, 진행 중이 아닌 경우 마이페이지에서 언제든지 동의를 철회하실 수 있습니다.`;

export default function RegisterCreatorPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessFileSelected, setBusinessFileSelected] = useState(false);

  // Step 3 consents
  const [consentElectronic, setConsentElectronic] = useState(false);
  const [consentThirdParty, setConsentThirdParty] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError: setFieldError,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCreatorInput>({
    defaultValues: { platform: "instagram" },
  });

  async function goNext() {
    let fields: (keyof RegisterCreatorInput)[] = [];
    if (step === 1) fields = ["name", "email", "username", "platform", "password"];
    const valid = await trigger(fields);
    if (valid) setStep((s) => s + 1);
  }

  const onSubmit = async (data: RegisterCreatorInput) => {
    if (!consentElectronic || !consentThirdParty) {
      setError("필수 동의 항목에 동의해주세요.");
      return;
    }
    setError(null);

    const parsed = registerCreatorSchema.safeParse(data);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterCreatorInput;
        setFieldError(field, { message: issue.message });
      });
      setStep(1);
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...parsed.data,
        role: "CREATOR",
        consentThirdParty: true,
        consentMarketing,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.message || "가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle className="text-xl">가입 신청 완료</CardTitle>
            <CardDescription>검토 후 승인 이메일을 보내드립니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              관리자가 크리에이터 계정을 검토한 후 가입 승인 이메일을 발송합니다.
              보통 1-2 영업일이 소요됩니다.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">로그인 페이지로 이동</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-lg space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">온트너</h1>
          <p className="text-sm text-muted-foreground">CJ ENM 크리에이터 커머스 플랫폼</p>
        </div>

        <Card>
          <CardHeader className="space-y-3">
            <CardTitle className="text-xl">크리에이터 가입</CardTitle>
            {/* Step indicator */}
            <div className="flex items-center gap-0">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2 transition-colors ${
                      s < step
                        ? "bg-primary border-primary text-primary-foreground"
                        : s === step
                          ? "border-primary text-primary"
                          : "border-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    {s < step ? <Check className="h-4 w-4" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`h-0.5 w-16 transition-colors ${
                        s < step ? "bg-primary" : "bg-muted-foreground/20"
                      }`}
                    />
                  )}
                </div>
              ))}
              <div className="ml-3 text-xs text-muted-foreground">
                {step === 1 && "기본 정보"}
                {step === 2 && "사업자 정보"}
                {step === 3 && "약관 동의"}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Step 1: 기본 정보 */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름 *</Label>
                  <Input id="name" placeholder="홍길동" {...register("name")} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">이메일 *</Label>
                  <Input id="email" type="email" placeholder="your@email.com" {...register("email")} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">인스타그램 아이디 *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                    <Input
                      id="username"
                      placeholder="your_username"
                      className="pl-7"
                      {...register("username")}
                    />
                  </div>
                  {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">주 활동 플랫폼 *</Label>
                  <Select
                    defaultValue="instagram"
                    onValueChange={(val) => setValue("platform", val as RegisterCreatorInput["platform"])}
                  >
                    <SelectTrigger id="platform">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">인스타그램</SelectItem>
                      <SelectItem value="youtube">유튜브</SelectItem>
                      <SelectItem value="tiktok">틱톡</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.platform && <p className="text-sm text-destructive">{errors.platform.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호 *</Label>
                  <Input id="password" type="password" placeholder="6자 이상" {...register("password")} />
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>

                <Button type="button" className="w-full gap-2" onClick={goNext}>
                  다음 단계
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 2: 사업자 정보 (선택) */}
            {step === 2 && (
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground">
                  사업자등록증 업로드는 선택 사항입니다. 세금계산서 발행이 필요한 경우 업로드해주세요.
                </p>

                <div className="space-y-2">
                  <Label>사업자등록증 (선택)</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/30 transition-colors ${
                      businessFileSelected ? "border-primary bg-primary/5" : "border-muted-foreground/30"
                    }`}
                    onClick={() => setBusinessFileSelected(!businessFileSelected)}
                  >
                    {businessFileSelected ? (
                      <div className="flex items-center justify-center gap-2 text-sm text-primary">
                        <Check className="h-4 w-4" />
                        사업자등록증_홍길동.pdf
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setBusinessFileSelected(false); }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">클릭하여 파일 선택</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG (최대 10MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessNumber">사업자등록번호 (선택)</Label>
                  <Input id="businessNumber" placeholder="000-00-00000" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">상호명 (선택)</Label>
                  <Input id="businessName" placeholder="예: 홍길동 스튜디오" />
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    이전
                  </Button>
                  <Button type="button" className="flex-1 gap-2" onClick={() => setStep(3)}>
                    다음 단계
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: 약관 동의 */}
            {step === 3 && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-3">
                  {/* 전자계약 동의 */}
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Checkbox
                      id="consent-electronic"
                      checked={consentElectronic}
                      onCheckedChange={(v) => setConsentElectronic(!!v)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <Label htmlFor="consent-electronic" className="text-sm font-medium cursor-pointer">
                          전자계약 동의 <span className="text-destructive">(필수)</span>
                        </Label>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size="sm" className="h-6 text-xs px-2 shrink-0">
                              약관 보기
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>전자계약 동의서</DialogTitle>
                            </DialogHeader>
                            <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                              {ELECTRONIC_CONTRACT_TERMS}
                            </pre>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        크리에이터 커머스 협력 계약에 동의합니다
                      </p>
                    </div>
                  </div>

                  {/* 제3자 정보 동의 */}
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Checkbox
                      id="consent-third-party"
                      checked={consentThirdParty}
                      onCheckedChange={(v) => setConsentThirdParty(!!v)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <Label htmlFor="consent-third-party" className="text-sm font-medium cursor-pointer">
                          제3자 정보 제공 동의 <span className="text-destructive">(필수)</span>
                        </Label>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size="sm" className="h-6 text-xs px-2 shrink-0">
                              약관 보기
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>제3자 정보 제공 동의서</DialogTitle>
                            </DialogHeader>
                            <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                              {THIRD_PARTY_CONSENT_TERMS}
                            </pre>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        피처링(Featuring)에 분석 데이터 제공에 동의합니다
                      </p>
                    </div>
                  </div>

                  {/* 마케팅 동의 */}
                  <div className="flex items-start gap-3 p-3 border rounded-lg border-dashed">
                    <Checkbox
                      id="consent-marketing"
                      checked={consentMarketing}
                      onCheckedChange={(v) => setConsentMarketing(!!v)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="consent-marketing" className="text-sm font-medium cursor-pointer">
                        마케팅 수신 동의 <span className="text-muted-foreground">(선택)</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        플랫폼 이벤트 및 마케팅 정보를 이메일로 수신합니다
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(2)}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    이전
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting || !consentElectronic || !consentThirdParty}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        가입 신청 중...
                      </>
                    ) : (
                      "가입 신청"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/register">
                <ArrowLeft className="mr-1 h-4 w-4" />
                유형 선택으로 돌아가기
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
