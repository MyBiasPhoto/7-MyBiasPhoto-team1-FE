// components/header/AlarmSkeleton.js
"use client";
import styles from "./Alarm.module.css";

export default function AlarmSkeleton({ rows = 4 }) {
  return (
    <ul
      className={styles.skeletonList}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="알림을 불러오는 중"
    >
      <span className={styles.srOnly}>알림을 불러오고 있어요…</span>
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className={styles.skeletonItem}>
          <div className={styles.skeletonTop}>
            <div className={`${styles.skeletonBar} ${styles.skeletonLineLong}`} />
            <div className={`${styles.skeletonBar} ${styles.skeletonLineMid}`} />
          </div>
          <div className={`${styles.skeletonBar} ${styles.skeletonLineShort}`} />
        </li>
      ))}
    </ul>
  );
}
