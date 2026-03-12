"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const mockTerms = [
  {
    id: "1",
    status: "서명완료",
    title: "온트너 캠페인 이용약관(크리에이터)",
    docNumber: "20260300000781",
    date: "2026.03.12",
    issuer: "CJ ENM",
  },
];

const ITEMS_PER_PAGE = 10;

export default function TermsPage() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(mockTerms.length / ITEMS_PER_PAGE);
  const paged = mockTerms.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">약관/계약 관리</h1>

      <Separator className="mb-2" />

      {/* Terms List */}
      <div className="divide-y divide-gray-100">
        {paged.map((term) => (
          <button
            key={term.id}
            className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors rounded-sm px-1"
          >
            <div className="space-y-1.5">
              {/* Status badge */}
              <Badge
                variant="outline"
                className="text-[11px] font-medium border-gray-300 text-gray-600 bg-white px-2 py-0.5 rounded-sm"
              >
                {term.status}
              </Badge>
              {/* Title */}
              <p className="text-sm font-medium text-gray-900">{term.title}</p>
              {/* Meta */}
              <p className="text-xs text-gray-400 space-x-2">
                <span>문서번호 {term.docNumber}</span>
                <span>{term.date}</span>
                <span>{term.issuer}</span>
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0 ml-4" />
          </button>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`h-7 w-7 rounded-full text-sm flex items-center justify-center transition-colors ${
              p === page
                ? "bg-gray-900 text-white font-medium"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
