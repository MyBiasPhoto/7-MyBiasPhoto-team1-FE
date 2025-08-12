const baseUrl = process.env.NEXT_PUBLIC_API_URL;

//교환 제시하기
//POST /sales/:saleId/proposals

export async function createExchangeProposal(saleId, proposedCardId, message) {
  const url = `${baseUrl}/api/sales/${saleId}/proposals`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ proposedCardId, message }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      data?.message || data?.error || `교환 제시 실패 (status ${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  return data;
}

//내가 제시한 교환 목록 조회
//GET /sales/exchange-proposals/my

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

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      `제시한 교환 목록 조회 실패 (status ${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  return data;
}
