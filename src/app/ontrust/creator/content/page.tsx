"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OntrustCreatorContentRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/ontrust/creator/search?tab=content");
  }, [router]);

  return (
    <div style={{ padding: 40, textAlign: "center", color: "#999", fontSize: 13 }}>
      콘텐츠 탐색 페이지로 이동 중...
    </div>
  );
}
