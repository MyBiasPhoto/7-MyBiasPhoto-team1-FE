"use client";

import { useState } from "react";
import PurchaseResultModal from "./purchaseResultModal";
import styles from "./purchasePhotoModal.module.css";
import Image from "next/image";
import CloseIcon from "@/public/icons/ic_close.svg";

export default function PurchasePhotoModal({
  saleId,
  cardGrade,
  cardTitle,
  purchaseCount,
  cardPrice,
  userPoint,
  onClose,
}) {
  const [showResult, setShowResult] = useState(false);

  const cardInfoText = `[${cardGrade} | ${cardTitle}]`;

  const handlePurchase = () => {
    setShowResult(true);
  };

  // 구매 api 적용 예시 코드, 추후 변경
  /*  const handlePurchase = async () => {
  try {
    const res = await fetch(`/sales/${saleId}/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ count: purchaseCount }),
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.message || '구매 실패');
  } catch (err) {
    console.error('구매 실패:', err);
  }
}; */

  return (
    <>
      {showResult ? (
        <PurchaseResultModal
          userPoint={userPoint}
          cardPrice={cardPrice}
          purchaseCount={purchaseCount}
          cardGrade={cardGrade}
          cardTitle={cardTitle}
          onClose={() => {
            setShowResult(false);
            onClose();
          }}
        />
      ) : (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={onClose}>
              <Image src={CloseIcon} alt="Close" width={32} height={32} />
            </button>
            <h2 className={styles.title}>포토카드 구매</h2>
            <p className={styles.description}>
              {cardInfoText} {purchaseCount}장을 구매하시겠습니까?
            </p>
            <button className={styles.confirmButton} onClick={handlePurchase}>
              구매하기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
