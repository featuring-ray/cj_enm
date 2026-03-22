"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { featuringApi } from "@/lib/featuring-api";
import mockCampaignsJson from "@/data/mock/campaigns.json";
import { OntnInfoSection } from "@/components/ontner/ontn-info-section";
import { OntnProductGrid } from "@/components/ontner/ontn-product-grid";
import { OntnBottomActionBar } from "@/components/ontner/ontn-bottom-action-bar";

type CampaignData = (typeof mockCampaignsJson)[0];

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [applied, setApplied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    async function load() {
      const campaigns = await featuringApi.getNewCampaigns();
      const found =
        (campaigns as CampaignData[]).find((c) => c.id === campaignId) || null;
      setCampaign(found);
    }
    load();
  }, [campaignId]);

  if (!campaign) {
    return (
      <div className="flex-1 p-6">
        <p className="text-sm text-gray-400 text-center py-12">
          캠페인을 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  const campaignTypeSuffix =
    campaign.campaignType === "공동구매" ? "(전체정산형)" : "";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-6 pt-6 pb-24 space-y-8 max-w-[900px]">
        {/* Campaign Code & Title */}
        <div>
          <p className="text-xs text-gray-400 mb-1">{campaign.campaignCode}</p>
          <h1 className="text-xl font-bold text-gray-900">{campaign.name}</h1>
        </div>

        {/* 기본 정보 */}
        <OntnInfoSection
          title="기본 정보"
          items={[
            {
              label: "캠페인/서/브랜드",
              value: (
                <span>
                  {campaign.brand}
                </span>
              ),
            },
            {
              label: "캠페인 유형",
              value: (
                <div>
                  <span>
                    {campaign.campaignType}
                    {campaignTypeSuffix}
                  </span>
                  {campaign.campaignType === "공동구매" && (
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      캠페인 성과기 기간 내 전체 매출에 대해 정산합니다.
                    </p>
                  )}
                </div>
              ),
            },
            {
              label: "대표 상품 예상 공구가",
              value: (
                <span className="font-semibold text-lg text-gray-900">
                  {campaign.expectedPrice}
                </span>
              ),
            },
            {
              label: "정산방식",
              value: <span>{campaign.settlementType}</span>,
            },
          ]}
        />

        {/* 참여 정보 */}
        <OntnInfoSection
          title="참여 정보"
          items={[
            {
              label: "진행기간",
              value: (
                <div className="text-sm">
                  <p>
                    시작일시 {campaign.startDate.replace(/-/g, ".")} 00:00:00
                  </p>
                  <p>
                    종료일시 {campaign.endDate.replace(/-/g, ".")} 23:59:59
                  </p>
                </div>
              ),
            },
            {
              label: "진행 희망채널",
              value: <span>{campaign.preferredChannel}</span>,
            },
          ]}
        />

        {/* 모집 정보 */}
        <OntnInfoSection
          title="모집 정보"
          items={[
            {
              label: "모집인원",
              value: <span>{campaign.recruitCount}명</span>,
            },
            {
              label: "모집기간",
              value: (
                <div className="text-sm">
                  <p>
                    시작일시 {campaign.recruitStartDate.replace(/-/g, ".")}{" "}
                    14:00:00
                  </p>
                  <p>
                    종료일시 {campaign.recruitEndDate.replace(/-/g, ".")}{" "}
                    23:59:59
                  </p>
                </div>
              ),
            },
          ]}
        />

        {/* 진행 가이드 */}
        <div>
          <h3 className="ontn-section-title">진행 가이드</h3>
          <div className="ontn-guide-box whitespace-pre-line">
            {campaign.guideText}
          </div>
        </div>

        {/* 상품 정보 */}
        {campaign.products && campaign.products.length > 0 && (
          <div>
            <h3 className="ontn-section-title">상품 정보</h3>
            <div className="mt-4">
              <OntnProductGrid products={campaign.products} pageSize={10} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <OntnBottomActionBar
        onApply={() => setApplied(true)}
        onBookmark={() => setBookmarked((v) => !v)}
        bookmarked={bookmarked}
        disabled={applied || campaign.status === "완료"}
        applyLabel={applied ? "신청 완료" : "신청하기"}
      />
    </div>
  );
}
