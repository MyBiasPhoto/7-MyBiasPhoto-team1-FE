import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true,
});

let isRefreshing = false;
let queue = [];
let hasRedirected = false;

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

function redirectToLoginOnce() {
  if (hasRedirected) return;
  hasRedirected = true;
  if (typeof window !== "undefined") {
    const path = window.location.pathname || "";
    if (!path.startsWith("/login")) {
      window.location.href = "/login?reason=expired";
    }
  }
}

api.interceptors.response.use(
  res => res,
  async error => {
    const { response, config } = error || {};
    if (!response) return Promise.reject(error);

    // //리프레시 무한 루프 방어
    if (config?.url?.endsWith("/auth/refresh")) {
      redirectToLoginOnce();
      return Promise.reject(error);
    }

    if (response.status === 401 && !config._retry) {
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
        redirectToLoginOnce();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
