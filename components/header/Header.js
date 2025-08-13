// components/header/Header.js
"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import UserInfo from "./UserInfo";
import NotLogin from "./NotLogin";
import { useEffect, useState } from "react";
import { useAuth } from "@/utils/auth/authContext";
//zustand 쓸지말지
export default function Header() {
  const { user, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(!!user);
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 743);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile === null) return null;

  const handleLogin = () => {
    setIsLogin(true);
  };

  return (
    <nav className={styles.area}>
      {isMobile ? (
        <>
          {!user && <NotLogin />}
          {user && <UserInfo isLogin={!!user} onLogout={logout} />}
        </>
      ) : (
        <>
          <div className={styles.area}>
            <div className={styles.navbar}>
              <Link href="/" className={styles.logo} />
              {!user && <NotLogin />}
              {user && <UserInfo isLogin={!!user} onLogout={logout} />}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
