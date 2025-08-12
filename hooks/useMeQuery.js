"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosAuth.js";

export function useMeQuery(options = {}) {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data.me ?? null;
    },
    refetchOnWindowFocus: true,
    ...options,
  });
}
