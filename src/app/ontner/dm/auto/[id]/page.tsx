"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { AutomationForm } from "@/components/auto-dm/automation-form";
import type { AutoDmAutomation, AutoDmFormState } from "@/types/auto-dm";
import { DEFAULT_FOLLOWER_FLOW } from "@/types/auto-dm";
import automationsData from "@/data/mock/auto-dm-automations.json";

function automationToFormState(automation: AutoDmAutomation): AutoDmFormState {
  return {
    name: automation.name,
    postId: automation.postId,
    triggerMode: automation.triggerMode,
    keywordsInput: automation.keywords.join(", "),
    autoReplyEnabled: automation.autoReplyEnabled,
    replyTexts:
      automation.replyTexts.length >= 3
        ? automation.replyTexts
        : [...automation.replyTexts, ...Array(3 - automation.replyTexts.length).fill("")],
    dmMessageBody: automation.dmMessageBody,
    dmImageUrl: automation.dmImageUrl,
    buttons: automation.buttons,
    followerFlow: automation.followerFlow ?? { ...DEFAULT_FOLLOWER_FLOW },
  };
}

export default function EditAutoDmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const automation = (automationsData as AutoDmAutomation[]).find(
    (a) => a.id === id
  );

  if (!automation) {
    notFound();
  }

  const formState = automationToFormState(automation);

  return (
    <div className="p-6">
      <AutomationForm
        initialData={formState}
        status={automation.status}
        automationId={automation.id}
        sourceDraftId={automation.sourceDraftId}
        sourceCampaignName={automation.sourceCampaignName}
      />
    </div>
  );
}
