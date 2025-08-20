"use client";

import styles from "./makePhotoModal.module.css";
import Image from "next/image";
import CloseIcon from "@/public/icons/ic_close.svg";
import Link from "next/link";

function checkMakeConditions({ userCardCount, currentCardTotal }) {
  const MAX_USER_MONTHLY_CREATION = 3;
  const MAX_CARD_SUPPLY = 10;

  const isUserExceeded = userCardCount >= MAX_USER_MONTHLY_CREATION;
  const isCardSupplyExceeded = currentCardTotal >= MAX_CARD_SUPPLY;

  return !(isUserExceeded || isCardSupplyExceeded);
}

export default function MakePhotoModal(props) {
  const {
    userCardCount,
    currentCardTotal,
    cardGrade,
    cardTitle,
    onClose,
    monthlyInfo,
  } = props;

  const isSuccess = checkMakeConditions({ userCardCount, currentCardTotal });
  const cardInfoText = `[${cardGrade} | ${cardTitle}]`;

  function renderMonthlyText() {
    if (!monthlyInfo || typeof monthlyInfo.created !== "number") return null;

    if (isSuccess) {
      return (
        <div
          style={{
            border: "none",
            background: "var(--black)",
            color: "var(--white)",
            padding: "14px 16px",
            textAlign: "center",
            lineHeight: 1.5,
            fontFamily: "Noto Sans KR",
            fontSize: "18px",
            fontWeight: "700",
          }}
        >
          {`이번 달 ${monthlyInfo.created}번째 생성 완료!\n\n(잔여량 ${monthlyInfo.remaining}/${monthlyInfo.limit})`}
        </div>
      );
    }

    if (!isSuccess && typeof monthlyInfo.remaining === "number") {
      return (
        <div
          style={{
            border: "none",
            background: "var(--black)",
            color: "var(--white)",
            padding: "12px 14px",
            textAlign: "center",
            lineHeight: 1.5,
            fontFamily: "Noto Sans KR",
            fontSize: "16px",
          }}
        >
          {monthlyInfo.remaining === 0
            ? `이번 달 생성 한도를 초과했습니다. (잔여량 ${monthlyInfo.remaining}/${monthlyInfo.limit})`
            : `생성 정보를 확인해 주세요. (잔여량 ${monthlyInfo.remaining}/${monthlyInfo.limit})`}
        </div>
      );
    }

    return null;
  }

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
        {renderMonthlyText()}
        <Link href="/myGallery" className={styles.confirmButton}>
          {isSuccess ? "마이갤러리에서 확인하기" : "마이갤러리로 돌아가기"}
        </Link>
      </div>
    </div>
  );
}
