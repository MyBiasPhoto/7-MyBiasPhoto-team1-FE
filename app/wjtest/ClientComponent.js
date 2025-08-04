// app/wjtest/ClientComponent.js
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/utils/api/wjTestFetchProduct";

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
    <div>
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
  );
}
