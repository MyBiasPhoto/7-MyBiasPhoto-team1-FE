"use client";

import styles from "./exchangeCancelModal.module.css";
import Image from "next/image";
import CloseIcon from "@/public/icons/ic_close.svg";

export default function ExchangeCancelModal(props) {
  const { cardGrade, cardTitle, onClose, onConfirm, loading = false } = props;

  const hasInfo =
    typeof cardGrade === "string" && typeof cardTitle === "string";
  const cardInfoText = hasInfo
    ? "[" + cardGrade + " | " + cardTitle + "] "
    : "";

  function handleOverlayClick(e) {
    if (e.currentTarget === e.target && typeof onClose === "function") {
      onClose();
    }
  }

  function handleClose() {
    if (typeof onClose === "function") onClose();
  }

  function handleConfirm() {
    if (typeof onConfirm === "function") onConfirm();
  }

  function stopPropagation(e) {
    e.stopPropagation();
  }

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} onClick={stopPropagation}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="닫기"
        >
          <Image src={CloseIcon} alt="Close" width={32} height={32} />
        </button>
        <h2 className={styles.title}>교환 제시 취소</h2>
        <p className={styles.description}>
          {cardInfoText}교환 제시를 취소하시겠습니까?
        </p>
        <button
          type="button"
          className={styles.confirmButton}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "처리 중..." : "취소하기"}
        </button>
      </div>
    </div>
  );
}
