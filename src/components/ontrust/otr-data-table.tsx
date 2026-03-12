"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface OtrColumn<T> {
  key: string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (row: T, index: number) => React.ReactNode;
}

interface OtrDataTableProps<T> {
  columns: OtrColumn<T>[];
  data: T[];
  rowKey: keyof T | ((row: T) => string);
  selectable?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
  emptyMessage?: string;
  actions?: React.ReactNode;
  className?: string;
}

function getKey<T>(row: T, rowKey: keyof T | ((row: T) => string)): string {
  return typeof rowKey === "function" ? rowKey(row) : String(row[rowKey]);
}

export function OtrDataTable<T>({
  columns,
  data,
  rowKey,
  selectable = false,
  selectedRows: controlledSelected,
  onSelectionChange,
  emptyMessage = "데이터가 없습니다.",
  actions,
  className,
}: OtrDataTableProps<T>) {
  const [internalSelected, setInternalSelected] = useState<Set<string>>(new Set());
  const selected = controlledSelected ?? internalSelected;
  const setSelected = onSelectionChange ?? setInternalSelected;

  const allKeys = data.map((row) => getKey(row, rowKey));
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.has(k));

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allKeys));
    }
  }, [allSelected, allKeys, setSelected]);

  const toggleRow = useCallback(
    (key: string) => {
      const next = new Set(selected);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      setSelected(next);
    },
    [selected, setSelected]
  );

  return (
    <div className={className}>
      {actions && (
        <div className="flex items-center justify-end gap-2 mb-2">{actions}</div>
      )}
      <table>
        <thead>
          <tr>
            {selectable && (
              <th style={{ width: 36, textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  style={{ width: 14, height: 14 }}
                />
              </th>
            )}
            <th style={{ width: 40, textAlign: "center" }}>No</th>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  width: col.width,
                  textAlign: col.align ?? "center",
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={(selectable ? 2 : 1) + columns.length}
                style={{ textAlign: "center", padding: "20px 0", color: "#999" }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => {
              const key = getKey(row, rowKey);
              return (
                <tr key={key}>
                  {selectable && (
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selected.has(key)}
                        onChange={() => toggleRow(key)}
                        style={{ width: 14, height: 14 }}
                      />
                    </td>
                  )}
                  <td style={{ textAlign: "center" }}>{idx + 1}</td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{ textAlign: col.align ?? "left" }}
                    >
                      {col.render
                        ? col.render(row, idx)
                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
