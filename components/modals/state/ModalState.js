"use client";

import styles from "./ModalState.module.css";
import Link from "next/link";

export default function ModalState(props) {
  const {
    status,
    error,
    onRetry,
    height = 300,
    loadingText = "포토카드 불러오는 중 ...",
    emptyText = "마이갤러리가 비어 있습니다!",
    errorText = "에러!",
    emptyActionText,
    emptyActionHref,
  } = props;

  if (status === "loading") {
    return (
      <div className={styles.wrap} style={{ height }} aria-live="polite">
        {loadingText}
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div
        className={`${styles.wrap} ${styles.column}`}
        style={{ height }}
        aria-live="polite"
      >
        <div className={styles.message}>{emptyText}</div>
        {emptyActionText && emptyActionHref ? (
          <Link href={emptyActionHref} className={styles.btn}>
            {emptyActionText}
          </Link>
        ) : null}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={`${styles.wrap} ${styles.column}`} style={{ height }}>
        <div aria-live="assertive">{errorText}</div>
        {typeof onRetry === "function" && (
          <button type="button" className={styles.btn} onClick={onRetry}>
            다시 시도
          </button>
        )}
      </div>
    );
  }

  return null;
}
