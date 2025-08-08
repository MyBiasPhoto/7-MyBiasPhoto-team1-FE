"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./RandomBox.module.css";

const POINTS = [
  { value: 1, probability: 0.6 },
  { value: 5, probability: 0.3 },
  { value: 10, probability: 0.1 },
];

const BOX_IMAGES = [
  "/assets/box-left.svg",
  "/assets/box-center.svg",
  "/assets/box-right.svg",
];

function getRandomPoint() {
  const rand = Math.random();
  let acc = 0;
  for (const { value, probability } of POINTS) {
    acc += probability;
    if (rand < acc) return value;
  }
  return POINTS[0].value;
}

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

const COOLDOWN_SEC = 60;

export default function RandomBox({ cooldown, setCooldown }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState(null);

  const handleSelect = idx => {
    if (completed || cooldown > 0) return;
    setSelectedIdx(idx);
  };

  const handleComplete = () => {
    if (selectedIdx === null || cooldown > 0) return;
    const point = getRandomPoint();
    setResult(point);
    setCompleted(true);
    setCooldown(COOLDOWN_SEC);
    localStorage.setItem("randomPoint:lastTry", Date.now().toString());
  };

  const isButtonDisabled = cooldown > 0 || completed;

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
                선택완료
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
