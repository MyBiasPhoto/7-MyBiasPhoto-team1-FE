import api from "@/lib/axiosAuth.js";

// 로그인 요청
export const login = async ({ email, password, strategy = "sliding" }) => {
  const response = await api.post(
    "/auth/login",
    { email, password },
    { headers: { "x-refresh-strategy": strategy } }
  );

  return response.data;
};

// 로그아웃 요청 함수
export const logout = async () => {
  await api.post("/auth/logout");
};
