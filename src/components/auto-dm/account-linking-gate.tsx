"use client";

import { useState } from "react";
import { Link2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import accountLinkingData from "@/data/mock/account-linking.json";
import type { AccountLinkingStatus } from "@/types/auto-dm-draft";

interface AccountLinkingGateProps {
  children: React.ReactNode;
}

export function AccountLinkingGate({ children }: AccountLinkingGateProps) {
  const [linkingStatus] = useState<AccountLinkingStatus>(accountLinkingData);

  if (linkingStatus.isLinked) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-6 pt-10 pb-8 px-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <Link2 className="h-8 w-8 text-purple-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              인스타그램 계정 연동이 필요합니다
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              자동 DM 기능을 사용하려면 피처링 스튜디오를 통해
              <br />
              인스타그램 계정을 연동해주세요.
            </p>
          </div>

          <Button
            className="w-full"
            onClick={() => {
              window.open(linkingStatus.featuringStudioUrl, "_blank");
            }}
          >
            <Link2 className="mr-2 h-4 w-4" />
            피처링 스튜디오로 연동하기
          </Button>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              연동 완료 후 이 페이지를 새로고침해주세요.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              새로고침
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
