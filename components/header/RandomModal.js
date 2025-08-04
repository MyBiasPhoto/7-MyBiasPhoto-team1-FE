"use client";
import { useEffect } from "react";
import styles from "./RandomModal.module.css";
import RandomBox from "./RandomBox";

export default function RandomModal({ open, onClose, cooldown, setCooldown }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.layout}>
      <div className={styles.area}>
        <div className={styles.btnArea}>
          <button className={styles.btn} onClick={onClose} />
        </div>
        <RandomBox cooldown={cooldown} setCooldown={setCooldown} />
      </div>
    </div>
  );
}
