//utils/Providers.js

// React Query 전역 클라이언트를 앱 전체에 적용하는 컴포넌트
// 이 파일은 Next.js layout.js에서 import되어 모든 페이지에 적용됨
// (이로 인해 클라이언트 컴포넌트 어디서든 useQuery 사용 가능)

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, //데이터가 60초 동안은 신선하다고 판단 -> 60초동안 다시 fetch하지 않음
          },
        },
      })
  );


  // 클라이언트 컴포넌트용 캐시 객체 생성
  // 브라우저에서 실행 layout.js를 통해 전체 앱에 적용
  // 클라이언트에서 useQuery를 사용할 수 있게 해주는 전역 queryClient역할
  // 이 queryClient는 hydration 이후 캐시를 유지하거나, CSR(use client) 환경에서 fetch를 처리할 때 사용되는 주체

  return (
    <QueryClientProvider client={queryClient}>
      {/* QueryClientProvider 로 감싼 모든 자식컴포넌트에서 useQuery, useMutation 사용 가능 */}
      {children}
      {/* 우진수정 @TODO 나중에 환경변수 설정통해 개발모드에서만 보이게 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
