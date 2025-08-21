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