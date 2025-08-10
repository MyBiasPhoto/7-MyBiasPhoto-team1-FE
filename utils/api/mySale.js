export const fetchMySaleData = async (filters = {}, extra = {}) => {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.grade) params.append("grade", filters.grade);
  if (filters.genre) params.append("genre", filters.genre);
  if (filters.page) params.append("page", filters.page);
  if (filters.saleType) params.append("saleType", filters.saleType);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const mySalePath = "/users/me/userCard/market";

  const queryString = params.toString();

  // GET http://localhost:4000/users/me/userCard/market
  const url = `${baseUrl}${mySalePath}${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    // 클라이언트에서 실행될 때는 브라우저 쿠키 포함
    credentials: "include",
    // 서버에서 실행될 때는 우리가 넘겨준 쿠키/헤더 사용
    headers: {
      ...(extra.cookie ? { Cookie: extra.cookie } : {}),
      ...(extra.headers || {}),
    },
    cache: "no-store", // 인증 데이터는 보통 캐시 끔(SSR에서 최신 보장)
  });

  if (!res.ok) {
    throw new Error("판매 목록을 불러오지 못했습니다.");
  }

  console.log("[fetchMySaleData] URL =", url);
  return res.json();
};
