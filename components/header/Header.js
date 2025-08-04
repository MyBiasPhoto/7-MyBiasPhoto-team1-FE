"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import UserInfo from "./UserInfo";
import NotLogin from "./NotLogin";
import { useEffect, useState } from "react";
//zustand 쓸지말지
export default function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 743);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile === null) return null;

  return (
    <nav className={styles.area}>
      {isMobile ? (
        <>
          {!isLogin && <NotLogin onLogin={() => setIsLogin(true)} />}
          {isLogin && (
            <UserInfo isLogin={isLogin} onLogout={() => setIsLogin(false)} />
          )}
        </>
      ) : (
        <>
          <div className={styles.area}>
            <div className={styles.navbar}>
              <Link href="/" className={styles.logo} />
              {!isLogin && <NotLogin onLogin={() => setIsLogin(true)} />}
              {isLogin && (
                <UserInfo
                  isLogin={isLogin}
                  onLogout={() => setIsLogin(false)}
                />
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
