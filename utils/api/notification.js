// utils/api/notifications.js
//https://www.youtube.com/watch?v=i4-MNzNML_c
//https://developer.mozilla.org/ko/docs/Web/API/Server-sent_events/Using_server-sent_events
import api from "@/lib/axiosAuth";
import { notificationType } from "../constants/enums";

/** 공통: undefined 제거 */
const cleanParams = (obj = {}) => {
  const out = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    out[k] = v;
  });
  return out;
};

/** 알림 목록 */
export async function getNotifications({
  limit = 5,
  cursor,
  unreadOnly,
  types,
} = {}) {
  const params = cleanParams({ limit, cursor, unreadOnly, types });
  const res = await api.get("/notifications", { params });
  // 서버 표준 응답: { success, data: { items, nextCursor, hasMore } }
  return res.data?.data ?? { items: [], nextCursor: null, hasMore: false };
}

/** 미확인 개수(배지) */
export async function getUnreadCount({ types } = {}) {
  const params = cleanParams({ types });
  const res = await api.get("/notifications/unread-count", { params });
  return res.data?.data?.count ?? 0;
}

/** 단건 읽음 처리 */
export async function markRead(id) {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data?.data ?? { updated: false };
}

/** 일괄 읽음 처리 */
export async function markAllRead({
  beforeId,
  beforeDate,
  types,
  unreadOnly = true,
} = {}) {
  const body = cleanParams({ beforeId, beforeDate, types, unreadOnly });
  const res = await api.patch("/notifications/read-all", body);
  return res.data?.data ?? { updated: 0 };
}

/**
 * SSE 연결
 *  - onMessage: (payload, { event, id, rawEvent }) => void
 *  - onError: (errorEvent) => void
 *  - 반환: () => void (해제 함수)
 */
export function openNotificationStream({
  lastEventId,
  backfillLimit = 10,
  types,
  onMessage,
  onError,
} = {}) {
  // 쿼리 문자열 구성
  const params = cleanParams({ lastEventId, backfillLimit, types });
  const qs = new URLSearchParams();

  Object.entries(params).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      // 서버 zod가 배열 허용하므로 동일 키 반복
      v.forEach((vv) => qs.append(k, vv));
    } else {
      qs.append(k, v);
    }
  });

  const url = `/notifications/stream${
    qs.toString() ? `?${qs.toString()}` : ""
  }`;

  // withCredentials 지원되는 브라우저 EventSource 옵션
  const es = new EventSource(url, { withCredentials: true });

  // 기본 message 이벤트 (event: 미지정일 때)
  es.addEventListener("message", (ev) => {
    try {
      const data = JSON.parse(ev.data);
      onMessage?.(data, { event: "message", id: ev.lastEventId, rawEvent: ev });
    } catch {
      // ignore parse error
    }
  });

  // 타입별 커스텀 이벤트 (서버가 event: CARD_PURCHASED 등으로 보냄)

  notificationType.forEach((evt) => {
    es.addEventListener(evt, (ev) => {
      try {
        const data = JSON.parse(ev.data);
        onMessage?.(data, { event: evt, id: ev.lastEventId, rawEvent: ev });
      } catch {
        // ignore parse error
      }
    });
  });

  es.addEventListener("error", (err) => {
    onError?.(err);
    // 기본적으로 브라우저가 자동 재연결 시도
  });

  // 해제 함수 반환
  return () => {
    try {
      es.close();
    } catch {}
  };
}
