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
