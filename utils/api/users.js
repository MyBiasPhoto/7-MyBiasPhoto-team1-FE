import api from "@/lib/axiosAuth.js";

export const chargePoints = async amount => {
  const res = await api.post("/users/points/charge", { amount });
  return res.data;
};
