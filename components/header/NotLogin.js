"use client";

import Link from "next/link";
import styles from "./NotLogin.module.css";
import { useEffect, useRef, useState } from "react";
import SideMenu from "./SideMenu";

export default function NotLogin({ onLogin }) {
  const [showInfo, setShowInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const infoBoxRef = useRef();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 743);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!showInfo) return;
    function handleClickOutside(e) {
      if (infoBoxRef.current && !infoBoxRef.current.contains(e.target)) {
        setShowInfo(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showInfo]);

  if (isMobile === null) return null;

  if (isMobile) {
    return (
      <div className={styles.mobileNav}>
        <div className={styles.mobileMenu} onClick={() => setShowInfo(true)} />
        <div className={styles.mobileLogo} />
        <Link className={styles.link} href="/login">
          로그인
        </Link>
        {showInfo && (
          <SideMenu
            open={true}
            onLogin={() => {
              onLogin();
              setShowInfo(false);
            }}
            onClose={() => setShowInfo(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.area}>
      <button className={styles.btn} type="button" onClick={onLogin}>
        　
      </button>
      <Link className={styles.link} href="/login">
        로그인
      </Link>
      <Link className={styles.link} href="/signup">
        회원가입
      </Link>
    </div>
  );
}
