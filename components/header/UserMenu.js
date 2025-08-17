"use client";

import { useMeQuery } from "@/hooks/useMeQuery";
import { useCooldown } from "@/utils/cooldown/cooldownContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import ChargePoint from "./ChargePoint";
import Modal from "./Modal";
import RandomBox from "./RandomBox";
import styles from "./UserMenu.module.css";
import { useAuth } from "@/utils/auth/authContext";
import { PulseLoader } from "react-spinners";

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function UserMenu() {
  const [mounted, setMounted] = useState(false);
  const [showRandom, setShowRandom] = useState(false);
  const [showCharge, setShowCharge] = useState(false);
  const { bootstrapped, isLogin } = useAuth();
  const { remaining: cooldown, ready } = useCooldown();
  const { data: me, isLoading: meLoading, refetch: refetchMe } = useMeQuery();
  const nickname = me?.nickname || "";
  const points = me?.points ?? 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const syncing = isLogin && bootstrapped && !ready;
  const isRandomUnavailable = syncing || cooldown > 0;

  return (
    <div className={styles.info}>
      <div className={styles.userBox}>
        <span className={styles.title}>
          안녕하세요,{" "}
          {nickname ? (
            nickname
          ) : (
            <PulseLoader color="#efff04" margin={2} size={10} />
          )}
          님!
        </span>
        <div className={styles.userPoint}>
          <span className={styles.text}>보유 포인트</span>
          <span className={styles.point}>
            {meLoading ? (
              <PulseLoader color="#efff04" margin={2} size={10} />
            ) : (
              `${points} P`
            )}
          </span>
        </div>
        <button className={styles.pointAdd} onClick={() => setShowCharge(true)}>
          포인트 충전
        </button>
        <button
          className={`${styles.randomBtn} ${
            isRandomUnavailable ? styles.cooldown : ""
          }`}
          onClick={() => setShowRandom(true)}
        >
          <span className={styles.btnText}>
            {syncing ? (
              <PulseLoader color="#efff04" margin={2} size={8} />
            ) : (
              "랜덤 포인트"
            )}
          </span>
          <span className={styles.timeText}>
            {cooldown > 0 ? formatTime(cooldown) : ""}
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
