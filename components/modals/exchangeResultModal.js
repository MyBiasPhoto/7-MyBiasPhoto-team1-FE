"use client";

import styles from "./exchangeResultModal.module.css";
import Image from "next/image";
import CloseIcon from "@/public/icons/ic_close.svg";
import Link from "next/link";

// 교환 제시 성공 조건
function checkExchangeConditions({
  myCardGrade,
  myCardGenre,
  desiredGrade,
  desiredGenre,
}) {
  return myCardGrade === desiredGrade && myCardGenre === desiredGenre;
}

export default function ExchangeResultModal({
  myCardGrade,
  myCardGenre,
  desiredGrade,
  desiredGenre,
  onClose,
}) {
  const isSuccess = checkExchangeConditions({
    myCardGrade,
    myCardGenre,
    desiredGrade,
    desiredGenre,
  });

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <Image src={CloseIcon} alt="Close" width={32} height={32} />
        </button>

        <h2 className={styles.title}>
          교환 제시{" "}
          <span className={isSuccess ? styles.successTxt : styles.failTxt}>
            {isSuccess ? "성공" : "실패"}
          </span>
        </h2>

        <p className={styles.description}>
          {isSuccess
            ? "포토카드 교환 제시에 성공했습니다!"
            : "포토카드 교환 제시에 실패했습니다."}
        </p>

        <Link
          href={isSuccess ? "/mySalePage" : "/marketPlace"}
          className={styles.confirmButton}
        >
          {isSuccess
            ? "나의 판매 포토카드에서 확인하기"
            : "마켓플레이스로 돌아가기"}
        </Link>
      </div>
    </div>
  );
}
