// // utils/api/myGalleries.js
// export const fetchMyGalleryData = async (filters = {}, extra = {}) => {
//   const params = new URLSearchParams();

//   if (filters.search) params.append("search", filters.search);
//   if (filters.grade) params.append("grade", filters.grade);
//   if (filters.genre) params.append("genre", filters.genre);
//   if (filters.sort) params.append("sort", filters.sort); //저는 sort를 안쓰지만 쓰실분들쓰셔요
//   if (filters.page) params.append("page", filters.page);

//   const baseUrl = process.env.NEXT_PUBLIC_API_URL;
//   const myGalleryPath = "/users/me/userCard/grouped";
//   // const myGalleryPath = "/users/me/userCard/market";

//   const queryString = params.toString();

//   // GET http://localhost:4000/users/me/userCard/grouped
//   const url = `${baseUrl}${myGalleryPath}${
//     queryString ? `?${queryString}` : ""
//   }`;
//   const res = await fetch(url, {
//     credentials: "include",
//     headers: {
//       ...(extra.cookie ? { Cookie: extra.cookie } : {}),
//       ...(extra.headers || {}),
//     },
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     throw new Error("판매 목록을 불러오지 못했습니다.");
//     // @TODO 에러발생시 페이지 생성
//   }

//   const data = await res.json();
//   return data;
// };

// utils/api/myGalleries.js
import api from "@/lib/axiosAuth";

/**
 * axios 버전: 내 갤러리 조회
 * - CSR: 인터셉터 + 쿠키 자동
 * - SSR/RSC: extra.cookie 로 받은 쿠키를 헤더로 전달(백엔드 권한 판별용)
 */
export const fetchMyGalleryData = async (filters = {}, extra = {}) => {
  const params = {
    ...(filters.search && { search: filters.search }),
    ...(filters.grade && { grade: filters.grade }),
    ...(filters.genre && { genre: filters.genre }),
    ...(filters.sort && { sort: filters.sort }),
    ...(filters.page && { page: filters.page }),
  };

  const headers = {
    ...(extra.cookie ? { Cookie: extra.cookie } : {}),
    ...(extra.headers || {}),
  };

  try {
    const { data } = await api.get("/users/me/userCard/grouped", {
      params,
      headers,
      // axios에는 fetch의 cache: 'no-store' 옵션 없음
      // SSR 캐시제어는 백엔드 Cache-Control로 관리해야 함
    });
    return data;
  } catch (err) {
    const status = err?.response?.status;
    const msg =
      err?.response?.data?.message || "갤러리 목록을 불러오지 못했습니다.";
    throw new Error(status ? `${msg} (HTTP ${status})` : msg);
  }
};
