"use client";

import styles from "./exchangeApproveModal.module.css";
import Image from "next/image";
import CloseIcon from "@/public/icons/ic_close.svg";

export default function ExchangeApproveModal(props) {
  const { onClose, onConfirm, loading = false, cardTitle, cardGrade } = props;

  function handleOverlayClick(e) {
    if (e.currentTarget === e.target && typeof onClose === "function")
      onClose();
  }
  function handleClose() {
    if (typeof onClose === "function") onClose();
  }
  function handleConfirm() {
    if (typeof onConfirm === "function") onConfirm();
  }
  function stop(e) {
    e.stopPropagation();
  }

  const info =
    cardGrade && cardTitle ? "[" + cardGrade + " | " + cardTitle + "] " : "";

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} onClick={stop}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="닫기"
        >
          <Image src={CloseIcon} alt="close" width={32} height={32} />
        </button>
        <h2 className={styles.title}>교환 제시 승인</h2>
        <p className={styles.description}>
          {info}교환 제시를 승인하시겠습니까?
        </p>
        <button
          type="button"
          className={styles.confirmButton}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "처리 중..." : "승인하기"}
        </button>
      </div>
    </div>
  );
}
