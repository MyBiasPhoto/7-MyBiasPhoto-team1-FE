// components/common/ads/CoupangCardSlot.js
"use client";
import CoupangWidget from "@/components/common/ads/CoupangWidget";

export default function CoupangCardSlot({
  widgetId,
  trackingCode,
  // 카드형 위젯 권장 사이즈 (프로젝트 카드 비율에 맞춰 조정)
  width = "300",
  // width = "160",
  height = "300",
  // height = "600",
}) {
  // 카드 박스 안에 정확히 들어가게, 외곽은 그리드 카드 스타일을 그대로 씁니다.
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        width: "100%",
        // height: "100%",
        aspectRatio: "1/1",
        overflow: "hidden",
      }}
    >
      <CoupangWidget
        widgetId={widgetId}
        trackingCode={trackingCode}
        template="card" // 카드형 위젯
        width={300}
        height={300}
      />
    </div>
  );
}
