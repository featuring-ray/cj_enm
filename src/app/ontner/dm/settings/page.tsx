"use client";

import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Pencil,
  Trash2,
  Clock,
  Settings,
  Zap,
  UserPlus,
  Heart,
  Timer,
  Power,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import dmTemplatesData from "@/data/mock/dm-templates.json";

// ─── Mock 데이터 ──────────────────────────────────────────

interface AutoDmRule {
  id: string;
  name: string;
  triggerType: "캠페인참여" | "신규팔로워" | "댓글반응" | "일정시간";
  triggerValue: string;
  templateId: string;
  templateName: string;
  scheduleType: "즉시" | "예약";
  timeSlots: string[];
  enabled: boolean;
  sentCount: number;
  successRate: number;
  createdAt: string;
}

interface DmSendLog {
  id: string;
  ruleId: string;
  ruleName: string;
  recipientHandle: string;
  sentAt: string;
  status: "발송" | "읽음" | "실패";
}

const mockRules: AutoDmRule[] = [
  {
    id: "rule-1",
    name: "캠페인 참여 감사 DM",
    triggerType: "캠페인참여",
    triggerValue: "캠페인 참여 확정 시",
    templateId: "tpl-1",
    templateName: "캠페인 감사 메시지",
    scheduleType: "즉시",
    timeSlots: [],
    enabled: true,
    sentCount: 45,
    successRate: 95.6,
    createdAt: "2026-02-10",
  },
  {
    id: "rule-2",
    name: "신규 팔로워 환영 DM",
    triggerType: "신규팔로워",
    triggerValue: "새 팔로워 감지 시",
    templateId: "tpl-2",
    templateName: "환영 인사 메시지",
    scheduleType: "예약",
    timeSlots: ["09:00-12:00", "14:00-18:00"],
    enabled: true,
    sentCount: 320,
    successRate: 88.1,
    createdAt: "2026-01-15",
  },
  {
    id: "rule-3",
    name: "댓글 반응 자동 답장",
    triggerType: "댓글반응",
    triggerValue: "댓글 키워드: 구매, 링크, 가격",
    templateId: "tpl-3",
    templateName: "구매 안내 DM",
    scheduleType: "즉시",
    timeSlots: [],
    enabled: false,
    sentCount: 128,
    successRate: 92.3,
    createdAt: "2026-02-20",
  },
  {
    id: "rule-4",
    name: "정기 알림 DM",
    triggerType: "일정시간",
    triggerValue: "매주 월요일 10:00",
    templateId: "tpl-1",
    templateName: "캠페인 감사 메시지",
    scheduleType: "예약",
    timeSlots: ["10:00-11:00"],
    enabled: false,
    sentCount: 12,
    successRate: 100,
    createdAt: "2026-03-01",
  },
];

const mockSendLogs: DmSendLog[] = [
  { id: "log-1", ruleId: "rule-1", ruleName: "캠페인 참여 감사 DM", recipientHandle: "@style_queen", sentAt: "2026-03-22T09:30:00", status: "읽음" },
  { id: "log-2", ruleId: "rule-2", ruleName: "신규 팔로워 환영 DM", recipientHandle: "@beauty_lover99", sentAt: "2026-03-22T09:15:00", status: "발송" },
  { id: "log-3", ruleId: "rule-1", ruleName: "캠페인 참여 감사 DM", recipientHandle: "@fashionista_kr", sentAt: "2026-03-21T18:20:00", status: "읽음" },
  { id: "log-4", ruleId: "rule-2", ruleName: "신규 팔로워 환영 DM", recipientHandle: "@daily_life_tip", sentAt: "2026-03-21T15:10:00", status: "발송" },
  { id: "log-5", ruleId: "rule-3", ruleName: "댓글 반응 자동 답장", recipientHandle: "@shopping_addict", sentAt: "2026-03-21T14:05:00", status: "읽음" },
  { id: "log-6", ruleId: "rule-2", ruleName: "신규 팔로워 환영 DM", recipientHandle: "@mom_style_daily", sentAt: "2026-03-21T11:30:00", status: "실패" },
  { id: "log-7", ruleId: "rule-1", ruleName: "캠페인 참여 감사 DM", recipientHandle: "@review_master", sentAt: "2026-03-21T10:45:00", status: "읽음" },
  { id: "log-8", ruleId: "rule-2", ruleName: "신규 팔로워 환영 DM", recipientHandle: "@food_creator_j", sentAt: "2026-03-20T16:20:00", status: "발송" },
  { id: "log-9", ruleId: "rule-3", ruleName: "댓글 반응 자동 답장", recipientHandle: "@skincare_diary", sentAt: "2026-03-20T13:15:00", status: "읽음" },
  { id: "log-10", ruleId: "rule-1", ruleName: "캠페인 참여 감사 DM", recipientHandle: "@travel_with_me", sentAt: "2026-03-20T09:50:00", status: "읽음" },
  { id: "log-11", ruleId: "rule-2", ruleName: "신규 팔로워 환영 DM", recipientHandle: "@minimal_home", sentAt: "2026-03-19T17:00:00", status: "발송" },
  { id: "log-12", ruleId: "rule-2", ruleName: "신규 팔로워 환영 DM", recipientHandle: "@pet_lover_22", sentAt: "2026-03-19T14:30:00", status: "읽음" },
];

