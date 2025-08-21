// src/services/exchange.js
import api from "@/lib/axiosAuth.js";

/**
 * fetch Response 또는 axios Promise/Response를 받아 동일한 형태로 처리
 * - 성공: data(JSON) 반환 (없으면 {})
 * - 실패: Error(message) throw + err.status, err.payload 세팅
 */
export async function handleResponse(input, defaultErrorMsg) {
  // 1) fetch Response 형태 처리
  if (
    input &&
    typeof input.json === "function" &&
    typeof input.ok === "boolean"
  ) {
    const res = input;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        data?.message ||
        data?.error ||
        `${defaultErrorMsg} (status ${res.status})`;
      const err = new Error(msg);
      err.status = res.status;
      err.payload = data;
      throw err;
    }
    return data ?? {};
  }

  // 2) axios Promise/Response 처리
  try {
    // Promise가 넘어오면 await, Response가 넘어오면 그대로 사용
    const res = typeof input?.data !== "undefined" ? input : await input;
    return res?.data ?? {};
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const data = error.response?.data ?? {};
      const msg =
        data?.message || data?.error || `${defaultErrorMsg} (status ${status})`;
      const err = new Error(msg);
      err.status = status;
      err.payload = data;
      throw err;
    }
    const err = new Error(defaultErrorMsg);
    err.status = 0;
    err.payload = {};
    throw err;
  }
}

// 교환 제시 - POST /sales/:saleId/proposals
export async function createExchangeProposal(saleId, proposedCardId, message) {
  return handleResponse(
    api.post(
      `/api/sales/${saleId}/proposals`,
      { proposedCardId, message },
      { _auth: true }
    ),
    "교환 제시 실패"
  );
}

// 교환 제시 취소 - PATCH /sales/exchange-proposals/:proposalId/cancel
export async function cancelExchangeProposal(proposalId) {
  return handleResponse(
    api.patch(`/api/sales/exchange-proposals/${proposalId}/cancel`, null, {
      _auth: true,
    }),
    "교환 제시 취소 실패"
  );
}

// 교환 제시 승인(판매자) - PATCH /sales/exchange-proposals/:proposalId/accept
export async function acceptExchangeProposal(proposalId) {
  return handleResponse(
    api.patch(`/api/sales/exchange-proposals/${proposalId}/accept`, null, {
      _auth: true,
    }),
    "교환 제시 승인 실패"
  );
}

// 교환 제시 거절(판매자) - PATCH /sales/exchange-proposals/:proposalId/reject
export async function rejectExchangeProposal(proposalId) {
  return handleResponse(
    api.patch(`/api/sales/exchange-proposals/${proposalId}/reject`, null, {
      _auth: true,
    }),
    "교환 제시 거절 실패"
  );
}

// 교환 제시 목록 조회(구매자) - GET /sales/exchange-proposals/my
export async function getMyExchangeProposals(query = {}) {
  const { page, pageSize, status } = query;
  return handleResponse(
    api.get(`/api/sales/exchange-proposals/my`, {
      params: { page, pageSize, status },
      _auth: true,
    }),
    "교환 제시 목록 조회 실패"
  );
}

// 받은 교환 제시 목록(판매자) - GET /sales/:saleId/exchange-proposals/received
export async function getReceivedExchangeProposals(saleId) {
  return handleResponse(
    api.get(`/api/sales/${saleId}/exchange-proposals/received`, {
      _auth: true,
    }),
    "받은 교환 제시 목록 조회 실패"
  );
}