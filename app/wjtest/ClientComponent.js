// app/wjtest/ClientComponent.js
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/utils/api/wjTestFetchProduct";
import dynamic from "next/dynamic";
import CoupangWidget from "@/components/common/ads/CoupangWidget";
import styles from "./wjtest.module.css";

export default function ClientComponent() {
  // [클라이언트 컴포넌트] - 실제 화면에 데이터 렌더링
  const { data, isPending, error } = useQuery({
    queryKey: ["products", { q: "", limit: 5, offset: 1 }],
    queryFn: fetchProducts,
  });
  // 서버에서 넘긴 캐시가 존재하면 fetch 없이 즉시 렌더링
  // 없으면 자동으로 fetch 실행

  if (isPending) return <p>로딩 중...</p>;
  if (error) return <p>에러 발생: {error.message}</p>;

  return (
    <div className={styles.bg}>
      <div>
        <h2>추천 상품</h2>
        <div>
          template : basic
          <CoupangWidget
            widgetId={1234567}
            trackingCode="AF1234567"
            template="basic"
          />
        </div>
        <div>
          template : carousel
          <CoupangWidget
            widgetId={1234567}
            trackingCode="AF1234567"
            template="carousel"
          />
        </div>
        <div>
          template: vertical
          <CoupangWidget
            widgetId={1234567}
            trackingCode="AF1234567"
            template="vertical" // 세로형
            width="120"
            height="600"
          />
        </div>
        <div>
          template : card
          <CoupangWidget
            widgetId={7654321}
            trackingCode="AF1234567"
            template="card" // 카드형
            width="300"
            height="300"
          />
        </div>

        <h2>후디 상품 목록</h2>
        <ul>
          {data.results.map((product) => (
            <li key={product.id}>
              <img src={product.imgUrl} width={100} alt={product.name} />
              <p>{product.name}</p>
              <p>{product.price.toLocaleString()}원</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
