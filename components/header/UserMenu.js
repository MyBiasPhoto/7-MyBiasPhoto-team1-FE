"use client";
import Link from "next/link";
import styles from "./UserMenu.module.css";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { useMeQuery } from "@/hooks/useMeQuery";
import ChargePointModal from "./ChargePointModal";
import RandomBox from "./RandomBox";

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

const COOLDOWN_SEC = 60;

export default function UserMenu() {
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
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

  return (
    <div className={styles.info}>
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
          onClick={() => setShowChargeModal(true)}
        >
          포인트 충전
        </button>
        <button
          className={`${styles.randomBtn} ${
            cooldown > 0 ? styles.cooldown : ""
          }`}
          onClick={() => setShowRandomModal(true)}
        >
          <span className={styles.btnText}>랜덤 포인트</span>
          <span className={styles.timeText}>
            {cooldown > 0 ? `${formatTime(cooldown)}` : ""}
          </span>
        </button>
      </div>
      <div className={styles.linkArea}>
        <Link className={styles.link} href="/marketPlace">
          마켓플레이스
        </Link>
        <Link className={styles.link} href="/myGallery">
          마이갤러리
        </Link>
        <Link className={styles.link} href="/mySale">
          판매 중인 포토카드
        </Link>
      </div>
      <Modal open={showRandomModal} onClose={() => setShowRandomModal(false)}>
        <RandomBox cooldown={cooldown} setCooldown={setCooldown} />
      </Modal>
      <Modal open={showChargeModal} onClose={() => setShowChargeModal(false)}>
        <ChargePointModal />
      </Modal>
    </div>
  );
}
