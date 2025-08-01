"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./SideAlarm.module.css";

export default function SideAlarm({ open, onClose }) {
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
    <div className={styles.overlay}>
      <div className={styles.area}>
        <div className={styles.titleArea}>
          <div className={styles.closeBtn} onClick={onClose} />
          <div className={styles.title}>알림</div>
          <div className={styles.box} />
        </div>
        <div className={styles.alarmList}>
          <div className={styles.list}>
            <span className={styles.text}>테스트용 알림메시지입니다</span>
            <span className={styles.time}>1시간 전</span>
          </div>
          <div className={styles.list}>
            <span className={styles.text}>테스트용 알림메시지입니다</span>
            <span className={styles.time}>1시간 전</span>
          </div>
          <div className={styles.list}>
            <span className={styles.text}>테스트용 알림메시지입니다</span>
            <span className={styles.time}>1시간 전</span>
          </div>
          <div className={styles.list}>
            <span className={styles.text}>테스트용 알림메시지입니다</span>
            <span className={styles.time}>1시간 전</span>
          </div>
          <div className={styles.list}>
            <span className={styles.text}>테스트용 알림메시지입니다</span>
            <span className={styles.time}>1시간 전</span>
          </div>
          <div className={styles.list}>
            <span className={styles.text}>테스트용 알림메시지입니다</span>
            <span className={styles.time}>1시간 전</span>
          </div>
          <div className={styles.list}>
            <span className={styles.text}>테스트용 알림메시지입니다</span>
            <span className={styles.time}>1시간 전</span>
          </div>
          <div className={styles.list}>
            <span className={styles.text}>테스트용 알림메시지입니다</span>
            <span className={styles.time}>1시간 전</span>
          </div>
          <div className={styles.list}>
            <span className={styles.text}>테스트용 알림메시지입니다</span>
            <span className={styles.time}>1시간 전</span>
          </div>
          <div className={styles.list}>
            <span className={styles.text}>테스트용 알림메시지입니다</span>
            <span className={styles.time}>1시간 전</span>
          </div>
          <div className={styles.list}>
            <span className={styles.text}>테스트용 알림메시지입니다</span>
            <span className={styles.time}>1시간 전</span>
          </div>
          <div className={styles.list}>
            <span className={styles.text}>테스트용 알림메시지입니다</span>
            <span className={styles.time}>1시간 전</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
