// utils/api/myGalleries.js
export const fetchMyGalleryData = async (filters = {}, extra = {}) => {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.grade) params.append("grade", filters.grade);
  if (filters.genre) params.append("genre", filters.genre);
  if (filters.sort) params.append("sort", filters.sort); //저는 sort를 안쓰지만 쓰실분들쓰셔요
  if (filters.page) params.append("page", filters.page);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const myGalleryPath = "/users/me/userCard/grouped";
  // const myGalleryPath = "/users/me/userCard/market";

  const queryString = params.toString();

  // GET http://localhost:4000/users/me/userCard/grouped
  const url = `${baseUrl}${myGalleryPath}${
    queryString ? `?${queryString}` : ""
  }`;
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      ...(extra.cookie ? { Cookie: extra.cookie } : {}),
      ...(extra.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("판매 목록을 불러오지 못했습니다.");
    // @TODO 에러발생시 페이지 생성
  }

  const data = await res.json();
  return data;
};
