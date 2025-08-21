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
