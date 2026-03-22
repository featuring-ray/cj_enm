"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Users } from "lucide-react";
import campaignsData from "@/data/mock/campaigns.json";
import creatorsData from "@/data/mock/creators.json";

interface DraftSendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draftName: string;
  onSend: (campaignId: string, creatorIds: string[]) => void;
}

// 진행 중인 캠페인만 필터
const activeCampaigns = campaignsData.filter(
  (c) => c.status === "진행중" || c.status === "모집중"
);

export function DraftSendDialog({
  open,
  onOpenChange,
  draftName,
  onSend,
}: DraftSendDialogProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);

  const selectedCampaign = activeCampaigns.find(
    (c) => c.id === selectedCampaignId
  );

  // 선택한 캠페인의 참여 크리에이터 (온트너 가입 크리에이터만)
  const campaignCreators = useMemo(() => {
    if (!selectedCampaign) return [];
    return selectedCampaign.creators
      .map((cid) => creatorsData.find((c) => c.id === cid))
      .filter(
        (c): c is (typeof creatorsData)[number] =>
          c !== undefined && c.isOntnerMember
      );
  }, [selectedCampaign]);

  const allSelected =
    campaignCreators.length > 0 &&
    selectedCreatorIds.length === campaignCreators.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedCreatorIds([]);
    } else {
      setSelectedCreatorIds(campaignCreators.map((c) => c.id));
    }
  };

  const toggleCreator = (id: string) => {
    setSelectedCreatorIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSend = () => {
    if (selectedCampaignId && selectedCreatorIds.length > 0) {
      onSend(selectedCampaignId, selectedCreatorIds);
      onOpenChange(false);
      setSelectedCampaignId("");
      setSelectedCreatorIds([]);
    }
  };

  const handleCampaignChange = (value: string) => {
    setSelectedCampaignId(value);
    setSelectedCreatorIds([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>초안 발송</DialogTitle>
          <DialogDescription>
            &quot;{draftName}&quot; 초안을 어떤 캠페인의 크리에이터에게 발송하시겠습니까?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* 캠페인 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">캠페인 선택</label>
            <Select
              value={selectedCampaignId}
              onValueChange={handleCampaignChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="캠페인을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {activeCampaigns.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <div className="flex items-center gap-2">
                      <span>{c.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {c.status}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 크리에이터 목록 */}
          {selectedCampaignId && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  참여 크리에이터
                  <span className="text-muted-foreground">
                    ({campaignCreators.length}명)
                  </span>
                </label>
                {campaignCreators.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={toggleAll}
                  >
                    {allSelected ? "전체 해제" : "전체 선택"}
                  </Button>
                )}
              </div>

              {campaignCreators.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  온트너 가입 크리에이터가 없습니다.
                </p>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto rounded-lg border p-2">
                  {campaignCreators.map((creator) => (
                    <label
                      key={creator.id}
                      className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/50 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedCreatorIds.includes(creator.id)}
                        onCheckedChange={() => toggleCreator(creator.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {creator.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{creator.handle}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {creator.tier}
                      </Badge>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={handleSend}
            disabled={!selectedCampaignId || selectedCreatorIds.length === 0}
          >
            <Send className="mr-2 h-4 w-4" />
            {selectedCreatorIds.length > 0
              ? `${selectedCreatorIds.length}명에게 발송`
              : "발송"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
