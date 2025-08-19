"use client";

import styles from "./ModalState.module.css";

export default function ModalState(props) {
  const {
    status,
    error,
    onRetry,
    height = 240,
    loadingText = "포토 카드 불러오는 중...",
    emptyText = "마이 갤러리가 비어 있습니다!",
    errorText = "에러!",
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
      <div className={styles.wrap} style={{ height }} aria-live="polite">
        {emptyText}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={`${styles.wrap} ${styles.column}`} style={{ height }}>
        <div aria-live="assertive">{errorText}</div>
        {typeof onRetry === "function" && (
          <button type="button" className={styles.retryBtn} onClick={onRetry}>
            다시 시도
          </button>
        )}
      </div>
    );
  }

  return null;
}
