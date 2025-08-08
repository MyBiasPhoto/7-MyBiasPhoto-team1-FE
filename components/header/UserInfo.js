"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./UserInfo.module.css";
import Alarm from "./Alarm";
import UserMenu from "./UserMenu";
import SideMenu from "./SideMenu";
import Link from "next/link";
import SideAlarm from "./SideAlarm";
import { useAuth } from "@/utils/auth/authContext";

export default function UserInfo({ isLogin, onLogout }) {
  const [showInfo, setShowInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(null);
  const infoBoxRef = useRef();
  const { user } = useAuth();
  const { nickname = "" } = user || {};

  const handleAlarmClick = () =>
    setShowInfo(showInfo === "alarm" ? false : "alarm");
  const handleUserClick = () =>
    setShowInfo(showInfo === "user" ? false : "user");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 743);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  if (isMobile === null) return null;

  if (isMobile) {
    return (
      <div className={styles.mobileNav}>
        <div className={styles.mobileMenu} onClick={handleUserClick} />
        <Link href="/" className={styles.mobileLogo} />
        <div className={styles.mobileAlarm} onClick={handleAlarmClick} />
        {showInfo === "user" && (
          <SideMenu
            open={true}
            isLogin={isLogin}
            onClose={() => setShowInfo(false)}
            onLogout={onLogout}
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
        <span className={styles.point}>{user.points} P</span>
        <div className={styles.alarm} onClick={handleAlarmClick} />
        <span className={styles.name} onClick={handleUserClick}>
          {nickname || "사용자 이름"}
        </span>
        <div className={styles.bar} />
        <button type="button" onClick={onLogout} className={styles.logout}>
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
