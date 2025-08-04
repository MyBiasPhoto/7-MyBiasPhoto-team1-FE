// app/wjtest/page.js

// [페이지 구조 요약]
// 이 페이지는 서버에서 React Query로 데이터를 미리 가져오고 (prefetch),
// 클라이언트에서는 그 데이터를 캐시로 활용해 네트워크 요청 없이 즉시 화면을 렌더링한다.
// - 서버: QueryClient 생성 → prefetch → dehydrate (직렬화)
// - 클라이언트: useQuery로 이미 캐시된 데이터 재사용 (fetch 없이 화면 렌더)
// - 목적: 초기 페이지 로딩 속도 향상 & 데이터 일관성 확보

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchProducts } from "@/utils/api/wjTestFetchProduct";
import ClientComponent from "./ClientComponent"; // 클라에서 useQuery 쓸 파일 (다음 단계에서 작성할 예정)

export default async function WjTestPage() {
  const queryClient = new QueryClient(); // SSR에서도 쓸 수 있도록 새로운 QueryClient 생성
  // 서버전용 (use client 없음 -> 서버클라이언트) prefetch용 임시 인스턴스 클라이언트 해당 페이지에서만 사용
  //즉 이 queryClient는 데이터를 SSR에서 fetch하고,
  // 클라이언트에 전달할 직렬화 데이터((json으로 만들기) dehydratedState)를 만들기 위한 일회성 객체

  // 사전 prefetch
  await queryClient.prefetchQuery({
    queryKey: ["products", { q: "", limit: 5, offset: 1 }],
    queryFn: fetchProducts,
  });

  // prefetch로 받은 데이터를 직렬화(dehydrate : json화)하여 HydrationBoundary에 넘김
  // 이렇게 넘긴 데이터는 클라이언트에서 캐시로 재사용됨
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientComponent />
    </HydrationBoundary>
  );
}
