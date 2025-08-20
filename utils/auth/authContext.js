// utils/auth/authContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axiosAuth.js";
import { login as loginAPI, logout as logoutAPI } from "./login";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { requestCooldownSync } from "../cooldown/cooldownContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);
  const queryClient = useQueryClient();
  const pathname = usePathname();

  useEffect(() => {
    const PUBLIC = ["/login", "/signup"];
    if (PUBLIC.some((p) => pathname?.startsWith(p))) {
      setBootstrapped(true);
      return;
    }
    let mounted = true;
    api
      .get("/users/me", { _auth: true })
      .then((res) => {
        if (!mounted) return;
        const me = res.data?.me ?? null;
        setUser(me);
        if (me) requestCooldownSync();
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setBootstrapped(true);
      });
    return () => {
      mounted = false;
    };
  }, [pathname]);

  const login = async ({ email, password, strategy = "sliding" }) => {
    const user = await loginAPI({ email, password, strategy });
    setUser(user);
    requestCooldownSync();
    queryClient.invalidateQueries({ queryKey: ["me"] });
    return user;
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (err) {
      console.error("로그아웃 실패 :", err);
    }
    setUser(null);
    queryClient.removeQueries({ queryKey: ["me"] });
    requestCooldownSync();
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLogin: !!user, bootstrapped }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
