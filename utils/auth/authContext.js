"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axiosAuth.js";
import { login as loginAPI, logout as logoutAPI } from "./login";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    let mounted = true;
    api
      .get("/me")
      .then(res => {
        if (!mounted) return;
        setUser(res.data?.me ?? null);
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
      })
      .finally(() => setBootstrapped(true));
    return () => {
      mounted = false;
    };
  }, []);

  const login = async ({ email, password, strategy = "sliding" }) => {
    const user = await loginAPI({ email, password, strategy });
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (err) {
      console.error("로그아웃 실패 :", err);
    }
    setUser(null);
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
