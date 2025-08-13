// utils/notifications/notificationsContext.js
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getUnreadCount,
  getNotifications,
  markRead,
  markAllRead,
  openNotificationStream,
} from "@/utils/api/notification";
import { useAuth } from "@/utils/auth/authContext";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { isLogin } = useAuth();

  // ---- 상태 ----
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationItems, setNotificationItems] = useState([]);
  const [nextCursorId, setNextCursorId] = useState(null);
  const [hasMoreItems, setHasMoreItems] = useState(false);
  const [isStreamConnected, setIsStreamConnected] = useState(false);
  const [lastDeliveredEventId, setLastDeliveredEventId] = useState(null);

  // 중복 방지용: 이미 가진 알림 id 집합
  const knownIdsRef = useRef(new Set());
  const disconnectRef = useRef(null);

  // ---- 초기화 (로그인 시) ----
  useEffect(() => {
    if (!isLogin) {
      // 로그아웃 시 상태 초기화
      setUnreadCount(0);
      setNotificationItems([]);
      setNextCursorId(null);
      setHasMoreItems(false);
      setIsStreamConnected(false);
      setLastDeliveredEventId(null);
      knownIdsRef.current.clear();
      if (disconnectRef.current) {
        disconnectRef.current();
        disconnectRef.current = null;
      }
      return;
    }

    let isActive = true;

    const bootstrap = async () => {
      try {
        const initialUnread = await getUnreadCount();
        if (!isActive) return;
        setUnreadCount(initialUnread);
      } catch (e) {
        // 무시하고 다음 단계 진행
      }

      // SSE 연결
      if (disconnectRef.current) {
        disconnectRef.current();
        disconnectRef.current = null;
      }
      disconnectRef.current = openNotificationStream({
        lastEventId: lastDeliveredEventId ?? undefined,
        backfillLimit: 10,
        onMessage: (payload, { event: serverEventType, id: serverEventId }) => {
          // payload: { id, type, content, read, createdAt }
          const numericId = Number(payload?.id);
          if (!numericId || knownIdsRef.current.has(numericId)) return;

          knownIdsRef.current.add(numericId);
          setLastDeliveredEventId(Number(serverEventId) || numericId);

          // 새 알림을 목록 맨 앞에 추가
          setNotificationItems((prev) => [payload, ...prev]);
          // 읽지 않음 수 증분 (서버가 이미 read=false로 내려줌)
          if (!payload.read) {
            setUnreadCount((prev) => prev + 1);
          }
        },
        onError: () => {
          setIsStreamConnected(false);
          // 브라우저가 자동 재연결 시도
        },
      });
      setIsStreamConnected(true);

      return () => {
        if (disconnectRef.current) {
          disconnectRef.current();
          disconnectRef.current = null;
        }
      };
    };

    bootstrap();
    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  // ---- 목록 로딩 ----
  const loadInitialList = async () => {
    const { items, nextCursor, hasMore } = await getNotifications({
      limit: 10,
    });
    // 중복 방지 집합 업데이트
    const newIds = new Set(knownIdsRef.current);
    items.forEach((n) => newIds.add(n.id));
    knownIdsRef.current = newIds;

    setNotificationItems(items);
    setNextCursorId(nextCursor);
    setHasMoreItems(hasMore);
  };

  const loadMoreList = async () => {
    if (!hasMoreItems || !nextCursorId) return;
    const { items, nextCursor, hasMore } = await getNotifications({
      limit: 10,
      cursor: nextCursorId,
    });

    const deduped = items.filter((n) => !knownIdsRef.current.has(n.id));
    deduped.forEach((n) => knownIdsRef.current.add(n.id));

    setNotificationItems((prev) => [...prev, ...deduped]);
    setNextCursorId(nextCursor);
    setHasMoreItems(hasMore);
  };

  // ---- 읽음 처리 ----
  const markOneAsRead = async (notificationId) => {
    const { updated } = await markRead(notificationId);
    if (!updated) return;

    setNotificationItems((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    const { updated } = await markAllRead({ unreadOnly: true });
    if (updated > 0) {
      setNotificationItems((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  // ---- 배지 동기화 (원할 때 강제 새로고침) ----
  const refreshUnreadCount = async () => {
    const fresh = await getUnreadCount();
    setUnreadCount(fresh);
  };

  const contextValue = useMemo(
    () => ({
      // state
      unreadCount,
      notificationItems,
      nextCursorId,
      hasMoreItems,
      isStreamConnected,
      lastDeliveredEventId,
      // actions
      loadInitialList,
      loadMoreList,
      markOneAsRead,
      markAllAsRead,
      refreshUnreadCount,
    }),
    [
      unreadCount,
      notificationItems,
      nextCursorId,
      hasMoreItems,
      isStreamConnected,
      lastDeliveredEventId,
    ]
  );

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  return ctx;
}
