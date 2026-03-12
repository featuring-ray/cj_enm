"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

const mockAccount = {
  id: "tomato***",
  password: "••••••••",
  name: "박*진",
  phone: "010-****-7745",
  email: "tomato***@naver.com",
  address: "16509 경기도 수원시 영통구 도청로17번길 *** 5",
};

export default function AccountPage() {
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  const [emailConsent, setEmailConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [phoneConsent, setPhoneConsent] = useState(false);

  const infoRows = [
    { label: "아이디", value: mockAccount.id },
    { label: "비밀번호", value: mockAccount.password },
    { label: "이름", value: mockAccount.name },
    { label: "휴대폰번호", value: mockAccount.phone },
    { label: "이메일", value: mockAccount.email },
    { label: "배송지 관리", value: mockAccount.address },
  ];

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">계정 및 정산계좌 관리</h1>

      {/* 계정 정보 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">계정 정보</h2>
          <Button variant="outline" size="sm" className="text-xs h-7 px-3 rounded-none">
            변경하기
          </Button>
        </div>
        <Separator className="mb-4" />
        <div className="space-y-4">
          {infoRows.map((row) => (
            <div key={row.label} className="grid grid-cols-[120px_1fr] items-start gap-2">
              <span className="text-sm text-gray-500">{row.label}</span>
              <span className="text-sm text-gray-900">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 마케팅 수신 동의 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">마케팅 수신 동의</h2>
          <Switch
            checked={marketingEnabled}
            onCheckedChange={setMarketingEnabled}
          />
        </div>
        <Separator className="mb-4" />

        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          {/* 체크박스 */}
          <div className="grid grid-cols-3 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={emailConsent}
                onCheckedChange={(v) => setEmailConsent(!!v)}
                className="rounded-full"
              />
              <span className="text-sm text-gray-700">이메일</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={smsConsent}
                onCheckedChange={(v) => setSmsConsent(!!v)}
                className="rounded-full"
              />
              <span className="text-sm text-gray-700">SMS</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={phoneConsent}
                onCheckedChange={(v) => setPhoneConsent(!!v)}
                className="rounded-full"
              />
              <span className="text-sm text-gray-700">전화</span>
            </label>
          </div>

          {/* 안내 문구 */}
          <p className="text-xs text-gray-500 leading-relaxed">
            마케팅 정보 수신 동의를 하시면 캠페인 참여 및 수익 강화에 효과적인 온트너 서비스 및 이벤트
            정보를 안내받으실 수 있으며, 동의를 거부하셔도 온트너 이용이 가능합니다.
          </p>
          <button className="text-xs text-gray-500 underline underline-offset-2 hover:text-gray-700">
            자세히 보기
          </button>
        </div>
      </section>

      {/* 정산계좌 정보 */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-900 mb-3">정산계좌 정보</h2>
        <Separator className="mb-4" />
        <button className="ontner-upload-area py-4">
          <span className="text-lg leading-none">+</span>
          정산계좌 등록하기
        </button>
      </section>

      {/* 서비스 탈퇴 */}
      <div className="flex justify-end">
        <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-0.5">
          서비스 탈퇴하기
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
