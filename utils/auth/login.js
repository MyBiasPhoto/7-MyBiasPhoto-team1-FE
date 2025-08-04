import axios from "axios";

// 로그인 요청
export const login = async ({ email, password }) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    { email, password },
    { withCredentials: true } // 쿠기 받기
  );

  return response.data;
};
