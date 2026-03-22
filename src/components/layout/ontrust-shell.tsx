"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Home,
  Search,
  Star,
  Clock,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { SessionUser } from "@/types/user";

/* ─────────── 타입 ─────────── */

export interface LnbItem {
  label: string;
  href: string;
  disabled?: boolean;
  badge?: string;
}

export interface LnbGroup {
  label: string;
  items: LnbItem[];
}

export interface GnbCategory {
  label: string;
  key: string;
  lnbGroups: LnbGroup[];
}

interface OntrustShellProps {
  gnbCategories: GnbCategory[];
  user: SessionUser;
  children: React.ReactNode;
}

/* ─────────── 컴포넌트 ─────────── */

export function OntrustShell({
  gnbCategories,
  user,
  children,
}: OntrustShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  // 현재 경로에 맞는 GNB 카테고리 자동 선택
  const autoActiveGnb = useMemo(() => {
    for (const cat of gnbCategories) {
      for (const group of cat.lnbGroups) {
        for (const item of group.items) {
          if (
            !item.disabled &&
            (pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href)))
          ) {
            return cat.key;
          }
        }
      }
    }
    return gnbCategories[0]?.key ?? "";
  }, [pathname, gnbCategories]);

  const [activeGnb, setActiveGnb] = useState(autoActiveGnb);
  const [lnbCollapsed, setLnbCollapsed] = useState(false);

  // 현재 GNB에 해당하는 LNB 그룹
  const activeLnbGroups = useMemo(() => {
    return gnbCategories.find((c) => c.key === activeGnb)?.lnbGroups ?? [];
  }, [gnbCategories, activeGnb]);

  // LNB 그룹 접기/펼치기
  const [openLnbGroups, setOpenLnbGroups] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      activeLnbGroups.forEach((g) => {
        const hasActive = g.items.some(
          (item) =>
            !item.disabled &&
            (pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href)))
        );
        if (hasActive) initial[g.label] = true;
      });
      return initial;
    }
  );

  const toggleLnbGroup = (label: string) => {
    setOpenLnbGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // GNB 전환 시 LNB 그룹 상태 리셋
  const handleGnbChange = (key: string) => {
    setActiveGnb(key);
    const cat = gnbCategories.find((c) => c.key === key);
    if (!cat) return;
    const initial: Record<string, boolean> = {};
    cat.lnbGroups.forEach((g) => {
      const hasActive = g.items.some(
        (item) =>
          !item.disabled &&
          (pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href)))
      );
      if (hasActive) initial[g.label] = true;
    });
    setOpenLnbGroups(initial);
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="ontrust-portal flex flex-col min-h-screen bg-background">
      {/* ═══════════ GNB 상단 바 ═══════════ */}
      <header className="shrink-0 border-b bg-white z-30">
        {/* 1단: 로고 + GNB 메뉴 + 검색/유저 */}
        <div className="flex items-center h-12 px-4 gap-1">
          {/* 로고 */}
          <Link
            href="/ontrust"
            className="flex items-center gap-2 mr-4 shrink-0"
          >
            <span className="text-lg font-black tracking-tight">
              <span className="text-primary">ON</span>
              <span className="text-foreground">TRUST</span>
            </span>
          </Link>

          {/* GNB 탭 */}
          <nav className="flex items-center gap-0.5 overflow-x-auto hide-scrollbar flex-1">
            {gnbCategories.map((cat) => {
              const isActive = activeGnb === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleGnbChange(cat.key)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium whitespace-nowrap rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>

          {/* 우측: 검색 + 유저 */}
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Search className="h-4 w-4" />
            </Button>
            <Avatar className="h-7 w-7">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* 2단: 서브 바 (즐겨찾기 / 최근메뉴 / 페이지탭) */}
        <div className="flex items-center h-9 px-4 border-t bg-muted/30 gap-4 text-xs">
          <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <Star className="h-3 w-3" />
            즐겨찾기
          </button>
          <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <Clock className="h-3 w-3" />
            최근메뉴
          </button>
          <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <Menu className="h-3 w-3" />
            전체메뉴
          </button>
          <div className="h-4 w-px bg-border" />
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-3 w-3" />
            홈
          </button>
        </div>
      </header>

      {/* ═══════════ LNB + 콘텐츠 ═══════════ */}
      <div className="flex flex-1 overflow-hidden">
        {/* LNB 좌측 사이드바 */}
        <aside
          className={cn(
            "shrink-0 border-r bg-white overflow-y-auto transition-[width] duration-200",
            lnbCollapsed ? "w-0 overflow-hidden" : "w-[220px]"
          )}
        >
          {/* LNB 헤더: 모듈명 + 접기 버튼 */}
          <div className="flex items-center justify-between px-3 py-3 border-b">
            <span className="text-sm font-semibold text-foreground">
              {gnbCategories.find((c) => c.key === activeGnb)?.label}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setLnbCollapsed(true)}
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* LNB 트리 */}
          <nav className="py-1">
            {activeLnbGroups.map((group) => {
              const isOpen = !!openLnbGroups[group.label];
              const hasActiveChild = group.items.some(
                (item) =>
                  !item.disabled &&
                  (pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href)))
              );

              return (
                <div key={group.label}>
                  {/* 그룹 헤더 */}
                  <button
                    onClick={() => toggleLnbGroup(group.label)}
                    className={cn(
                      "flex items-center w-full gap-1.5 px-3 py-2 text-xs font-medium transition-colors",
                      hasActiveChild
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 shrink-0 transition-transform duration-200",
                        !isOpen && "-rotate-90"
                      )}
                    />
                    <span>{group.label}</span>
                  </button>

                  {/* 하위 아이템 */}
                  {isOpen && (
                    <div className="pb-0.5">
                      {group.items.map((item) => {
                        const isActive =
                          !item.disabled &&
                          (pathname === item.href ||
                            (item.href !== "/" &&
                              pathname.startsWith(item.href)));

                        if (item.disabled) {
                          return (
                            <div
                              key={item.href}
                              className="flex items-center gap-1.5 pl-7 pr-3 py-1.5 text-xs text-muted-foreground/40 cursor-not-allowed"
                            >
                              <span>· {item.label}</span>
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center gap-1.5 pl-7 pr-3 py-1.5 text-xs transition-colors",
                              isActive
                                ? "text-primary font-semibold bg-primary/5 border-r-2 border-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                          >
                            <span>· {item.label}</span>
                            {item.badge && (
                              <span className="ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-white bg-primary leading-none">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* LNB 하단: 유저 정보 */}
          <div className="mt-auto border-t px-3 py-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* LNB 접힌 상태: 펼치기 버튼 */}
        {lnbCollapsed && (
          <div className="shrink-0 border-r bg-white flex flex-col items-center py-2 px-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setLnbCollapsed(false)}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
