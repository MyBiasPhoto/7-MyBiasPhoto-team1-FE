import api from "./axios.js";

let isRefreshing = false;
let queue = [];

function flushQueue(error, config) {
  queue.forEach(({ resolve, reject, req }) => {
    if (error) reject(error);
    else resolve(aixos(req));
  });
  queue = [];
}

async function refreshAccessToken() {
  return api.post("/auth/refresh");
}

api.interceptors.response.use(
  res => res,
  async error => {
    const { response, config } = error || {};
    if (!response) return Promise.reject(error);

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
        flushQueue(null, config);
        return api(config);
      } catch (e) {
        isRefreshing = false;
        flushQueue(e);
        if (typeof window !== "undefined") {
          window.location.href = "/login?reason=expired";
        }
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
