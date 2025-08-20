"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosAuth.js";

export function useMeQuery(options = {}) {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/users/me", { _auth: true });
      return res.data.me ?? null;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    ...options,
  });
}
