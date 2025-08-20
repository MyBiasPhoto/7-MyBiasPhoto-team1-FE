// components/header/SideAlarm.js
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import styles from "./SideAlarm.module.css";
import { useNotifications } from "@/utils/notifications/notificationsContext";
import { formatTimeAgo } from "@/utils/formatTimeAgo";

export default function SideAlarm({ open, onClose }) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // 🔔 알림 데이터 훅 (컨텍스트 그대로 재사용)
  const {
    notificationItems,
    hasMoreItems,
    loadMoreList,
    markOneAsRead,
    isInitialLoading,
    markAllAsRead,
    unreadCount,
  } = useNotifications();

  const listRef = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // 바디 스크롤 락
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  // 무한 스크롤
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
    if (!open) return;
    if (!sentinelRef.current || !listRef.current) return;
    const observer = new IntersectionObserver(handleIntersect, {
      root: listRef.current,
      rootMargin: "120px 0px 120px 0px",
      threshold: 0,
    });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [open, handleIntersect]);

  // 클릭 시 읽음 처리 + 이동
  const handleClickNotification = async (notification) => {
    try {
      await markOneAsRead(notification.id);
    } finally {
      const fallbackRoute =
      //@TODO 교환했을때는 어디로 갈까
        notification.type === "CARD_PURCHASED" ||
        notification.type === "CARD_SOLD_OUT"
          ? "/myGallery"
          : "/";
      const destination = notification.link || fallbackRoute;
      router.push(destination);
      onClose?.();
    }
  };

  if (!open || !mounted) return null;

  const handleMarkAll = async () => {
    if (unreadCount > 0) {
      await markAllAsRead();
    }
  };

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.area}>
        <div className={styles.titleArea}>
          <div className={styles.closeBtn} onClick={onClose} />
          <div className={styles.title}>알림</div>
          <button
            type="button"
            className={styles.markAllBtn}
            onClick={handleMarkAll}
            disabled={unreadCount === 0}
          >
            모두 읽음
          </button>
        </div>

        <div className={styles.alarmList} ref={listRef}>
          {/* 로딩 스켈레톤 */}
          {isInitialLoading && notificationItems.length === 0 && (
            <ul
              className={styles.skeletonList}
              role="status"
              aria-live="polite"
              aria-busy="true"
              aria-label="알림을 불러오는 중"
            >
              <span className={styles.srOnly}>알림을 불러오고 있어요…</span>
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className={styles.skeletonItem}>
                  <div className={styles.skeletonTop}>
                    <div
                      className={`${styles.skeletonBar} ${styles.skeletonLineLong}`}
                    />
                    <div
                      className={`${styles.skeletonBar} ${styles.skeletonLineMid}`}
                    />
                  </div>
                  <div
                    className={`${styles.skeletonBar} ${styles.skeletonLineShort}`}
                  />
                </li>
              ))}
            </ul>
          )}

          {/* 실제 목록 */}
          {!isInitialLoading && notificationItems.length === 0 && (
            <div className={styles.empty}>새 알림이 없어요</div>
          )}

          {notificationItems.map((n) => (
            <div
              key={n.id}
              className={`${styles.list} ${n.read ? "" : styles.unread}`}
              onClick={() => handleClickNotification(n)}
              role="button"
              tabIndex={0}
            >
              <span className={styles.text}>{n.content}</span>
              <span className={styles.time}>{formatTimeAgo(n.createdAt)}</span>
            </div>
          ))}

          {hasMoreItems && (
            <div ref={sentinelRef} className={styles.sentinel} />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import styles from "./SideAlarm.module.css";

// export default function SideAlarm({ open, onClose }) {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (open) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [open]);

//   if (!open || !mounted) return null;

//   return createPortal(
//     <div className={styles.overlay}>
//       <div className={styles.area}>
//         <div className={styles.titleArea}>
//           <div className={styles.closeBtn} onClick={onClose} />
//           <div className={styles.title}>알림</div>
//           <div className={styles.box} />
//         </div>
//         <div className={styles.alarmList}>
//           <div className={styles.list}>
//             <span className={styles.text}>테스트용 알림메시지입니다</span>
//             <span className={styles.time}>1시간 전</span>
//           </div>
//           <div className={styles.list}>
//             <span className={styles.text}>테스트용 알림메시지입니다</span>
//             <span className={styles.time}>1시간 전</span>
//           </div>
//           <div className={styles.list}>
//             <span className={styles.text}>테스트용 알림메시지입니다</span>
//             <span className={styles.time}>1시간 전</span>
//           </div>
//           <div className={styles.list}>
//             <span className={styles.text}>테스트용 알림메시지입니다</span>
//             <span className={styles.time}>1시간 전</span>
//           </div>
//           <div className={styles.list}>
//             <span className={styles.text}>테스트용 알림메시지입니다</span>
//             <span className={styles.time}>1시간 전</span>
//           </div>
//           <div className={styles.list}>
//             <span className={styles.text}>테스트용 알림메시지입니다</span>
//             <span className={styles.time}>1시간 전</span>
//           </div>
//           <div className={styles.list}>
//             <span className={styles.text}>테스트용 알림메시지입니다</span>
//             <span className={styles.time}>1시간 전</span>
//           </div>
//           <div className={styles.list}>
//             <span className={styles.text}>테스트용 알림메시지입니다</span>
//             <span className={styles.time}>1시간 전</span>
//           </div>
//           <div className={styles.list}>
//             <span className={styles.text}>테스트용 알림메시지입니다</span>
//             <span className={styles.time}>1시간 전</span>
//           </div>
//           <div className={styles.list}>
//             <span className={styles.text}>테스트용 알림메시지입니다</span>
//             <span className={styles.time}>1시간 전</span>
//           </div>
//           <div className={styles.list}>
//             <span className={styles.text}>테스트용 알림메시지입니다</span>
//             <span className={styles.time}>1시간 전</span>
//           </div>
//           <div className={styles.list}>
//             <span className={styles.text}>테스트용 알림메시지입니다</span>
//             <span className={styles.time}>1시간 전</span>
//           </div>
//         </div>
//       </div>
//     </div>,
//     document.body
//   );
// }
