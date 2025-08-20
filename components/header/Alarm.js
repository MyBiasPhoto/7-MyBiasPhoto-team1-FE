// components/header/Alarm.js
"use client";
import styles from "./Alarm.module.css";
import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/utils/notifications/notificationsContext";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import AlarmSkeleton from "./AlarmSkeleton";

export default function Alarm() {
  const {
    notificationItems,
    hasMoreItems,
    loadMoreList,
    loadInitialList,
    markOneAsRead,
    markAllAsRead,
    isInitialLoading,
  } = useNotifications();

  const router = useRouter();
  const listRef = useRef(null); // 스크롤 되는 컨테이너
  const sentinelRef = useRef(null); // 바닥 감지용 센티넬
  //sentinel 보이면 loadMore호출

  // ✅ 최초 1회만 초기 목록 로드
  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    loadInitialList();
  }, [loadInitialList]);

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
    if (!sentinelRef.current || !listRef.current) return;
    const observer = new IntersectionObserver(handleIntersect, {
      root: listRef.current, // 🔹 내부 스크롤 컨테이너 기준
      rootMargin: "120px 0px 120px 0px", // 바닥 근처에서 미리 로드
      threshold: 0,
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

  // 🚀 처음 렌더 후 리스트 높이가 부족하면 즉시 1회 더 로드
  // useEffect(() => {
  //   const el = listRef.current;
  //   if (!el) return;
  //   if (el.scrollHeight <= el.clientHeight && hasMoreItems) {
  //     // 쿨다운 무시하고 한 번만 더
  //     loadMoreList({ force: true });
  //   }
  // }, [notificationItems, hasMoreItems, loadMoreList]);

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

      <div className={styles.alarmList} ref={listRef}>
        {/* {isInitialLoading && notificationItems.length === 0 && (
          <div className={styles.loading} aria-live="polite">
            알림을 불러오고 있습니다
          </div>
        )} */}

        {isInitialLoading && notificationItems.length === 0 && (
          <AlarmSkeleton rows={4} />
        )}

        {!isInitialLoading && notificationItems.length === 0 && (
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
              {formatTimeAgo(notification.createdAt)}
            </span>
          </button>
        ))}
        {hasMoreItems && <div ref={sentinelRef} className={styles.sentinel} />}
      </div>
    </div>
  );
}
