import Link from "next/link";
import { ArrowLeft, Building2, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-lg space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">온트너</h1>
          <p className="text-sm text-muted-foreground">CJ ENM 크리에이터 커머스 플랫폼</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">가입 유형 선택</CardTitle>
            <CardDescription>
              어떤 유형으로 가입하시겠어요?
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/register/creator" className="block">
              <Card className="h-full cursor-pointer border-2 hover:border-primary hover:shadow-md transition-all duration-200 group">
                <CardContent className="pt-6 pb-6 flex flex-col items-center text-center gap-3">
                  <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">크리에이터</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      인스타그램 크리에이터로<br />캠페인에 참여하세요
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/register/partner" className="block">
              <Card className="h-full cursor-pointer border-2 hover:border-primary hover:shadow-md transition-all duration-200 group">
                <CardContent className="pt-6 pb-6 flex flex-col items-center text-center gap-3">
                  <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">파트너 (브랜드)</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      브랜드 파트너로<br />캠페인을 진행하세요
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">
              <ArrowLeft className="mr-1 h-4 w-4" />
              로그인으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
