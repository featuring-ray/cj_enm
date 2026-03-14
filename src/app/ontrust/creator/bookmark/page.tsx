"use client";

import { useState } from "react";
import {
  Bookmark,
  Plus,
  Pencil,
  Trash2,
  Send,
  UserPlus,
  MessageSquare,
  FolderOpen,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  X,
  Instagram,
  Youtube,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { OtrTierBadge } from "@/components/ontrust";
import rawCreators from "@/data/mock/creators.json";

type Creator = (typeof rawCreators)[number];

interface BookmarkGroup {
  id: string;
  name: string;
  description: string;
  creatorIds: string[];
  createdAt: string;
}

const TIER_MAP: Record<string, "purple" | "green" | "blue"> = {
  GOLD: "purple",
  SILVER: "green",
  BRONZE: "blue",
};

const INITIAL_GROUPS: BookmarkGroup[] = [
  {
    id: "group-1",
    name: "뷰티/패션 주력 크리에이터",
    description: "CJ온스타일 뷰티 캠페인 협업 대상",
    creatorIds: ["creator-1", "creator-3", "creator-7"],
    createdAt: "2025-02-10",
  },
  {
    id: "group-2",
    name: "푸드/리빙 크리에이터",
    description: "식품 및 리빙 카테고리 전문 크리에이터",
    creatorIds: ["creator-2", "creator-5", "creator-6"],
    createdAt: "2025-02-15",
  },
  {
    id: "group-3",
    name: "대규모 팔로워 보유 크리에이터",
    description: "팔로워 30만 이상 메가/매크로 인플루언서",
    creatorIds: ["creator-4", "creator-2", "creator-8", "creator-7"],
    createdAt: "2025-03-01",
  },
];

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString("ko-KR");
}

function getEngColor(rate: number) {
  if (rate >= 5) return "#7c3aed";
  if (rate >= 3) return "#059669";
  return "#6b7280";
}

type View = "list" | "detail";

