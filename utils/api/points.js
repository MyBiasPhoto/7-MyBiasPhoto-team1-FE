import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true,
});

export async function claimRandomPoint() {
  try {
    const res = await api.post("/points/events/random");
    return { ok: true, data: res.data };
  } catch (err) {
    const errorResponse = err?.response;
    const headers = errorResponse?.headers || {};
    const body = errorResponse?.data || {};
    const meta = body?.meta || {};
    return {
      ok: false,
      status: errorResponse?.status,
      code: body?.code,
      message: body?.message,
      retryAfterSeconds:
        Number(headers["retry-after"] ?? meta.retryAfterSeconds ?? 0) || 0,
      nextAllowedAt: meta?.nextAllowedAt || null,
      serverNow: meta?.serverNow || null,
    };
  }
}

export async function getRandomPointStatus() {
  try {
    const res = await api.get("/points/events/random/status");
    return { ok: true, data: res.data };
  } catch (err) {
    const errorResponse = err?.response;
    return {
      ok: false,
      status: errorResponse?.status,
      data: errorResponse?.data,
    };
  }
}
