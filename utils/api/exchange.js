const baseUrl = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse(res, defaultErrorMsg) {
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
  return data;
}

//교환 제시
//POST /sales/:saleId/proposals
export async function createExchangeProposal(saleId, proposedCardId, message) {
  const url = `${baseUrl}/api/sales/${saleId}/proposals`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ proposedCardId, message }),
  });

  return handleResponse(res, "교환 제시 실패");
}

// 교환 제시 취소
// PATCH /sales/exchange-proposals/:proposalId/cancel
export async function cancelExchangeProposal(proposalId) {
  const url = `${baseUrl}/api/sales/exchange-proposals/${proposalId}/cancel`;

  const res = await fetch(url, {
    method: "PATCH",
    credentials: "include",
  });

  return handleResponse(res, "교환 제시 취소 실패");
}

// 교환 제시 승인 (판매자)
// PATCH /sales/exchange-proposals/:proposalId/accept
export async function acceptExchangeProposal(proposalId) {
  const url = `${baseUrl}/api/sales/exchange-proposals/${proposalId}/accept`;

  const res = await fetch(url, {
    method: "PATCH",
    credentials: "include",
  });

  return handleResponse(res, "교환 제시 승인 실패");
}

// 교환 제시 거절 (판매자)
// PATCH /sales/exchange-proposals/:proposalId/reject
export async function rejectExchangeProposal(proposalId) {
  const url = `${baseUrl}/api/sales/exchange-proposals/${proposalId}/reject`;

  const res = await fetch(url, {
    method: "PATCH",
    credentials: "include",
  });

  return handleResponse(res, "교환 제시 거절 실패");
}

// 교환 제시 목록 조회 (구매자)
// GET /sales/exchange-proposals/my
export async function getMyExchangeProposals(query = {}) {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  if (query.status) params.set("status", String(query.status));

  const url = `${baseUrl}/api/sales/exchange-proposals/my${
    params.toString() ? `?${params}` : ""
  }`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse(res, "교환 제시 목록 조회 실패");
}

// 받은 교환 제시 목록 조회 (판매자)
// GET /sales/:saleId/exchange-proposals/received
export async function getReceivedExchangeProposals(saleId) {
  const url = `${baseUrl}/api/sales/${saleId}/exchange-proposals/received`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse(res, "받은 교환 제시 목록 조회 실패");
}
