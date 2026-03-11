"use client";

import { useState, useEffect } from "react";
import {
  Send,
  Plus,
  Pencil,
  Trash2,
  Search,
  Link as LinkIcon,
  Check,
  X,
  Copy,
  Eye,
  AlertCircle,
  Variable,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { featuringApi } from "@/lib/featuring-api";

interface DmTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

interface SendHistory {
  id: string;
  date: string;
  recipient: string;
  template: string;
  status: "발송" | "읽음" | "실패";
}

const MOCK_ACCOUNTS = [
  { id: "acc-1", username: "ontrust_official_1" },
  { id: "acc-2", username: "ontrust_official_2" },
  { id: "acc-3", username: "ontrust_cs_1" },
  { id: "acc-4", username: "ontrust_cs_2" },
  { id: "acc-5", username: "ontrust_marketing_1" },
  { id: "acc-6", username: "ontrust_marketing_2" },
  { id: "acc-7", username: "ontrust_partner_1" },
  { id: "acc-8", username: "ontrust_partner_2" },
  { id: "acc-9", username: "ontrust_dm_1" },
  { id: "acc-10", username: "ontrust_dm_2" },
  { id: "acc-11", username: "ontrust_dm_3" },
];

const MOCK_HISTORY: SendHistory[] = [
  { id: "h-1", date: "2026-03-11 09:30", recipient: "@beauty_hana", template: "캠페인 제안", status: "읽음" },
  { id: "h-2", date: "2026-03-11 09:15", recipient: "@foodie_jin", template: "캠페인 제안", status: "발송" },
  { id: "h-3", date: "2026-03-10 18:00", recipient: "@fashion_kim", template: "회원가입 안내", status: "읽음" },
  { id: "h-4", date: "2026-03-10 15:30", recipient: "@tech_master", template: "성과 공유", status: "실패" },
  { id: "h-5", date: "2026-03-10 14:00", recipient: "@living_queen", template: "캠페인 제안", status: "읽음" },
  { id: "h-6", date: "2026-03-09 11:00", recipient: "@travel_pro", template: "회원가입 안내", status: "발송" },
];

const STATUS_COLORS: Record<string, string> = {
  "발송": "bg-blue-100 text-blue-800",
  "읽음": "bg-green-100 text-green-800",
  "실패": "bg-red-100 text-red-800",
};

export default function DmPage() {
  const [templates, setTemplates] = useState<DmTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Send form
  const [recipient, setRecipient] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  // Template CRUD
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DmTemplate | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [templateContent, setTemplateContent] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await featuringApi.getDmTemplates();
        setTemplates(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // When template changes, populate message
  useEffect(() => {
    if (!selectedTemplate) {
      setMessage("");
      setVariableValues({});
      return;
    }
    const tpl = templates.find((t) => t.id === selectedTemplate);
    if (tpl) {
      setMessage(tpl.content);
      const vars: Record<string, string> = {};
      tpl.variables.forEach((v) => {
        vars[v] = "";
      });
      setVariableValues(vars);
    }
  }, [selectedTemplate, templates]);

  const getPreviewMessage = () => {
    let preview = message;
    Object.entries(variableValues).forEach(([key, val]) => {
      preview = preview.replaceAll(`{${key}}`, val || `{${key}}`);
    });
    if (link) {
      preview = preview.replaceAll("{링크}", link);
    }
    return preview;
  };

  const handleSend = async () => {
    if (!recipient || !selectedAccount) return;
    setSending(true);
    try {
      await featuringApi.sendDm({
        recipientId: recipient,
        accountId: selectedAccount,
        templateId: selectedTemplate || undefined,
        message: getPreviewMessage(),
        link: link || undefined,
      });
      alert("DM이 발송되었습니다.");
      setRecipient("");
      setMessage("");
      setLink("");
      setSelectedTemplate("");
    } finally {
      setSending(false);
    }
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim() || !templateContent.trim()) return;
    // Extract variables from content
    const vars: string[] = [];
    const regex = /\{([^}]+)\}/g;
    let match;
    while ((match = regex.exec(templateContent)) !== null) {
      if (!vars.includes(match[1])) vars.push(match[1]);
    }

    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id
            ? { ...t, name: templateName, content: templateContent, variables: vars }
            : t
        )
      );
    } else {
      setTemplates((prev) => [
        ...prev,
        {
          id: `tpl-${Date.now()}`,
          name: templateName,
          content: templateContent,
          variables: vars,
        },
      ]);
    }
    setEditDialogOpen(false);
    setEditingTemplate(null);
    setTemplateName("");
    setTemplateContent("");
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const currentTemplate = templates.find((t) => t.id === selectedTemplate);

  return (
    <>
      <PageHeader
        title="DM 발송 관리"
        description="크리에이터에게 DM을 발송하고 이력을 관리합니다"
      />

      <main className="flex-1 p-4 md:p-6">
        <Tabs defaultValue="send">
          <TabsList>
            <TabsTrigger value="send">발송</TabsTrigger>
            <TabsTrigger value="history">이력</TabsTrigger>
            <TabsTrigger value="templates">템플릿</TabsTrigger>
          </TabsList>

          {/* Send tab */}
          <TabsContent value="send" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">DM 작성</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>수신자 검색</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="@username 검색..."
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>발송 계정</Label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="발송 계정 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_ACCOUNTS.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>
                            @{acc.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>템플릿 선택</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="템플릿 선택 (선택사항)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">직접 작성</SelectItem>
                        {templates.map((tpl) => (
                          <SelectItem key={tpl.id} value={tpl.id}>
                            {tpl.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Variable inputs */}
                  {currentTemplate && currentTemplate.variables.length > 0 && (
                    <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                        <Variable className="h-3.5 w-3.5" />
                        변수 입력
                      </div>
                      {currentTemplate.variables.map((v) => (
                        <div key={v} className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs shrink-0 font-mono">
                            {`{${v}}`}
                          </Badge>
                          <Input
                            className="h-8 text-sm"
                            placeholder={`${v} 입력...`}
                            value={variableValues[v] || ""}
                            onChange={(e) =>
                              setVariableValues((prev) => ({
                                ...prev,
                                [v]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>메시지</Label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="메시지를 입력하세요..."
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>링크 첨부</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="https://..."
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleSend}
                    disabled={!recipient || !selectedAccount || !message || sending}
                  >
                    <Send className="h-4 w-4 mr-1.5" />
                    {sending ? "발송 중..." : "DM 발송"}
                  </Button>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    미리보기
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-lg p-4 min-h-[200px]">
                    {message ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>발신: @{MOCK_ACCOUNTS.find((a) => a.id === selectedAccount)?.username || "미선택"}</span>
                          <span>→</span>
                          <span>수신: {recipient || "미입력"}</span>
                        </div>
                        <div className="bg-background rounded-lg p-3 text-sm whitespace-pre-wrap border">
                          {getPreviewMessage()}
                        </div>
                        {link && (
                          <div className="flex items-center gap-1.5 text-xs text-blue-600">
                            <LinkIcon className="h-3 w-3" />
                            {link}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        메시지를 입력하면 미리보기가 표시됩니다
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History tab */}
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">발송 이력</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>발송일시</TableHead>
                      <TableHead>수신자</TableHead>
                      <TableHead>템플릿</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_HISTORY.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {h.date}
                        </TableCell>
                        <TableCell className="text-sm font-mono">
                          {h.recipient}
                        </TableCell>
                        <TableCell className="text-sm">
                          {h.template}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs border-0 ${STATUS_COLORS[h.status] || ""}`}
                          >
                            {h.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates tab */}
          <TabsContent value="templates" className="mt-4 space-y-4">
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  setEditingTemplate(null);
                  setTemplateName("");
                  setTemplateContent("");
                  setEditDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                템플릿 추가
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((tpl) => (
                <Card key={tpl.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{tpl.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => {
                            setEditingTemplate(tpl);
                            setTemplateName(tpl.name);
                            setTemplateContent(tpl.content);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive"
                          onClick={() => handleDeleteTemplate(tpl.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-2">
                      {tpl.content}
                    </p>
                    <div className="flex gap-1 flex-wrap">
                      {tpl.variables.map((v) => (
                        <Badge key={v} variant="outline" className="text-xs font-mono">
                          {`{${v}}`}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Template Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "템플릿 수정" : "템플릿 추가"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>템플릿명</Label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="템플릿 이름"
              />
            </div>
            <div className="space-y-2">
              <Label>내용</Label>
              <Textarea
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                placeholder="안녕하세요 {크리에이터명}님! {캠페인명} 캠페인에..."
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                {`{변수명}`} 형식으로 변수를 삽입하세요. 예: {`{크리에이터명}`}, {`{캠페인명}`}, {`{링크}`}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSaveTemplate} disabled={!templateName.trim() || !templateContent.trim()}>
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
