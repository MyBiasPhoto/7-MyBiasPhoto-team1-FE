import axios from "axios";

function normalizeBaseUrl(raw) {
  const env = (raw ?? "").trim();
  if (!env) return undefined;

  // 절대 URL인지 확인 (http/https로 시작)
  if (/^https?:\/\//i.test(env)) return env;

  // 혹시 '//'나 '/'로 시작하면 정리
  const cleaned = env.replace(/^\/+/, "");
  // 프로토콜 없으면 https 붙여주기
  return `https://${cleaned}`;
}

const baseURL =
  normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL) || "http://localhost:4000";

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  baseURL,
  withCredentials: true,
});

let isRefreshing = false;
let queue = [];

function resolveQueue(error, config) {
  queue.forEach(({ resolve, reject, req }) => {
    if (error) reject(error);
    else resolve(api(req));
  });
  queue = [];
}

async function refreshAccessToken() {
  return api.post("/auth/refresh");
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error || {};
    if (!response) return Promise.reject(error);

    // 리프레시 엔드포인트 자체 오류면 여기서 중단(무한 루프 방지)
    if (config?.url?.endsWith("/auth/refresh")) {
      return Promise.reject(error);
    }

    // 보호 API가 아니면 개입하지 않음
    if (response.status === 401 && config?._auth === true && !config._retry) {
      config._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject, req: config });
        });
      }

      isRefreshing = true;
      try {
        await refreshAccessToken();
        isRefreshing = false;
        resolveQueue(null, config);
        return api(config);
      } catch (e) {
        isRefreshing = false;
        resolveQueue(e);
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
