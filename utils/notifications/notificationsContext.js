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
const COOLDOWN_MS = 5000; // 🔒 5초
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

  // 중복 방지용: 이미 가진 알림 id집합 저장
  const knownIdsRef = useRef(new Set());

  // ✅ 중복 요청/스팸 방지용
  const lastFetchAtRef = useRef(0); // 마지막 호출 시각
  const inFlightRef = useRef(false); // 현재 요청 진행 중
  const initialLoadedRef = useRef(false); // ✅ 초기 1회 가드

  //현재 sse연결 해제 함수 저장
  const disconnectRef = useRef(null);

  // 🔄 SSE 수신 버퍼/타이머
  const bufferRef = useRef([]);
  const flushTimerRef = useRef(null);
  const FLUSH_MS = 5000; // 5초(3초 원하면 3000)

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

      //기존 sse연결 해제
      if (disconnectRef.current) {
        disconnectRef.current();
        disconnectRef.current = null;
      }

      // 🔄 정리
      bufferRef.current = [];
      if (flushTimerRef.current) {
        clearInterval(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      return;
    }

    //로그인 상태면 알림 초기 데이터 + sse연결
    let isActive = true;

    //앱을 초기상태로 세팅하는 함수
    const bootstrap = async () => {
      try {
        const initialUnread = await getUnreadCount();
        if (!isActive) return;
        setUnreadCount(initialUnread);
      } catch (e) {
        // 실패해도 sse연결 은 계속 시도
      }

      // SSE 연결
      if (disconnectRef.current) {
        disconnectRef.current();
        disconnectRef.current = null;
      }
      disconnectRef.current = openNotificationStream({
        lastEventId: lastDeliveredEventId ?? undefined, //마지막으로 받은 이벤트 id (backfill용)
        backfillLimit: 0, // 재전송 받을 최대 알림 개수
        onMessage: (payload, { event: serverEventType, id: serverEventId }) => {
          // 서버에서 내려준 알림 데이터 payload: { id, type, content, read, createdAt }
          const numericId = Number(payload?.id);
          // 이미 받은 알림이면 무시
          if (!numericId || knownIdsRef.current.has(numericId)) return;

          // //새 알림 id 저장
          // knownIdsRef.current.add(numericId);
          // //마지막으로 받은 이벤트 id 업데이트
          // setLastDeliveredEventId(Number(serverEventId) || numericId);

          // // 새 알림을 목록 맨 앞에 추가
          // setNotificationItems((prev) => [payload, ...prev]);
          // // 읽지 않은 알림이면 카운트 +1 (서버가 이미 read=false로 내려줌)
          // if (!payload.read) {
          //   setUnreadCount((prev) => prev + 1);
          // }

          // // 🔄 즉시 상태 반영 대신 버퍼에 쌓기
          // knownIdsRef.current.add(numericId);
          // // 마지막 이벤트 id는 바로 갱신
          // setLastDeliveredEventId(Number(serverEventId) || numericId);
          // bufferRef.current.push(payload);

          // 새 알림 id 기록
          knownIdsRef.current.add(numericId);
          // 마지막 이벤트 id는 즉시 갱신
          setLastDeliveredEventId(Number(serverEventId) || numericId);
          // 🔄 버퍼에만 쌓기
          bufferRef.current.push(payload);

          // 🔄 플러시 타이머 시작(이미 돌고 있으면 무시)
          if (!flushTimerRef.current) {
            flushTimerRef.current = setInterval(() => {
              if (bufferRef.current.length === 0) return;
              const batch = bufferRef.current.splice(0); // 모두 꺼내기
              setNotificationItems((prev) => [...batch, ...prev]);
              // 읽지 않은 개수 일괄 반영
              const newlyUnread = batch.reduce(
                (acc, n) => acc + (n.read ? 0 : 1),
                0
              );
              if (newlyUnread > 0) setUnreadCount((prev) => prev + newlyUnread);
            }, FLUSH_MS);
          }
        },
        onError: () => {
          //sse 연결 끊김 -> setIsStreamConnected 상태 변경
          setIsStreamConnected(false);
          // 브라우저가 자동 재연결 시도
        },
      });
      setIsStreamConnected(true);

      //컴포넌트 언마운트 시 sse연결 해제
      return () => {
        if (disconnectRef.current) {
          disconnectRef.current();
          disconnectRef.current = null;
        }

        // 🔄 타이머 정리
        if (flushTimerRef.current) {
          clearInterval(flushTimerRef.current);
          flushTimerRef.current = null;
        }
        bufferRef.current = [];
      };
    };

    //초기 세팅
    bootstrap();

    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  // ---- 목록 로딩 ----
  const loadInitialList = async () => {
    // ✅ 이미 초기 로드한 경우 재호출 방지
    if (initialLoadedRef.current) return;
    // ✅ 쿨다운/중복요청 방지
    const now = Date.now();
    if (inFlightRef.current) return;
    if (now - lastFetchAtRef.current < COOLDOWN_MS) return;
    inFlightRef.current = true;

    const { items, nextCursor, hasMore } = await getNotifications({
      limit: 5,
    });
    // 중복 방지 집합 업데이트
    const newIds = new Set(knownIdsRef.current);
    items.forEach((n) => newIds.add(n.id));
    knownIdsRef.current = newIds;

    setNotificationItems(items);
    setNextCursorId(nextCursor);
    setHasMoreItems(hasMore);

    // ✅ 마킹
    initialLoadedRef.current = true;
    lastFetchAtRef.current = Date.now();
    inFlightRef.current = false;
  };

  // 추가로딩 페이지네이션
  // const loadMoreList = async () => {
  // if (!hasMoreItems || !nextCursorId) return;

  const loadMoreList = async ({ force = false } = {}) => {
    // nextCursorId가 0 또는 ""여도 허용하려면 == null 로 체크
    if (!hasMoreItems || nextCursorId == null) return;

    //쿨다운 & 중복요청 방지
    const now = Date.now();
    if (inFlightRef.current) return;
    if (!force && now - lastFetchAtRef.current < COOLDOWN_MS) return;
    inFlightRef.current = true;

    const { items, nextCursor, hasMore } = await getNotifications({
      limit: 5,
      cursor: nextCursorId,
    });

    // 중복 제거 후 기존 목록 뒤에 붙이기
    const deduped = items.filter((n) => !knownIdsRef.current.has(n.id));
    deduped.forEach((n) => knownIdsRef.current.add(n.id));

    setNotificationItems((prev) => [...prev, ...deduped]);
    setNextCursorId(nextCursor);
    setHasMoreItems(hasMore);

    // 🔒 마지막 호출 시각/플래그 업데이트
    lastFetchAtRef.current = Date.now();
    inFlightRef.current = false;
  };

  // ---- 특정 알림 읽음 처리 ----
  const markOneAsRead = async (notificationId) => {
    const { updated } = await markRead(notificationId);
    if (!updated) return;

    //해당 알림의 read상태 true로 변경
    setNotificationItems((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // 전체읽음 처리
  const markAllAsRead = async () => {
    const { updated } = await markAllRead({ unreadOnly: true });
    if (updated > 0) {
      //모든 알림 read = true 로 변경
      setNotificationItems((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  // ---- 배지 동기화 - 읽지 않은 개수 강제 새로고침 ----
  const refreshUnreadCount = async () => {
    const fresh = await getUnreadCount();
    setUnreadCount(fresh);
  };

  // Context로 전달할 값 메모이제이션
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

  // Provider로 감싸서 하위 컴포넌트에서 useNotifications로 접근 가능하게
  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  );
}

// Hook : NotificationContext를 안전하게 사용하기 위한 헬퍼
export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  return ctx;
}
