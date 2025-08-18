// // components/ads/CoupangWidget.js

// "use client";
// import { useEffect, useRef } from "react";

// export default function CoupangWidget({
//   widgetId, // 쿠팡 위젯 id (숫자)
//   trackingCode, // 예: "AF1234567"
//   template = "carousel", // carousel | basic | ...
//   width = "680",
//   height = "140",
// }) {
//   const containerRef = useRef(null);
//   const initedRef = useRef(false); // 🔒 중복 초기화 방지

//   useEffect(() => {
//     if (initedRef.current) return; // 같은 props로 재렌더 시 재실행 방지
//     initedRef.current = true;

//     let scriptEl;
//     let onLoad, onError;

//     const ensureScript = () =>
//       new Promise((resolve, reject) => {
//         // 이미 로드됨
//         if (window.PartnersCoupang?.G) return resolve();

//         // 기존 스크립트가 로딩 중이면 해당 이벤트에 붙기
//         const existed = document.querySelector('script[data-coupang="g.js"]');
//         if (existed) {
//           onLoad = () => resolve();
//           onError = () => reject(new Error("g.js load error"));
//           existed.addEventListener("load", onLoad, { once: true });
//           existed.addEventListener("error", onError, { once: true });
//           return;
//         }

//         // 새로 로드
//         scriptEl = document.createElement("script");
//         scriptEl.src = "https://ads-partners.coupang.com/g.js";
//         scriptEl.async = true;
//         scriptEl.dataset.coupang = "g.js";
//         scriptEl.onload = () => resolve();
//         scriptEl.onerror = () => reject(new Error("g.js load error"));
//         document.body.appendChild(scriptEl);
//       });

//     ensureScript()
//       .then(() => {
//         // g.js가 내부적으로 컨테이너를 찾아 iframe을 삽입함
//         // 컨테이너는 비워두면 됩니다.
//         /* global PartnersCoupang */
//         new window.PartnersCoupang.G({
//           id: widgetId,
//           template,
//           trackingCode,
//           width,
//           height,
//         });
//       })
//       .catch(() => {
//         // 실패 시 대체 링크 배치
//         if (containerRef.current) {
//           containerRef.current.innerHTML = `
//             <a href="https://link.coupang.com/a/${trackingCode}"
//                target="_blank" rel="nofollow sponsored noopener">
//                쿠팡에서 보기
//             </a>`;
//         }
//       });

//     // 정리(언마운트 시 이벤트 핸들러 제거)
//     return () => {
//       const existed = document.querySelector('script[data-coupang="g.js"]');
//       if (existed && onLoad) existed.removeEventListener("load", onLoad);
//       if (existed && onError) existed.removeEventListener("error", onError);
//     };
//   }, [widgetId, trackingCode, template, width, height]);

//   return <div ref={containerRef} aria-label="쿠팡 파트너스 광고 위젯" />;
// }
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
