import api from "@/lib/axiosAuth.js";

export async function claimRandomPoint() {
  try {
    const res = await api.post("/points/events/random", null, { _auth: true });
    return { ok: true, data: res.data };
  } catch (err) {
    const errorResponse = err?.response;
    const headers = errorResponse?.headers || {};
    const body = errorResponse?.data || {};
    const meta = body?.meta || {};

    return {
      ok: false,
      status: errorResponse?.status ?? 0,
      code: body?.code,
      message:
        body?.message ??
        (errorResponse ? `HTTP ${errorResponse.status}` : "Network error"),
      retryAfterSeconds:
        Number(headers["retry-after"] ?? meta.retryAfterSeconds ?? 0) || 0,
      nextAllowedAt: meta?.nextAllowedAt ?? null,
      serverNow: meta?.serverNow ?? null,
    };
  }
}

export async function getRandomPointStatus() {
  try {
    const res = await api.get("/points/events/random/status", { _auth: true });
    return { ok: true, data: res.data };
  } catch (err) {
    const errorResponse = err?.response;
    return {
      ok: false,
      status: errorResponse?.status ?? 0,
      data: errorResponse?.data,
    };
  }
}