// components/header/Header.js
"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useAuth } from "@/utils/auth/authContext";
import Link from "next/link";
import styles from "./Header.module.css";
import NotLogin from "./NotLogin";
import UserInfo from "./UserInfo";

export default function Header() {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  if (isMobile === null) return null;

  const logoHref = user ? "/marketPlace" : "/";

  return (
    <nav className={styles.area}>
      {isMobile ? (
        <>
          {!user && <NotLogin />}
          {user && <UserInfo onLogout={logout} />}
        </>
      ) : (
        <>
          <div className={styles.area}>
            <div className={styles.navbar}>
              <Link href={logoHref} className={styles.logo} />
              {!user ? <NotLogin /> : <UserInfo onLogout={logout} />}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
