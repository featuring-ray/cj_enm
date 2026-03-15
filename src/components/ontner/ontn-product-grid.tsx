"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

interface OntnProductGridProps {
  products: Product[];
  pageSize?: number;
  className?: string;
}

export function OntnProductGrid({
  products,
  pageSize = 10,
  className,
}: OntnProductGridProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(products.length / pageSize);
  const paged = products.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 gap-3">
        {paged.map((product) => (
          <div key={product.id} className="ontn-product-card">
            <div className="ontn-product-thumb">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[10px] text-gray-400 text-center px-1">
                  상품
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 line-clamp-1">{product.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                판매가{" "}
                <span className="font-medium text-gray-700">
                  {product.price > 0
                    ? `${product.price.toLocaleString()}원`
                    : "공개예정"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center text-gray-400 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                "w-8 h-8 flex items-center justify-center text-sm rounded-full",
                p === page
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 flex items-center justify-center text-gray-400 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {products.length > 0 && (
        <p className="text-[11px] text-gray-400 text-center">
          * 판매인가는 각 상품의 대표선의를 기준으로 노출하며, 상품에 따라 가격이나노출할 수 있습니다. 판시점의 판매가는 각 상품을 클릭하시면 확인할 수 있습니다.
        </p>
      )}
    </div>
  );
}
