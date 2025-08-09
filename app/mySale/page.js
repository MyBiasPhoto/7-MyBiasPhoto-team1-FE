import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import MySaleClient from "./MySaleClient.js";

import { initialMySaleFilters } from "@/utils/constants/Filters";
import { fetchMySaleData } from "@/utils/api/mySale.js";
import { cookies, headers } from "next/headers";

export default async function mySalePage() {
  // 서버 fetch는 브라우저처럼 쿠키를 자동 동봉하지 않으므로,
  // 인증이 필요한 API 프리패치 시 현재 요청의 쿠키를 직접 읽어와 전달해야 한다.
  const cookieStore = await cookies();
  const headerStore = await headers();

  // next/headers는 요청의 Cookie 헤더를 파싱해 {name, value} 배열로 제공한다.
  // 백엔드(Express)로 전달하려면 "name=value; name2=value2" 형태의 Cookie 문자열로 재조립해야 한다.
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  // 일부 API는 User-Agent 없으면 비정상 클라이언트로 간주해 차단하기도 한다.
  // 우리 서비스에 필수는 아니지만, 원 요청의 UA를 그대로 전달하면 호환성에 도움이 된다. (선택 사항)
  const ua = headerStore.get("user-agent") ?? "";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["mySale", initialMySaleFilters],
    queryFn: () =>
      fetchMySaleData(initialMySaleFilters, {
        // 서버 fetch에는 브라우저 쿠키가 자동 포함되지 않으므로 수동 주입
        cookie: cookieHeader,
        headers: {
          "user-agent": ua,
        },
      }),
  });

  // 프리패칭 성공 여부 확인을 위한 console
  // const cached = queryClient.getQueryData(["mySale", initialMySaleFilters]);
  // console.log("[SSR Prefetch] cached mySaleData:", cached);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MySaleClient initialFilters={initialMySaleFilters} />
    </HydrationBoundary>
  );
}
