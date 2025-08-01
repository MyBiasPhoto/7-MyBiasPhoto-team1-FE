"use client";

import Link from "next/link";
import styles from "./SideMenu.module.css";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function SideMenu({
  open,
  onLogin,
  isLogin,
  onClose,
  onLogout,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  if (!open || !mounted) return null;

  return createPortal(
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.sidebar}>
        {isLogin ? (
          <div className={styles.area}>
            <div className={styles.userBox}>
              <span className={styles.title}>안녕하세요, 탕수육님!</span>
              <div className={styles.userPoint}>
                <span className={styles.text}>보유 포인트</span>
                <span className={styles.point}>20,000 P</span>
              </div>
            </div>
            <div className={styles.underArea}>
              <div className={styles.linkArea}>
                <Link href="/marketPlace" className={styles.link}>
                  마켓플레이스
                </Link>
                <Link href="/myGallery" className={styles.link}>
                  마이갤러리
                </Link>
                <Link href="/mySalePage" className={styles.link}>
                  판매 중인 포토카드
                </Link>
              </div>
              <button className={styles.logout} onClick={onLogout}>
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.loginArea}>
            <div className={styles.loginBox}>
              <Link href="/login" className={styles.userLink}>
                로그인
              </Link>
              <div className={styles.line} />
              <Link href="/signup" className={styles.userLink}>
                회원가입
              </Link>
            </div>
            <div className={styles.loginMenuLink}>
              <Link href="/marketPlace" className={styles.link}>
                마켓플레이스
              </Link>
              <button className={styles.testLogin} onClick={onLogin}>
                임시 로그인
              </button>
            </div>
          </div>
        )}
      </aside>
    </>,
    document.body
  );
}
