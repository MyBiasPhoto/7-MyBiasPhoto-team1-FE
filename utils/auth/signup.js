import axios from "axios";

export const signup = async ({
  email,
  password,
  confirmPassword,
  nickname,
}) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
    { email, password, confirmPassword, nickname },
    { withCredentials: true }
  );

  return response.data;
};
