"use client";

import styles from "./purchasePhotoModal.module.css";
import Image from "next/image";
import CloseIcon from "@/public/icons/ic_close.svg";

const PurchasePhotoModal = ({
  cardGrade,
  cardTitle,
  purchaseCount,
  onClose,
}) => {
  const cardInfoText = `[${cardGrade} | ${cardTitle}]`;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <Image src={CloseIcon} alt="Close" width={32} height={32} />
        </button>
        <h2 className={styles.title}>포토카드 구매</h2>
        <p className={styles.description}>
          {cardInfoText} {purchaseCount}장을 구매하시겠습니까?
        </p>
        <button className={styles.confirmButton}>구매하기</button>
      </div>
    </div>
  );
};

export default PurchasePhotoModal;
