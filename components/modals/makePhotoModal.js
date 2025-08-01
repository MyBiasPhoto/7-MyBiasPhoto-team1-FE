"use client";

import styles from "./makePhotoModal.module.css";
import Image from "next/image";
import CloseIcon from "@/public/icons/ic_close.svg";
import Link from "next/link";

// 생성 성공 기준
const checkMakeConditions = ({ userCardCount, currentCardTotal }) => {
  const MAX_USER_MONTHLY_CREATION = 3;
  const MAX_CARD_SUPPLY = 10;

  const isUserExceeded = userCardCount >= MAX_USER_MONTHLY_CREATION;
  const isCardSupplyExceeded = currentCardTotal >= MAX_CARD_SUPPLY;

  return !(isUserExceeded || isCardSupplyExceeded);
};

const MakePhotoModal = ({
  userCardCount,
  currentCardTotal,
  cardGrade,
  cardTitle,
  onClose,
}) => {
  const isSuccess = checkMakeConditions({ userCardCount, currentCardTotal });

  const cardInfoText = `[${cardGrade} | ${cardTitle}]`;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <Image src={CloseIcon} alt="Close" width={32} height={32} />
        </button>
        <h2 className={styles.title}>
          포토카드 생성{" "}
          <span className={isSuccess ? styles.successTxt : styles.failTxt}>
            {isSuccess ? "성공" : "실패"}
          </span>
        </h2>
        <p className={styles.description}>
          {isSuccess
            ? `${cardInfoText} 포토카드 생성에 성공했습니다!`
            : `${cardInfoText} 포토카드 생성에 실패했습니다.`}
        </p>
        <Link href="/myGallery" className={styles.confirmButton}>
          {isSuccess ? "마이갤러리에서 확인하기" : "마이갤러리로 돌아가기"}
        </Link>
      </div>
    </div>
  );
};

export default MakePhotoModal;
