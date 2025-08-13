"use client";

import Link from "next/link";
import styles from "./UserMenu.module.css";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { useMeQuery } from "@/hooks/useMeQuery";
import ChargePoint from "./ChargePoint";
import RandomBox from "./RandomBox";

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function UserMenu() {
  const [mounted, setMounted] = useState(false);
  const [showRandom, setShowRandom] = useState(false);
  const [showCharge, setShowCharge] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef(null);
  const { data: me, isLoading: meLoading, refetch: refetchMe } = useMeQuery();
  const nickname = me?.nickname || "";
  const points = me?.points ?? 0;

  useEffect(() => {
    setMounted(true);
    let alive = true;
    (async () => {
      const r = await getRandomPointStatus();
      if (alive && r.ok) {
        const { remainingSeconds } = r.data;
        if (remainingSeconds > 0) setCooldown(remainingSeconds);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (cooldown > 0 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setCooldown(s => Math.max(0, s - 1));
      }, 1000);
    }
    return () => {
      if (intervalRef.current && cooldown <= 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [cooldown]);

  if (!mounted) return null;

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
        <button className={styles.pointAdd} onClick={() => setShowCharge(true)}>
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
      <Modal open={showRandom} onClose={() => setShowRandom(false)}>
        <RandomBox
          cooldown={cooldown}
          setCooldown={setCooldown}
          onSuccess={() => {
            refetchMe?.();
          }}
        />
      </Modal>
      <Modal open={showCharge} onClose={() => setShowCharge(false)}>
        <ChargePoint onClose={() => setShowCharge(false)} />
      </Modal>
    </div>
  );
}