export default function BookmarkPage() {
  const [groups, setGroups] = useState<BookmarkGroup[]>(INITIAL_GROUPS);
  const [view, setView] = useState<View>("list");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedCreators, setSelectedCreators] = useState<Set<string>>(new Set());

  // Dialog states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);
  const groupCreators: Creator[] = selectedGroup
    ? (selectedGroup.creatorIds
        .map((id) => rawCreators.find((c) => c.id === id))
        .filter(Boolean) as Creator[])
    : [];

  // Group actions
  const handleAddGroup = () => {
    if (!formName.trim()) return;
    const newGroup: BookmarkGroup = {
      id: `group-${Date.now()}`,
      name: formName.trim(),
      description: formDesc.trim(),
      creatorIds: [],
      createdAt: new Date().toISOString().split("T")[0],
    };
    setGroups((prev) => [...prev, newGroup]);
    setFormName("");
    setFormDesc("");
    setAddOpen(false);
  };

  const handleEditGroup = () => {
    if (!formName.trim() || !selectedGroupId) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === selectedGroupId
          ? { ...g, name: formName.trim(), description: formDesc.trim() }
          : g
      )
    );
    setFormName("");
    setFormDesc("");
    setEditOpen(false);
  };

  const handleDeleteGroup = () => {
    setGroups((prev) => prev.filter((g) => g.id !== selectedGroupId));
    setSelectedGroupId("");
    setSelectedCreators(new Set());
    setView("list");
    setDeleteOpen(false);
  };

  const handleRemoveCreator = (creatorId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === selectedGroupId
          ? { ...g, creatorIds: g.creatorIds.filter((id) => id !== creatorId) }
          : g
      )
    );
    setSelectedCreators((prev) => {
      const next = new Set(prev);
      next.delete(creatorId);
      return next;
    });
  };

  const toggleCreator = (cid: string) => {
    setSelectedCreators((prev) => {
      const next = new Set(prev);
      if (next.has(cid)) next.delete(cid);
      else next.add(cid);
      return next;
    });
  };

  const toggleAll = () => {
    if (!selectedGroup) return;
    if (selectedCreators.size === groupCreators.length) {
      setSelectedCreators(new Set());
    } else {
      setSelectedCreators(new Set(groupCreators.map((c) => c.id)));
    }
  };

  const openDetail = (groupId: string) => {
    setSelectedGroupId(groupId);
    setSelectedCreators(new Set());
    setView("detail");
  };

  const backToList = () => {
    setView("list");
    setSelectedGroupId("");
    setSelectedCreators(new Set());
  };

  return (
    <>
      <PageHeader
        title={view === "list" ? "관심 크리에이터 관리" : (selectedGroup?.name ?? "")}
        description={
          view === "list"
            ? "크리에이터 그룹을 만들고 관심 크리에이터를 체계적으로 관리합니다"
            : `${groupCreators.length}명 · ${selectedGroup?.description ?? ""}`
        }
        actions={
          view === "list" ? (
            <button
              className="otr-btn-primary"
              onClick={() => {
                setFormName("");
                setFormDesc("");
                setAddOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              그룹 추가
            </button>
          ) : (
            <button className="otr-btn-secondary" onClick={backToList}>
              <ArrowLeft className="h-3.5 w-3.5" />
              목록으로
            </button>
          )
        }
      />

      <main className="flex-1 p-4 md:p-6">
        {/* ── GROUP LIST VIEW (T-A-10) ── */}
        {view === "list" && (
          <div>
            <div className="otr-toolbar mb-3">
              <span className="text-[12px] text-[#555]">
                총 <strong>{groups.length}</strong>개 그룹
              </span>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e0e0e0", background: "#fafafa" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#555", width: 40 }}>
                    No
                  </th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#555" }}>
                    그룹명
                  </th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#555" }}>
                    설명
                  </th>
                  <th style={{ padding: "8px 12px", textAlign: "center", fontSize: 11, fontWeight: 600, color: "#555", width: 80 }}>
                    크리에이터 수
                  </th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#555", width: 120 }}>
                    생성일
                  </th>
                  <th style={{ padding: "8px 12px", textAlign: "center", fontSize: 11, fontWeight: 600, color: "#555", width: 120 }}>
                    관리
                  </th>
                </tr>
              </thead>
              <tbody>
                {groups.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "40px 12px", textAlign: "center", color: "#999", fontSize: 12 }}>
                      그룹이 없습니다. 그룹을 추가해 관심 크리에이터를 관리하세요.
                    </td>
                  </tr>
                ) : (
                  groups.map((group, idx) => (
                    <tr
                      key={group.id}
                      style={{ borderBottom: "1px solid #f0f0f0", height: 40 }}
                      className="hover:bg-[#faf9ff] transition-colors"
                    >
                      <td style={{ padding: "0 12px", fontSize: 12, color: "#888" }}>{idx + 1}</td>
                      <td style={{ padding: "0 12px" }}>
                        <button
                          onClick={() => openDetail(group.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#7c3aed",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          <FolderOpen className="h-3.5 w-3.5" />
                          {group.name}
                          <ChevronRight className="h-3 w-3 opacity-50" />
                        </button>
                      </td>
                      <td style={{ padding: "0 12px", fontSize: 12, color: "#666" }}>
                        {group.description || <span style={{ color: "#ccc" }}>-</span>}
                      </td>
                      <td style={{ padding: "0 12px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: 36,
                            height: 22,
                            borderRadius: 11,
                            background: group.creatorIds.length > 0 ? "#f3f0ff" : "#f5f5f5",
                            color: group.creatorIds.length > 0 ? "#7c3aed" : "#999",
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "0 8px",
                          }}
                        >
                          {group.creatorIds.length} / 500
                        </span>
                      </td>
                      <td style={{ padding: "0 12px", fontSize: 12, color: "#888" }}>
                        {group.createdAt}
                      </td>
                      <td style={{ padding: "0 12px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                          <button
                            className="otr-btn-toolbar"
                            onClick={() => {
                              setSelectedGroupId(group.id);
                              setFormName(group.name);
                              setFormDesc(group.description);
                              setEditOpen(true);
                            }}
                            title="그룹 수정"
                          >
                            <Pencil className="h-3 w-3" />
                            수정
                          </button>
                          <button
                            className="otr-btn-toolbar"
                            style={{ color: "#dc2626" }}
                            onClick={() => {
                              setSelectedGroupId(group.id);
                              setDeleteOpen(true);
                            }}
                            title="그룹 삭제"
                          >
                            <Trash2 className="h-3 w-3" />
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── GROUP DETAIL VIEW (T-A-14) ── */}
        {view === "detail" && selectedGroup && (
          <div>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#888", marginBottom: 12 }}>
              <button
                onClick={backToList}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: 0, fontSize: 12 }}
              >
                관심 크리에이터 관리
              </button>
              <ChevronRight className="h-3 w-3" />
              <span style={{ color: "#7c3aed", fontWeight: 600 }}>{selectedGroup.name}</span>
            </div>

            {/* Group info + actions toolbar */}
            <div className="otr-toolbar mb-3">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: "#555" }}>
                  총 <strong>{groupCreators.length}</strong>명
                  {selectedCreators.size > 0 && (
                    <span style={{ color: "#7c3aed", marginLeft: 8 }}>
                      ({selectedCreators.size}명 선택됨)
                    </span>
                  )}
                </span>
                <span style={{ color: "#e0e0e0" }}>|</span>
                <span style={{ fontSize: 11, color: "#999" }}>
                  최대 500명 등록 가능
                </span>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button
                  className="otr-btn-toolbar"
                  disabled={selectedCreators.size === 0}
                  onClick={() =>
                    alert(`${selectedCreators.size}명에게 캠페인 제안을 발송합니다.`)
                  }
                >
                  <Send className="h-3 w-3" />
                  캠페인 제안
                </button>
                <button
                  className="otr-btn-toolbar"
                  disabled={selectedCreators.size === 0}
                  onClick={() =>
                    alert(`${selectedCreators.size}명에게 회원가입 제안을 발송합니다.`)
                  }
                >
                  <UserPlus className="h-3 w-3" />
                  회원가입 제안
                </button>
                <button
                  className="otr-btn-toolbar"
                  disabled={selectedCreators.size === 0}
                  onClick={() =>
                    alert(`${selectedCreators.size}명에게 DM을 발송합니다.`)
                  }
                >
                  <MessageSquare className="h-3 w-3" />
                  DM 발송
                </button>
                <div style={{ width: 1, height: 20, background: "#e0e0e0" }} />
                <button
                  className="otr-btn-toolbar"
                  onClick={() => {
                    setFormName(selectedGroup.name);
                    setFormDesc(selectedGroup.description);
                    setEditOpen(true);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                  그룹 수정
                </button>
                <button
                  className="otr-btn-toolbar"
                  style={{ color: "#dc2626" }}
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-3 w-3" />
                  그룹 삭제
                </button>
              </div>
            </div>

            {/* Creator table */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e0e0e0", background: "#fafafa" }}>
                  <th style={{ padding: "8px 12px", width: 36 }}>
                    <input
                      type="checkbox"
                      checked={
                        groupCreators.length > 0 &&
                        selectedCreators.size === groupCreators.length
                      }
                      onChange={toggleAll}
                      style={{ cursor: "pointer" }}
                    />
                  </th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#555", width: 36 }}>No</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#555" }}>크리에이터</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#555" }}>플랫폼</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#555" }}>카테고리</th>
                  <th style={{ padding: "8px 12px", textAlign: "right", fontSize: 11, fontWeight: 600, color: "#555" }}>팔로워</th>
                  <th style={{ padding: "8px 12px", textAlign: "right", fontSize: 11, fontWeight: 600, color: "#555" }}>참여율</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", fontSize: 11, fontWeight: 600, color: "#555" }}>등급</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", fontSize: 11, fontWeight: 600, color: "#555" }}>온트너</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", fontSize: 11, fontWeight: 600, color: "#555" }}>액션</th>
                </tr>
              </thead>
              <tbody>
                {groupCreators.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ padding: "40px 12px", textAlign: "center", color: "#999", fontSize: 12 }}>
                      이 그룹에 크리에이터가 없습니다. 크리에이터 탐색 페이지에서 북마크로 추가하세요.
                    </td>
                  </tr>
                ) : (
                  groupCreators.map((creator, idx) => {
                    const isChecked = selectedCreators.has(creator.id);
                    return (
                      <tr
                        key={creator.id}
                        style={{
                          borderBottom: "1px solid #f0f0f0",
                          height: 40,
                          background: isChecked ? "#f9f7ff" : undefined,
                        }}
                        className="hover:bg-[#faf9ff] transition-colors"
                      >
                        <td style={{ padding: "0 12px" }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCreator(creator.id)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                        <td style={{ padding: "0 12px", fontSize: 12, color: "#888" }}>{idx + 1}</td>
                        <td style={{ padding: "0 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: "#ede9fe",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#7c3aed",
                                flexShrink: 0,
                              }}
                            >
                              {creator.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>
                                {creator.name}
                              </div>
                              <div style={{ fontSize: 11, color: "#888" }}>@{creator.handle}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "0 12px" }}>
                          <div style={{ display: "flex", gap: 4 }}>
                            <Instagram className="h-3.5 w-3.5 text-[#E1306C]" />
                            {creator.youtubeHandle && (
                              <Youtube className="h-3.5 w-3.5 text-[#FF0000]" />
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "0 12px" }}>
                          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                            {creator.category.map((cat) => (
                              <span key={cat} className="otr-classification">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: "0 12px", textAlign: "right", fontSize: 12, fontWeight: 500 }}>
                          {formatNumber(creator.followers)}
                        </td>
                        <td style={{ padding: "0 12px", textAlign: "right", fontSize: 12, fontWeight: 600 }}>
                          <span style={{ color: getEngColor(creator.engagementRate) }}>
                            {creator.engagementRate}%
                          </span>
                        </td>
                        <td style={{ padding: "0 12px", textAlign: "center" }}>
                          <OtrTierBadge tier={TIER_MAP[creator.tier] ?? "blue"} />
                        </td>
                        <td style={{ padding: "0 12px", textAlign: "center" }}>
                          {creator.isOntnerMember ? (
                            <span className="otr-badge-purple">회원</span>
                          ) : (
                            <span className="otr-badge-black">비회원</span>
                          )}
                        </td>
                        <td style={{ padding: "0 12px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                            <a
                              href={`/ontrust/creator/${creator.id}`}
                              className="otr-btn-toolbar"
                              style={{ textDecoration: "none" }}
                            >
                              <ExternalLink className="h-3 w-3" />
                              상세
                            </a>
                            <button
                              className="otr-btn-toolbar"
                              style={{ color: "#dc2626" }}
                              onClick={() => handleRemoveCreator(creator.id)}
                              title="북마크 해제"
                            >
                              <Bookmark className="h-3 w-3" />
                              해제
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ── ADD GROUP DIALOG (T-A-11) ── */}
      {addOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={() => setAddOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              width: 400,
              padding: "24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>그룹 추가 (T-A-11)</h3>
              <button onClick={() => setAddOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>
                  그룹명 <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="그룹 이름을 입력하세요"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddGroup()}
                  style={{
                    width: "100%",
                    border: "1px solid #e0e0e0",
                    borderRadius: 4,
                    padding: "6px 10px",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>
                  설명 (선택)
                </label>
                <input
                  type="text"
                  placeholder="그룹 설명을 입력하세요"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  style={{
                    width: "100%",
                    border: "1px solid #e0e0e0",
                    borderRadius: 4,
                    padding: "6px 10px",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
              <button className="otr-btn-secondary" onClick={() => setAddOpen(false)}>취소</button>
              <button
                className="otr-btn-primary"
                onClick={handleAddGroup}
                disabled={!formName.trim()}
              >
                <Plus className="h-3.5 w-3.5" />
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT GROUP DIALOG (T-A-12) ── */}
      {editOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={() => setEditOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              width: 400,
              padding: "24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>그룹 수정 (T-A-12)</h3>
              <button onClick={() => setEditOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>
                  그룹명 <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="그룹 이름"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEditGroup()}
                  style={{
                    width: "100%",
                    border: "1px solid #e0e0e0",
                    borderRadius: 4,
                    padding: "6px 10px",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>
                  설명 (선택)
                </label>
                <input
                  type="text"
                  placeholder="그룹 설명"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  style={{
                    width: "100%",
                    border: "1px solid #e0e0e0",
                    borderRadius: 4,
                    padding: "6px 10px",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
              <button className="otr-btn-secondary" onClick={() => setEditOpen(false)}>취소</button>
              <button
                className="otr-btn-primary"
                onClick={handleEditGroup}
                disabled={!formName.trim()}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE GROUP DIALOG (T-A-13) ── */}
      {deleteOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={() => setDeleteOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              width: 380,
              padding: "24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>그룹 삭제 (T-A-13)</h3>
              <button onClick={() => setDeleteOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div
              style={{
                background: "#fff5f5",
                border: "1px solid #fecaca",
                borderRadius: 6,
                padding: "12px",
                marginBottom: 16,
              }}
            >
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                <strong style={{ color: "#dc2626" }}>
                  &ldquo;{groups.find((g) => g.id === selectedGroupId)?.name}&rdquo;
                </strong>{" "}
                그룹을 삭제하시겠습니까?
              </p>
              <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                그룹에 등록된 크리에이터 북마크도 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="otr-btn-secondary" onClick={() => setDeleteOpen(false)}>취소</button>
              <button
                className="otr-btn-primary"
                style={{ background: "#dc2626", borderColor: "#dc2626" }}
                onClick={handleDeleteGroup}
              >
                <Trash2 className="h-3.5 w-3.5" />
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
