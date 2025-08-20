// src/services/userCard.js
import api from "@/lib/axiosAuth.js";
import axios from "axios";

export const getUserCardOnIdle = async (filters = {}, extra = {}) => {
  const { search, grade, genre, page } = filters;

  try {
    const res = await api.get("/users/me/userCard/gallery", {
      params: { search, grade, genre, page },
      headers: {
        ...(extra.headers || {}),
        ...(extra.cookie ? { Cookie: extra.cookie } : {}), // SSR에서만 유효
        // 'Cache-Control': 'no-store', // 필요하면 사용
      },
      _auth: true,
    });
    return res.data ?? {};
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data ?? {};
      const message =
        data?.message || data?.error || "판매 목록을 불러오지 못했습니다.";
      const error = new Error(message);
      error.status = status;
      error.payload = data;
      throw error;
    }
    throw err;
  }
};

// axios 도입 전 주석
// export const getUserCardOnIdle = async (filters = {}, extra = {}) => {
//   const params = new URLSearchParams();

//   if (filters.search) params.append("search", filters.search);
//   if (filters.grade) params.append("grade", filters.grade);
//   if (filters.genre) params.append("genre", filters.genre);
//   if (filters.page) params.append("page", filters.page);

//   const baseUrl = process.env.NEXT_PUBLIC_API_URL;
//   const myGalleryPath = "/users/me/userCard/gallery";
//   // const myGalleryPath = "/users/me/userCard/market";

//   const queryString = params.toString();

//   // GET http://localhost:4000/users/me/userCard/gallery
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
//   }

//   const data = await res.json();
//   return data;
// };
