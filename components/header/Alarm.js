// components/header/Alarm.js
"use client";
import styles from "./Alarm.module.css";
import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/utils/notifications/notificationsContext";

export default function Alarm() {
  const {
    notificationItems,
    hasMoreItems,
    loadMoreList,
    markOneAsRead,
    markAllAsRead,
  } = useNotifications();

  const router = useRouter();
  const sentinelRef = useRef(null);
  //sentinel 보이면 loadMore호출

  const handleIntersect = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        loadMoreList();
      }
    },
    [loadMoreList]
  );

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "120px",
    });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [handleIntersect]);

  const handleClickNotification = async (notification) => {
    try {
      await markOneAsRead(notification.id);
    } finally {
      const fallbackRoute =
        notification.type === "CARD_PURCHASED" ||
        notification.type === "CARD_SOLD_OUT"
          ? "/myGallery" // 이 fallback은 혹시 link가 비어있을 때만 사용됨
          : "/";
      const destination = notification.link || fallbackRoute;
      router.push(destination);
    }
  };

  return (
    <div className={styles.area}>
      <div className={styles.headerRow}>
        <span className={styles.title}>알림</span>
        <button
          type="button"
          className={styles.markAllBtn}
          onClick={markAllAsRead}
        >
          모두 읽음
        </button>
      </div>

      <div className={styles.alarmList}>
        {notificationItems.length === 0 && (
          <div className={styles.empty}>새 알림이 없어요</div>
        )}
        {notificationItems.map((notification) => (
          <button
            key={notification.id}
            className={`${styles.list} ${
              notification.read ? "" : styles.unread
            }`}
            // onClick={() => markOneAsRead(notification.id)}
            onClick={() => handleClickNotification(notification)}
            type="button"
          >
            <span className={styles.text}>{notification.content}</span>
            <span className={styles.time}>
              {new Date(notification.createdAt).toLocaleString()}
              {/* @TODO 시간표시 ~시간전 코드잇요구사항대로 */}
            </span>
          </button>
        ))}
        {hasMoreItems && <div ref={sentinelRef} className={styles.sentinel} />}
      </div>
    </div>
  );
}
