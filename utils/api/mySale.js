// export const fetchMySaleData = async (filters = {}, extra = {}) => {
//   const params = new URLSearchParams();

//   if (filters.search) params.append("search", filters.search);
//   if (filters.grade) params.append("grade", filters.grade);
//   if (filters.genre) params.append("genre", filters.genre);
//   if (filters.page) params.append("page", filters.page);
//   if (filters.saleType) params.append("saleType", filters.saleType);

//   const baseUrl = process.env.NEXT_PUBLIC_API_URL;
//   const mySalePath = "/users/me/userCard/market";

//   const queryString = params.toString();

//   // GET http://localhost:4000/users/me/userCard/market
//   const url = `${baseUrl}${mySalePath}${queryString ? `?${queryString}` : ""}`;

//   const res = await fetch(url, {
//     // 클라이언트에서 실행될 때는 브라우저 쿠키 포함
//     credentials: "include",
//     // 서버에서 실행될 때는 우리가 넘겨준 쿠키/헤더 사용
//     headers: {
//       ...(extra.cookie ? { Cookie: extra.cookie } : {}),
//       ...(extra.headers || {}),
//     },
//     cache: "no-store", // 인증 데이터는 보통 캐시 끔(SSR에서 최신 보장)
//   });

//   if (!res.ok) {
//     throw new Error("판매 목록을 불러오지 못했습니다.");
//   }

//   // console.log("[fetchMySaleData] URL =", url);
//   return res.json();
// };

import api from "@/lib/axiosAuth";

/**
 * axios 버전: 내 판매 목록 조회
 * - CSR: 인터셉터 + 쿠키 자동
 * - SSR/RSC: extra.cookie 로 받은 쿠키를 헤더로 전달(백엔드 권한 판별용)
 *   ※ SSR에서 /auth/refresh로 내려오는 Set-Cookie는 브라우저로 전달되지 않음.
 *     브라우저 쿠키를 갱신해야 한다면 /api 프록시 라우트로 중계하는 패턴을 고려.
 */
export const fetchMySaleData = async (filters = {}, extra = {}) => {
  const params = {
    ...(filters.search && { search: filters.search }),
    ...(filters.grade && { grade: filters.grade }),
    ...(filters.genre && { genre: filters.genre }),
    ...(filters.page && { page: filters.page }),
    ...(filters.saleType && { saleType: filters.saleType }),
  };

  const headers = {
    ...(extra.cookie ? { Cookie: extra.cookie } : {}),
    ...(extra.headers || {}),
  };

  try {
    const { data } = await api.get("/users/me/userCard/market", {
      _auth: true,
      params,
      headers,
      // fetch의 cache: 'no-store'와 같은 옵션은 axios에 없음.
      // 서버 캐시를 끄려면 백엔드에서 Cache-Control 헤더로 제어하세요.
    });
    return data; // 기존 fetch 버전의 res.json() 결과에 해당
  } catch (err) {
    // 필요 시 사용자 친화적 에러로 변환
    const status = err?.response?.status;
    const msg =
      err?.response?.data?.message || "판매 목록을 불러오지 못했습니다.";
    // throw 그대로 하면 호출부에서 인터셉터 후의 에러를 구분 가능
    throw new Error(status ? `${msg} (HTTP ${status})` : msg);
  }
};
