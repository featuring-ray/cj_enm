"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignCardData {
  id: string;
  name: string;
  brand: string;
  campaignType: string;
  settlementType: string;
  status: string;
  recruitCount: number;
  recruitEndDate: string;
  imageUrl: string;
}

interface OntnCampaignCardProps {
  campaign: CampaignCardData;
  className?: string;
}

export function OntnCampaignCard({ campaign, className }: OntnCampaignCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <Link href={`/ontner/campaign/${campaign.id}`} className={cn("block", className)}>
      <div className="ontn-campaign-card">
        {/* Image Area */}
        <div className="ontn-card-image relative bg-gray-100 overflow-hidden">
          {campaign.imageUrl ? (
            <img
              src={campaign.imageUrl}
              alt={campaign.brand}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              {campaign.brand}
            </div>
          )}

          {/* Heart Icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiked(!liked);
            }}
            className="absolute top-3 right-3 p-1"
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-colors",
                liked ? "fill-red-500 text-red-500" : "text-white drop-shadow-md"
              )}
            />
          </button>

          {/* Bottom Overlay */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1.5">
            <span className="ontn-status-badge">{campaign.status}</span>
            <span className="ontn-recruit-badge">
              모집인원 {campaign.recruitCount}명
            </span>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-3 space-y-1">
          <p className="text-xs text-gray-500">
            {campaign.campaignType} | {campaign.brand}
          </p>
          <p className="ontn-reward-label">{campaign.settlementType}</p>
          <p className="text-sm text-gray-900 line-clamp-2 leading-snug">
            {campaign.name}
          </p>
          <p className="flex items-center gap-1 text-xs text-gray-400 pt-1">
            <Calendar className="w-3 h-3" />
            모집기한 {campaign.recruitEndDate.replace(/-/g, ".")} 23:59
          </p>
        </div>
      </div>
    </Link>
  );
}
