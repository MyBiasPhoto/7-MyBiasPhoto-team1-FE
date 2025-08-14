"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { getRandomPointStatus } from "../api/points";
import { useAuth } from "../auth/authContext";

const CooldownContext = createContext(null);

export function CooldownProvider({ children }) {
  const { isLogin, bootstrapped } = useAuth();
  const [expiresAt, setExpiresAt] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [ready, setReady] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      if (!expiresAt) {
        setRemaining(0);
        return;
      }
      const now = Date.now();
      const rem = Math.max(0, Math.ceil((expiresAt - now) / 1000));
      setRemaining(rem);
      if (rem === 0) {
        setExpiresAt(null);
      }
    };

    tick();
    if (!intervalRef.current) {
      intervalRef.current = setInterval(tick, 1000);
    }
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [expiresAt]);

  const sync = useCallback(async () => {
    if (!isLogin) {
      setExpiresAt(null);
      setRemaining(0);
      setReady(true);
      return { ok: true, data: { remainingSeconds: 0 } };
    }
    setReady(false);

    try {
      const response = await getRandomPointStatus();
      if (response.ok) {
        const { remainingSeconds, nextAllowedAt } = response.data;
        if (remainingSeconds > 0) {
          setExpiresAt(new Date(nextAllowedAt).getTime());
        } else {
          setExpiresAt(null);
        }
      }
      return response;
    } finally {
      setReady(true);
    }
  }, [isLogin]);

  useEffect(() => {
    if (!bootstrapped) return;
    sync();
  }, [bootstrapped, isLogin, sync]);

  const start = nextAllowedAt => {
    if (!nextAllowedAt) return;
    setExpiresAt(new Date(nextAllowedAt).getTime());
    setReady(true);
  };

  const startAfter = (retryAfterSeconds, serverNow) => {
    const base = serverNow ? new Date(serverNow).getTime() : Date.now();
    setExpiresAt(base + Math.max(0, retryAfterSeconds) * 1000);
    setReady(true);
  };

  const value = useMemo(
    () => ({ remaining, ready, sync, start, startAfter }),
    [remaining, ready, sync]
  );

  return (
    <CooldownContext.Provider value={value}>
      {children}
    </CooldownContext.Provider>
  );
}

export function requestCooldownSync() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cooldown:sync"));
  }
}

export function useCooldown() {
  const ctx = useContext(CooldownContext);
  if (!ctx)
    throw new Error("useCooldown은 CooldownProvider 내에서 사용해야 합니다.");
  return ctx;
}
