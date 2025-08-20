// utils/api/marketPlace.js
import api from "@/lib/axiosAuth";

/**
 * 판매 목록 조회
 * - filters: { soldout, grade, genre, orderBy, search, page }
 * - extra: { cookie, headers }
 */
export default async function fetchSales(filters = {}, extra = {}) {
  const params = {
    includeSoldOut: String(filters?.soldout ?? false),
    ...(filters.grade && { grade: filters.grade }),
    ...(filters.genre && { genre: filters.genre }),
    ...(filters.orderBy && { orderBy: filters.orderBy }),
    ...(filters.search && { search: filters.search }),
    ...(filters.page && { page: filters.page }),
  };

  const headers = {
    ...(extra.cookie ? { Cookie: extra.cookie } : {}),
    ...(extra.headers || {}),
  };

  try {
    const { data } = await api.get("/sales", { _auth: true, params, headers });
    if (data === undefined) throw new Error("서버에서 데이터가 비어 있습니다.");
    return data;
  } catch (err) {
    const status = err?.response?.status;
    const msg =
      err?.response?.data?.message || "판매 목록을 불러오지 못했습니다.";
    throw new Error(status ? `${msg} (HTTP ${status})` : msg);
  }
}

/**
 * 판매 단건 조회
 * - extra: { cookie, headers }
 */
export async function fetchSaleById(id, extra = {}) {
  const headers = {
    ...(extra.cookie ? { Cookie: extra.cookie } : {}),
    ...(extra.headers || {}),
  };

  try {
    const { data } = await api.get(`/sales/${id}`, { _auth: true, headers });
    if (data === undefined) throw new Error("서버에서 데이터가 비어 있습니다.");
    return data;
  } catch (err) {
    const status = err?.response?.status;
    const msg =
      err?.response?.data?.message || "판매 상세를 불러오지 못했습니다.";
    throw new Error(status ? `${msg} (HTTP ${status})` : msg);
  }
}

/**
 * 판매 정보 수정(PATCH)
 * - body: data
 * - extra: { cookie, headers }
 */
export async function updatedSale({ id, data: body }, extra = {}) {
  const headers = {
    ...(extra.cookie ? { Cookie: extra.cookie } : {}),
    ...(extra.headers || {}),
  };

  try {
    const { data } = await api.patch(`/sales/${id}`, body, {
      _auth: true,
      headers,
    });
    if (data === undefined) throw new Error("서버에서 데이터가 비어 있습니다.");
    return data;
  } catch (err) {
    const status = err?.response?.status;
    const msg =
      err?.response?.data?.message || "판매 정보를 수정하지 못했습니다.";
    throw new Error(status ? `${msg} (HTTP ${status})` : msg);
  }
}

/**
 * 판매 소프트 삭제(PATCH /delete)
 * - body: data
 * - extra: { cookie, headers }
 */
export async function deletedAtSaleById({ id, data: body }, extra = {}) {
  const headers = {
    ...(extra.cookie ? { Cookie: extra.cookie } : {}),
    ...(extra.headers || {}),
  };

  try {
    const { data } = await api.patch(`/sales/${id}/delete`, body, {
      _auth: true,
      headers,
    });
    if (data === undefined) throw new Error("서버에서 데이터가 비어 있습니다.");
    return data;
  } catch (err) {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message || "판매를 삭제하지 못했습니다.";
    throw new Error(status ? `${msg} (HTTP ${status})` : msg);
  }
}

//axiosAuth 적용 전

// //utils/api/marketPlace.js
// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export default async function fetchSales(filters) {
//   const query = new URLSearchParams();
//   query.append("includeSoldOut", filters.soldout ?? "false");
//   if (filters.grade) query.append("grade", filters.grade);
//   if (filters.genre) query.append("genre", filters.genre);
//   if (filters.orderBy) query.append("orderBy", filters.orderBy);
//   if (filters.search) query.append("search", filters.search);
//   if (filters.page) query.append("page", filters.page);

//   const res = await fetch(`${API_URL}/sales?${query.toString()}`);

//   if (!res.ok) throw new Error("Network response was not ok");

//   const data = await res.json();
//   if (data === undefined) throw new Error("No data returned from server");

//   return data;
// }

// export async function fetchSaleById(id) {
//   const res = await fetch(`${API_URL}/sales/${id}`);

//   if (!res.ok) throw new Error("Network response was not ok");

//   const data = await res.json();
//   if (data === undefined) throw new Error("No data returned from server");

//   return data;
// }

// export async function updatedSale({ id, data }) {
//   const res = await fetch(`${API_URL}/sales/${id}`, {
//     method: "PATCH",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) throw new Error("Network response was not ok");

//   const responseData = await res.json();
//   if (responseData === undefined)
//     throw new Error("No data returned from server");

//   return responseData;
// }

// export async function deletedAtSaleById({ id, data }) {
//   const res = await fetch(`${API_URL}/sales/${id}/delete`, {
//     method: "PATCH",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) throw new Error("Network response was not ok");

//   const responseData = await res.json();
//   if (responseData === undefined)
//     throw new Error("No data returned from server");

//   return responseData;
// }
