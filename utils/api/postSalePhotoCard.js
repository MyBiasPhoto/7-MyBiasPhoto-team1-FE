// src/services/sale.js
import api from "@/lib/axiosAuth.js";
import axios from "axios";

export async function postSalePhotoCard(photoCardId, payload) {
  try {
    const res = await api.post(
      `/sales/photo-card/${photoCardId}`,
      payload,
      { _auth: true } // 보호 API면 유지
    );
    return res.data ?? { ok: true };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data;
      const msg =
        (data && typeof data === "object" && data.message) ||
        (typeof data === "string" && data) ||
        `HTTP ${status}`;
      throw new Error(msg);
    }
    throw err;
  }
}