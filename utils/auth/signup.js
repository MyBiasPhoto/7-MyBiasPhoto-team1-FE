import api from "../../lib/axiosAuth.js";

export const signup = async ({
  email,
  password,
  confirmPassword,
  nickname,
}) => {
  const response = await api.post("/auth/signup", {
    email,
    password,
    confirmPassword,
    nickname,
  });

  return response.data;
};
