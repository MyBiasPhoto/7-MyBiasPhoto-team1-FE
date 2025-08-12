"use client";
import { useEffect } from "react";
import styles from "./Modal.module.css";

export default function Modal({ open, onClose, children }) {
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
        {children}
      </div>
    </div>
  );
}
