// components/common/ads/CoupangWidget.js
"use client";
import { useEffect, useRef } from "react";

export default function CoupangWidget({
  widgetId, // 숫자
  trackingCode, // 문자열
  template = "card",
  width = 220, // px 숫자, 카드 크기와 맞춤
  height = 300, // px 숫자, 카드 크기와 맞춤
}) {
  const containerRef = useRef(null);
  const initedRef = useRef(false);

  useEffect(() => {
    if (initedRef.current) return;
    initedRef.current = true;

    // 쿠팡 스크립트 로드
    const scriptEl = document.createElement("script");
    scriptEl.src = "https://ads-partners.coupang.com/g.js";
    scriptEl.async = true;
    scriptEl.dataset.coupang = "g.js";

    scriptEl.onload = () => {
      if (!containerRef.current) return; // container가 있을 때만 실행
      if (window.PartnersCoupang?.G) {
        new window.PartnersCoupang.G({
          id: widgetId,
          template,
          trackingCode,
          width,
          height,
          container: containerRef.current, // container 명시
        });
      }
    };

    scriptEl.onerror = () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <a href="https://link.coupang.com/a/${trackingCode}"
             target="_blank" rel="nofollow sponsored noopener">
             쿠팡에서 보기
          </a>`;
      }
    };

    document.body.appendChild(scriptEl);

    return () => {
      document.body.removeChild(scriptEl);
    };
  }, [widgetId, trackingCode, template, width, height]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
      aria-label="쿠팡 파트너스 광고 위젯"
    />
  );
}
