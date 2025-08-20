// src/services/sale.js
import api from "@/lib/axiosAuth.js";

export async function buySale(saleId, quantity) {
  try {
    const res = await api.post(
      `/sales/${saleId}/buy`,
      { quantity },
      { _auth: true }
    );
    return res.data ?? {};
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data ?? {};
      const message =
        data?.message ||
        data?.error ||
        `구매에 실패했습니다. (status ${status})`;
      const error = new Error(message);
      error.status = status;
      error.payload = data;
      throw error;
    }
    throw err;
  }
}

// src/api/sales.js
// 삭제 예ㅇ

// 일단 임시 주석 처리 - KJS
/*export const fetchSales = async () => {
  const res = await fetch("http://localhost:3500/sales");

  if (!res.ok) {
    throw new Error("판매 목록을 불러오지 못했습니다.");
  }

  const data = await res.json();
  return data;
};*/

//@TODO  아래와 같은 방식으로 페이지별 캐시 구분하게끔 해야함
// export const fetchSales = async (page = 1, pageSize = 9) => {
//   const res = await fetch(`http://localhost:3500/sales?page=${page}&pageSize=${pageSize}`);

// api 수정 - KJS

// axios 도입전
// export async function buySale(saleId, quantity) {
//   const baseUrl = process.env.NEXT_PUBLIC_API_URL;
//   const url = `${baseUrl}/sales/${saleId}/buy`;

//   const res = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include", // 쿠키 기반 인증
//     body: JSON.stringify({ quantity }),
//   });

//   const data = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     const message =
//       data?.message ||
//       data?.error ||
//       `구매에 실패했습니다. (status ${res.status})`;
//     const error = new Error(message);
//     error.status = res.status;
//     error.payload = data;
//     throw error;
//   }

//   return data;
// }
