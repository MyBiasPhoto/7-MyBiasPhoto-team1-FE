// components/header/UserInfo.js
"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./UserInfo.module.css";
import Alarm from "./Alarm";
import UserMenu from "./UserMenu";
import SideMenu from "./SideMenu";
import Link from "next/link";
import SideAlarm from "./SideAlarm";
import { useMeQuery } from "@/hooks/useMeQuery";
import { useNotifications } from "@/utils/notifications/notificationsContext";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PulseLoader } from "react-spinners";

export default function UserInfo({ onLogout }) {
  const [showInfo, setShowInfo] = useState(false);
  const isMobile = useIsMobile();
  const infoBoxRef = useRef();
  const { data: me, isLoading: meLoading } = useMeQuery();
  const nickname = me?.nickname || "";
  const points = me?.points ?? 0;
  const { unreadCount, loadInitialList } = useNotifications();
  const router = useRouter();

  const handleAlarmClick = () =>
    setShowInfo(showInfo === "alarm" ? false : "alarm");
  const handleUserClick = () =>
    setShowInfo(showInfo === "user" ? false : "user");

  const handleLogout = async () => {
    await onLogout();
    router.push("/");
  };

  useEffect(() => {
    if (!showInfo) return;
    function handleClickOutside(e) {
      if (infoBoxRef.current && !infoBoxRef.current.contains(e.target)) {
        setShowInfo(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showInfo]);

  //드롭다운을 alarm 으로 열때 최초목록 로드
  useEffect(() => {
    if (showInfo === "alarm") {
      loadInitialList();
    }
  }, [showInfo, loadInitialList]);

  if (isMobile === null) return null;

  if (isMobile) {
    return (
      <div className={styles.mobileNav}>
        <div className={styles.mobileMenu} onClick={handleUserClick} />
        <Link href="/marketPlace" className={styles.mobileLogo} />
        {/* <div className={styles.mobileAlarm} onClick={handleAlarmClick} /> */}
        <div className={styles.mobileAlarm} onClick={handleAlarmClick}>
          {unreadCount > 0 && <span className={styles.badgeDot} />}
        </div>
        {showInfo === "user" && (
          <SideMenu
            open={true}
            onClose={() => setShowInfo(false)}
            onLogout={handleLogout}
          />
        )}
        {showInfo === "alarm" && (
          <SideAlarm open={true} onClose={() => setShowInfo(false)} />
        )}
      </div>
    );
  }

  return (
    <div className={styles.position}>
      <div className={styles.area}>
        <span className={styles.point}>
          {meLoading ? (
            <PulseLoader color="#efff04" margin={3} size={8} />
          ) : (
            `${points} P`
          )}
        </span>
        {/* <div className={styles.alarm} onClick={handleAlarmClick} /> */}
        <div className={styles.alarm} onClick={handleAlarmClick}>
          {unreadCount > 0 && <span className={styles.badgeDot} />}
        </div>
        <span className={styles.name} onClick={handleUserClick}>
          {nickname ? (
            nickname
          ) : (
            <PulseLoader color="#efff04" margin={3} size={8} />
          )}
        </span>
        <div className={styles.bar} />
        <button type="button" onClick={handleLogout} className={styles.logout}>
          로그아웃
        </button>
      </div>
      {showInfo === "alarm" && (
        <div className={styles.alarmBox} ref={infoBoxRef}>
          <Alarm />
        </div>
      )}
      {showInfo === "user" && (
        <div className={styles.infoBox} ref={infoBoxRef}>
          <UserMenu />
        </div>
      )}
    </div>
  );
}