const triggerIcons: Record<string, React.ElementType> = {
  캠페인참여: Zap,
  신규팔로워: UserPlus,
  댓글반응: Heart,
  일정시간: Timer,
};

const statusConfig: Record<string, { color: string }> = {
  발송: { color: "bg-blue-100 text-blue-800" },
  읽음: { color: "bg-green-100 text-green-800" },
  실패: { color: "bg-red-100 text-red-800" },
};

function formatDate(d: string) {
  const dt = new Date(d);
  return `${dt.getMonth() + 1}/${dt.getDate()} ${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

// ─── 메인 컴포넌트 ──────────────────────────────────────

export default function AutoDmSettingsPage() {
  const [rules, setRules] = useState<AutoDmRule[]>(mockRules);
  const [masterEnabled, setMasterEnabled] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoDmRule | null>(null);

  const totalSent = rules.reduce((s, r) => s + r.sentCount, 0);
  const activeRules = rules.filter((r) => r.enabled).length;
  const avgSuccess = rules.length > 0
    ? (rules.reduce((s, r) => s + r.successRate, 0) / rules.length).toFixed(1)
    : "0";

  function toggleRule(id: string) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }

  function deleteRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  function openNewRule() {
    setEditingRule(null);
    setEditDialog(true);
  }

  function openEditRule(rule: AutoDmRule) {
    setEditingRule(rule);
    setEditDialog(true);
  }

  function handleSaveRule(rule: AutoDmRule) {
    if (editingRule) {
      setRules((prev) => prev.map((r) => (r.id === rule.id ? rule : r)));
    } else {
      setRules((prev) => [...prev, { ...rule, id: `rule-${Date.now()}`, sentCount: 0, successRate: 0, createdAt: new Date().toISOString().slice(0, 10) }]);
    }
    setEditDialog(false);
  }

  return (
    <>
      <PageHeader
        title="자동 DM 설정"
        description="O-DM-01 · 피처링 스튜디오를 통한 자동 DM 발송 규칙을 설정합니다."
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">자동 DM</Label>
              <Switch checked={masterEnabled} onCheckedChange={setMasterEnabled} />
              <Badge variant={masterEnabled ? "default" : "secondary"} className="text-[10px]">
                {masterEnabled ? "ON" : "OFF"}
              </Badge>
            </div>
            <Button size="sm" onClick={openNewRule} disabled={!masterEnabled}>
              <Plus className="mr-1.5 h-4 w-4" />
              규칙 추가
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {!masterEnabled && (
          <Card className="border-yellow-200 bg-yellow-50/50">
            <CardContent className="pt-3 pb-3 px-4 flex items-center gap-3">
              <Power className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">자동 DM 기능이 비활성화되어 있습니다</p>
                <p className="text-xs text-yellow-600">모든 자동 DM 발송이 중지됩니다. 상단 토글을 ON으로 변경하면 활성화됩니다.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ─── 통계 카드 ─── */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "활성 규칙", value: `${activeRules}/${rules.length}`, color: "text-blue-600" },
            { label: "총 발송 수", value: `${totalSent}건`, color: "text-green-600" },
            { label: "평균 성공률", value: `${avgSuccess}%`, color: "text-purple-600" },
            { label: "오늘 발송", value: `${mockSendLogs.filter((l) => l.sentAt.startsWith("2026-03-22")).length}건`, color: "text-orange-600" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-3 px-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="rules">
          <TabsList>
            <TabsTrigger value="rules">
              <Settings className="h-3.5 w-3.5 mr-1.5" />
              발송 규칙 ({rules.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              발송 이력
            </TabsTrigger>
          </TabsList>

          {/* ─── 발송 규칙 탭 ─── */}
          <TabsContent value="rules" className="space-y-4 mt-4">
            {rules.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">등록된 자동 DM 규칙이 없습니다.</p>
                  <Button size="sm" onClick={openNewRule}>
                    <Plus className="mr-1.5 h-4 w-4" /> 첫 번째 규칙 만들기
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {rules.map((rule) => {
                  const TriggerIcon = triggerIcons[rule.triggerType] || Zap;
                  return (
                    <Card key={rule.id} className={!rule.enabled ? "opacity-60" : ""}>
                      <CardContent className="pt-4 pb-3 px-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 p-2 rounded-lg bg-purple-50">
                              <TriggerIcon className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{rule.name}</p>
                                <Badge variant="outline" className="text-[10px]">{rule.triggerType}</Badge>
                                <Badge variant={rule.scheduleType === "즉시" ? "default" : "secondary"} className="text-[10px]">
                                  {rule.scheduleType}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{rule.triggerValue}</p>
                              <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                                <span>템플릿: {rule.templateName}</span>
                                {rule.timeSlots.length > 0 && (
                                  <span>시간대: {rule.timeSlots.join(", ")}</span>
                                )}
                                <span>발송: {rule.sentCount}건</span>
                                <span>성공률: {rule.successRate}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={rule.enabled}
                              onCheckedChange={() => toggleRule(rule.id)}
                              disabled={!masterEnabled}
                            />
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEditRule(rule)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => deleteRule(rule.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ─── 발송 이력 탭 ─── */}
          <TabsContent value="history" className="mt-4">
            <Card>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">발송 시각</TableHead>
                      <TableHead>규칙</TableHead>
                      <TableHead>수신자</TableHead>
                      <TableHead className="w-[80px]">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSendLogs.map((log) => {
                      const sc = statusConfig[log.status];
                      return (
                        <TableRow key={log.id}>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(log.sentAt)}
                          </TableCell>
                          <TableCell className="text-xs font-medium">{log.ruleName}</TableCell>
                          <TableCell className="text-xs text-blue-600">{log.recipientHandle}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={`text-[10px] ${sc.color}`}>
                              {log.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="px-4 py-3 border-t text-xs text-muted-foreground">
                최근 {mockSendLogs.length}건 표시 중
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ─── 규칙 편집 다이얼로그 ─── */}
      <RuleEditDialog
        open={editDialog}
        onOpenChange={setEditDialog}
        rule={editingRule}
        onSave={handleSaveRule}
      />
    </>
  );
}

// ─── 규칙 편집 다이얼로그 ────────────────────────────────

function RuleEditDialog({
  open,
  onOpenChange,
  rule,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  rule: AutoDmRule | null;
  onSave: (r: AutoDmRule) => void;
}) {
  const [name, setName] = useState(rule?.name || "");
  const [triggerType, setTriggerType] = useState<string>(rule?.triggerType || "캠페인참여");
  const [triggerValue, setTriggerValue] = useState(rule?.triggerValue || "");
  const [templateId, setTemplateId] = useState(rule?.templateId || "");
  const [scheduleType, setScheduleType] = useState<string>(rule?.scheduleType || "즉시");
  const [timeSlotStart, setTimeSlotStart] = useState("09:00");
  const [timeSlotEnd, setTimeSlotEnd] = useState("18:00");

  const isEdit = !!rule;

  function handleSubmit() {
    const templates = dmTemplatesData as { id: string; name: string }[];
    const tpl = templates.find((t) => t.id === templateId);
    onSave({
      id: rule?.id || `rule-${Date.now()}`,
      name,
      triggerType: triggerType as AutoDmRule["triggerType"],
      triggerValue,
      templateId,
      templateName: tpl?.name || "사용자 정의",
      scheduleType: scheduleType as AutoDmRule["scheduleType"],
      timeSlots: scheduleType === "예약" ? [`${timeSlotStart}-${timeSlotEnd}`] : [],
      enabled: rule?.enabled ?? true,
      sentCount: rule?.sentCount || 0,
      successRate: rule?.successRate || 0,
      createdAt: rule?.createdAt || new Date().toISOString().slice(0, 10),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "규칙 수정" : "새 자동 DM 규칙"}</DialogTitle>
          <DialogDescription>
            자동 DM 발송 조건과 템플릿을 설정합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-sm">규칙 이름 *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 캠페인 참여 감사 DM"
              className="h-8 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm">트리거 조건</Label>
              <Select value={triggerType} onValueChange={setTriggerType}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="캠페인참여">캠페인 참여 시</SelectItem>
                  <SelectItem value="신규팔로워">신규 팔로워</SelectItem>
                  <SelectItem value="댓글반응">댓글 반응</SelectItem>
                  <SelectItem value="일정시간">일정 시간</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">발송 방식</Label>
              <Select value={scheduleType} onValueChange={setScheduleType}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="즉시">즉시 발송</SelectItem>
                  <SelectItem value="예약">예약 발송</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">트리거 상세</Label>
            <Input
              value={triggerValue}
              onChange={(e) => setTriggerValue(e.target.value)}
              placeholder="예: 댓글 키워드: 구매, 링크, 가격"
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">DM 템플릿</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="템플릿 선택" />
              </SelectTrigger>
              <SelectContent>
                {(dmTemplatesData as { id: string; name: string }[]).map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {scheduleType === "예약" && (
            <div className="space-y-2">
              <Label className="text-sm">발송 가능 시간대</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={timeSlotStart}
                  onChange={(e) => setTimeSlotStart(e.target.value)}
                  className="h-8 text-sm w-[120px]"
                />
                <span className="text-sm text-muted-foreground">~</span>
                <Input
                  type="time"
                  value={timeSlotEnd}
                  onChange={(e) => setTimeSlotEnd(e.target.value)}
                  className="h-8 text-sm w-[120px]"
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
          <Button onClick={handleSubmit} disabled={!name || !templateId}>
            {isEdit ? "저장" : "규칙 생성"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
