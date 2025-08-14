"use client";

import { useMeQuery } from "@/hooks/useMeQuery";
import { useCooldown } from "@/utils/cooldown/cooldownContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ChargePoint from "./ChargePoint";
import Modal from "./Modal";
import RandomBox from "./RandomBox";
import styles from "./SideMenu.module.css";

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

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
  const { remaining: cooldown, sync } = useCooldown();
  const { data: me, isLoading: meLoading, refetch: refetchMe } = useMeQuery();
  const nickname = me?.nickname || "";
  const points = me?.points ?? 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showRandom) sync();
  }, [showRandom, sync]);

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
          <RandomBox
            onSuccess={() => {
              refetchMe?.();
            }}
          />
        </Modal>
        <Modal open={showCharge} onClose={() => setShowCharge(false)}>
          <ChargePoint />
        </Modal>
      </aside>
    </>,
    document.body
  );
}
