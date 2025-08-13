"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./RandomBox.module.css";
import { claimRandomPoint } from "@/utils/api/points";

const BOX_IMAGES = [
  "/assets/box-left.svg",
  "/assets/box-center.svg",
  "/assets/box-right.svg",
];

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function RandomBox({
  cooldown,
  setCooldown,
  onNeedLogin,
  onSuccess,
}) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const isButtonDisabled = loading || cooldown > 0 || completed;

  const handleSelect = idx => {
    if (isButtonDisabled) return;
    setSelectedIdx(idx);
  };

  const setCooldownFromDates = (nextAllowedAt, serverNow) => {
    if (!nextAllowedAt) return;
    const base = serverNow ? new Date(serverNow) : new Date();
    const secs = Math.max(
      0,
      Math.ceil((new Date(nextAllowedAt).getTime() - base.getTime()) / 1000)
    );
    if (secs > 0) setCooldown(secs);
  };

  const handleComplete = async () => {
    if (selectedIdx === null || cooldown > 0 || loading) return;

    setLoading(true);
    try {
      const res = await claimRandomPoint();

      if (res.ok) {
        const { points, nextAllowedAt } = res.data;
        setResult(points);
        setCompleted(true);
        setCooldownFromDates(nextAllowedAt, null);
        onSuccess?.();
        return;
      }

      const {
        status,
        code,
        message,
        retryAfterSeconds,
        nextAllowedAt,
        serverNow,
      } = res;

      if (status === 401) {
        onNeedLogin?.();
        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
        return;
      }

      if (status === 429 && code === "EVENT_COOLDOWN_ACTIVE") {
        if (retryAfterSeconds && retryAfterSeconds > 0) {
          setCooldown(retryAfterSeconds);
        } else {
          setCooldownFromDates(nextAllowedAt, serverNow);
        }
        alert(message || "쿨다운이 진행 중입니다.");
        return;
      }

      if (status === 409 && code === "EVENT_CONCURRENCY_CONFLICT") {
        alert(message || "다른 요청이 먼저 처리되었습니다. 다시 시도하세요.");
        if (nextAllowedAt) setCooldownFromDates(nextAllowedAt, serverNow);
        return;
      }

      console.error({ status, code, message });
      alert(message || "요청 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {completed ? (
        <div className={styles.resultArea}>
          <span className={styles.random}>
            랜덤<span className={styles.point}>포인트</span>
          </span>
          <Image
            className={styles.pointImg}
            src={"/assets/point.svg"}
            alt={"포인트"}
            width={340}
            height={324}
            sizes="(max-width: 743px) 240px, 340px"
            priority
          />
          <span className={styles.resultText}>
            {result}P <span className={styles.subText}>획득!</span>
          </span>
          <div className={styles.timeArea}>
            <span className={styles.timeText}>다음 기회까지 남은 시간</span>
            <span className={styles.time}>{formatTime(cooldown)}</span>
          </div>
        </div>
      ) : (
        <div className={styles.area}>
          <div className={styles.titleBox}>
            <span className={styles.random}>
              랜덤<span className={styles.point}>포인트</span>
            </span>
            <span className={styles.text}>
              1시간마다 돌아오는 기회!
              <br />
              랜덤 상자 뽑 기를 통해 포인트를 획득하세요!
            </span>
            <div className={styles.timeArea}>
              <span className={styles.timeText}>다음 기회까지 남은 시간</span>
              <span className={styles.time}>{formatTime(cooldown)}</span>
            </div>
          </div>
          <div className={styles.btnArea}>
            {[0, 1, 2].map(idx => (
              <button
                className={[
                  styles.btn,
                  cooldown > 0 || (selectedIdx !== null && selectedIdx !== idx)
                    ? styles.inactive
                    : "",
                  isButtonDisabled ? styles.disabled : "",
                ].join(" ")}
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isButtonDisabled}
              >
                <Image
                  className={[
                    styles.boxImg,
                    cooldown > 0 ||
                    (selectedIdx !== null && selectedIdx !== idx)
                      ? styles.grayscale
                      : "",
                  ].join(" ")}
                  src={BOX_IMAGES[idx]}
                  alt={`뽑기 박스 ${idx + 1}`}
                  width={246}
                  height={191}
                  priority
                />
              </button>
            ))}
          </div>
          <div>
            {selectedIdx !== null && !completed && cooldown === 0 && (
              <button className={styles.selectBtn} onClick={handleComplete}>
                {loading ? "처리 중..." : "선택완료"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
