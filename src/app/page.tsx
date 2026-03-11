import Link from "next/link";
import { Users, Building2, ShieldCheck, ArrowRight } from "lucide-react";

const portals = [
  {
    href: "/ontner/dashboard",
    icon: Users,
    title: "온트너",
    description: "크리에이터 포털",
    sub: "캠페인 참여 및 성과 관리",
  },
  {
    href: "/ontrust/creator/search",
    icon: ShieldCheck,
    title: "온트러스트",
    description: "관리자 포털",
    sub: "크리에이터·캠페인 통합 관리",
  },
  {
    href: "/partner/creator",
    icon: Building2,
    title: "파트너",
    description: "파트너 포털",
    sub: "캠페인 등록 및 크리에이터 탐색",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded bg-primary text-primary-foreground text-sm font-bold mb-2">
            CJ
          </div>
          <h1 className="text-2xl font-bold tracking-tight">CJ ENM 크리에이터 플랫폼</h1>
          <p className="text-sm text-muted-foreground">포털을 선택하여 진입하세요</p>
        </div>

        {/* Portal Cards */}
        <div className="grid gap-3">
          {portals.map(({ href, icon: Icon, title, description, sub }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 p-5 rounded bg-card border border-border hover:border-primary hover:bg-primary/5 transition-colors group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold">{title}</span>
                  <span className="text-xs text-muted-foreground">{description}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{sub}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
