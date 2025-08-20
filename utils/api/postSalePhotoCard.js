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

// axios 도입전 코드
// export async function postSalePhotoCard(photoCardId, payload) {
//   const baseUrl = process.env.NEXT_PUBLIC_API_URL;
//   const postSalePhotoCardUrl = `${baseUrl}/sales/photo-card/${photoCardId}`;

//   const res = await fetch(postSalePhotoCardUrl, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(payload),
//   });
//   const ct = res.headers.get("content-type") || "";
//   let body = null;
//   try {
//     if (ct.includes("application/json")) body = await res.json();
//     else body = await res.text();
//   } catch (_) {
//     body = null;
//   }

//   if (!res.ok) {
//     const msg =
//       (body && typeof body === "object" && body.message) ||
//       (typeof body === "string" && body) ||
//       `HTTP ${res.status}`;
//     throw new Error(msg);
//   }
//   return body ?? { ok: true };
// }
