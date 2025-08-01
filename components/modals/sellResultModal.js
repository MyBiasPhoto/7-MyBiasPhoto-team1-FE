"use client";

import styles from "./sellResultModal.module.css";
import Image from "next/image";
import CloseIcon from "@/public/icons/ic_close.svg";
import Link from "next/link";

// 판매 등록 성공 기준
const checkSellConditions = ({ userCardCount, currentCardTotal }) => {
  const MAX_USER_MONTHLY_CREATION = 3;
  const MAX_CARD_SUPPLY = 10;

  const isUserExceeded = userCardCount >= MAX_USER_MONTHLY_CREATION;
  const isCardSupplyExceeded = currentCardTotal >= MAX_CARD_SUPPLY;

  return !(isUserExceeded || isCardSupplyExceeded);
};

const SellResultModal = ({
  userCardCount,
  currentCardTotal,
  cardGrade,
  cardTitle,
  onClose,
}) => {
  const isSuccess = checkSellConditions({ userCardCount, currentCardTotal });

  const cardInfoText = `[${cardGrade} | ${cardTitle}]`;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <Image src={CloseIcon} alt="Close" width={32} height={32} />
        </button>
        <h2 className={styles.title}>
          판매 등록{" "}
          <span className={isSuccess ? styles.successTxt : styles.failTxt}>
            {isSuccess ? "성공" : "실패"}
          </span>
        </h2>
        <p className={styles.description}>
          {isSuccess
            ? `${cardInfoText} 판매 등록에 성공했습니다!`
            : `${cardInfoText} 판매 등록에 실패했습니다.`}
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
};

export default SellResultModal;
