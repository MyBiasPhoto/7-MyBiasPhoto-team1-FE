"use client";

import Link from "next/link";
import styles from "./SideMenu.module.css";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMeQuery } from "@/hooks/useMeQuery";
import Modal from "./Modal";
import RandomBox from "./RandomBox";
import ChargePoint from "./ChargePoint";

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

const COOLDOWN_SEC = 60;

export default function SideMenu({
  open,
  onLogin,
  isLogin,
  onClose,
  onLogout,
}) {
  const [mounted, setMounted] = useState(false);
  const [showRandom, setShowRandom] = useState(false);
  const [showCharge, setShowCharge] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef(null);
  const { data: me, isLoading: meLoading } = useMeQuery();
  const nickname = me?.nickname || "";
  const points = me?.points ?? 0;
  useEffect(() => {
    const lastTry = localStorage.getItem("randomPoint:lastTry");
    if (lastTry) {
      const elapsed = Math.floor((Date.now() - Number(lastTry)) / 1000);
      if (elapsed < COOLDOWN_SEC) setCooldown(COOLDOWN_SEC - elapsed);
    }
  }, []);

  useEffect(() => {
    if (cooldown === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (cooldown > 0 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current && cooldown === 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [cooldown]);

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
              <span className={styles.title}>
                안녕하세요, {nickname || "사용자 이름"}님!
              </span>
              <div className={styles.userPoint}>
                <span className={styles.text}>보유 포인트</span>
                <span className={styles.point}>
                  {meLoading ? "..." : `${points} P`}
                </span>
              </div>
              <button
                className={styles.pointAdd}
                onClick={() => setShowCharge(true)}
              >
                포인트 충전
              </button>
              <button
                className={`${styles.randomBtn} ${
                  cooldown > 0 ? styles.cooldown : ""
                }`}
                onClick={() => setShowRandom(true)}
              >
                <span className={styles.btnText}>랜덤 포인트</span>
                <span className={styles.timeText}>
                  {cooldown > 0 ? `${formatTime(cooldown)}` : ""}
                </span>
              </button>
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
            </div>
          </div>
        )}
        <Modal open={showRandom} onClose={() => setShowRandom(false)}>
          <RandomBox cooldown={cooldown} setCooldown={setCooldown} />
        </Modal>
        <Modal open={showCharge} onClose={() => setShowCharge(false)}>
          <ChargePoint />
        </Modal>
      </aside>
    </>,
    document.body
  );
}
