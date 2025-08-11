"use client";

import styles from "./purchaseResultModal.module.css";
import Image from "next/image";
import CloseIcon from "@/public/icons/ic_close.svg";
import Link from "next/link";

// 구매 성공 조건
function checkPurchaseConditions({ userPoint, cardPrice, purchaseCount }) {
  return userPoint >= cardPrice * purchaseCount;
}

export default function PurchaseResultModal({
  userPoint,
  cardPrice,
  purchaseCount,
  cardGrade,
  cardTitle,
  onClose,
  isSuccess,
  resultMessage,
}) {
  const computedSuccess =
    typeof isSuccess === "boolean"
      ? isSuccess
      : checkPurchaseConditions({ userPoint, cardPrice, purchaseCount });

  const cardInfoText = `[${cardGrade} | ${cardTitle}]`;

  const titleText = computedSuccess ? "성공" : "실패";
  const bodyText = computedSuccess
    ? `${cardInfoText} ${purchaseCount}장 구매에 성공했습니다!`
    : `${cardInfoText} ${purchaseCount}장 구매에 실패했습니다.`;

  const linkHref = computedSuccess ? "/myGallery" : "/marketPlace";
  const linkLabel = computedSuccess
    ? "마이갤러리에서 확인하기"
    : "마켓플레이스로 돌아가기";

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <Image src={CloseIcon} alt="Close" width={32} height={32} />
        </button>
        <h2 className={styles.title}>
          구매{" "}
          <span
            className={computedSuccess ? styles.successTxt : styles.failTxt}
          >
            {titleText}
          </span>
        </h2>
        <p className={styles.description}>{bodyText}</p>
        <Link href={linkHref} className={styles.confirmButton}>
          {linkLabel}
        </Link>
      </div>
    </div>
  );
}
