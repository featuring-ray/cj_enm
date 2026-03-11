"use client";

import { useState } from "react";
import {
  Users,
  Search,
  X,
  Loader2,
  History,
  BarChart3,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreatorSearchDialog } from "@/components/creators/creator-search-dialog";
import { featuringApi } from "@/lib/featuring-api";
import type { Creator } from "@/types/creator";
import type { SimilarityResult } from "@/types/similarity";

interface AnalysisHistory {
  id: string;
  creatorNames: string[];
  analyzedAt: string;
  avgMatchRate: number;
}

const MOCK_HISTORY: AnalysisHistory[] = [
  {
    id: "hist-1",
    creatorNames: ["뷰티하나", "패션왕킴"],
    analyzedAt: "2026-03-08",
    avgMatchRate: 32.5,
  },
  {
    id: "hist-2",
    creatorNames: ["뷰티하나", "푸디진", "테크마스터"],
    analyzedAt: "2026-03-05",
    avgMatchRate: 18.2,
  },
  {
    id: "hist-3",
    creatorNames: ["리빙퀸", "푸디진"],
    analyzedAt: "2026-02-28",
    avgMatchRate: 45.1,
  },
];

export default function SimilarityPage() {
  const [selectedCreators, setSelectedCreators] = useState<Creator[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<SimilarityResult[]>([]);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAddCreators = (creators: Creator[]) => {
    setSelectedCreators((prev) => {
      const existing = new Set(prev.map((c) => c.id));
      const newOnes = creators.filter((c) => !existing.has(c.id));
      return [...prev, ...newOnes].slice(0, 5);
    });
    setAnalyzed(false);
    setResults([]);
  };

  const handleRemoveCreator = (id: string) => {
    setSelectedCreators((prev) => prev.filter((c) => c.id !== id));
    setAnalyzed(false);
    setResults([]);
  };

  const handleAnalyze = async () => {
    if (selectedCreators.length < 2) return;
    setAnalyzing(true);
    // Simulate 3-second loading
    await new Promise((r) => setTimeout(r, 3000));
    try {
      const matrix = await featuringApi.getSimilarityMatrix(
        selectedCreators.map((c) => c.id)
      );
      setResults(matrix);
      setAnalyzed(true);
    } finally {
      setAnalyzing(false);
    }
  };

  // Build pairwise matrix display
  const getMatchRate = (a: string, b: string): number | null => {
    if (a === b) return 100;
    const found = results.find(
      (r) =>
        (r.creatorA === a && r.creatorB === b) ||
        (r.creatorA === b && r.creatorB === a)
    );
    return found ? Math.round(found.matchRate * 100) : null;
  };

  return (
    <>
      <PageHeader
        title="팔로워 유사도 분석"
        description="크리에이터 간 팔로워 일치율을 분석합니다 (2~5명)"
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Creator Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              분석 대상 크리에이터 (최소 2명, 최대 5명)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCreators.map((creator) => (
                <Badge
                  key={creator.id}
                  variant="secondary"
                  className="pl-2 pr-1 py-1.5 text-sm gap-1.5"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[10px]">
                      {creator.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {creator.displayName}
                  <button
                    onClick={() => handleRemoveCreator(creator.id)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedCreators.length < 5 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="h-3.5 w-3.5 mr-1" />
                  크리에이터 추가
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleAnalyze}
                disabled={selectedCreators.length < 2 || analyzing}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-1.5" />
                    분석 요청
                  </>
                )}
              </Button>
              {selectedCreators.length < 2 && (
                <span className="text-xs text-muted-foreground self-center">
                  최소 2명의 크리에이터를 선택하세요
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Matrix */}
        {analyzed && results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">팔로워 일치율 매트릭스</CardTitle>
              <CardDescription>
                크리에이터 간 팔로워 일치율 비교 (%, 높을수록 팔로워 중복이 많음)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32" />
                      {selectedCreators.map((c) => (
                        <TableHead key={c.id} className="text-center text-xs">
                          {c.displayName}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCreators.map((rowCreator) => (
                      <TableRow key={rowCreator.id}>
                        <TableCell className="font-medium text-sm">
                          {rowCreator.displayName}
                        </TableCell>
                        {selectedCreators.map((colCreator) => {
                          const rate = getMatchRate(rowCreator.id, colCreator.id);
                          const isSelf = rowCreator.id === colCreator.id;
                          return (
                            <TableCell
                              key={colCreator.id}
                              className={`text-center text-sm ${
                                isSelf
                                  ? "bg-muted text-muted-foreground"
                                  : rate !== null && rate > 30
                                    ? "text-red-600 font-semibold"
                                    : rate !== null && rate > 15
                                      ? "text-amber-600 font-medium"
                                      : ""
                              }`}
                            >
                              {rate !== null ? `${rate}%` : "—"}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Segment Info */}
        {analyzed && results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">세그먼트 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    {results.length > 0
                      ? `${Math.round(
                          (results.reduce((sum, r) => sum + r.matchRate, 0) /
                            results.length) *
                            100
                        )}%`
                      : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">평균 일치율</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600">
                    {results.length > 0
                      ? `${Math.round(
                          Math.max(...results.map((r) => r.matchRate)) * 100
                        )}%`
                      : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">최대 일치율</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {results.length > 0
                      ? `${Math.round(
                          Math.min(...results.map((r) => r.matchRate)) * 100
                        )}%`
                      : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">최소 일치율</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Past Analysis History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4" />
              과거 분석 이력
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>분석 대상</TableHead>
                  <TableHead>분석일</TableHead>
                  <TableHead>평균 일치율</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_HISTORY.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {h.creatorNames.map((name) => (
                          <Badge key={name} variant="secondary" className="text-xs">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {h.analyzedAt}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {h.avgMatchRate}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <CreatorSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        excludeIds={selectedCreators.map((c) => c.id)}
        onSelect={handleAddCreators}
        title="분석 대상 크리에이터 검색"
      />
    </>
  );
}
