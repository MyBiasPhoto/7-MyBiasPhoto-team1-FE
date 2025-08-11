"use client";

import { useState } from "react";
import { buySale } from "@/utils/api/sales";
import PurchaseResultModal from "./purchaseResultModal";
import styles from "./purchasePhotoModal.module.css";
import Image from "next/image";
import CloseIcon from "@/public/icons/ic_close.svg";

export default function PurchasePhotoModal({
  saleId,
  cardGrade,
  cardTitle,
  purchaseCount = 1,
  cardPrice,
  userPoint,
  onClose,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultSuccess, setResultSuccess] = useState(null); // true/false
  const [resultMessage, setResultMessage] = useState("");

  const cardInfoText = `[${cardGrade} | ${cardTitle}]`;

  async function handlePurchase() {
    console.log("구매 버튼 클릭됨");
    console.log("전달될 saleId:", saleId);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/sales/${saleId}/buy`;
    console.log("구매 요청 URL:", url);

    if (!saleId) {
      setResultSuccess(false);
      setResultOpen(true);
      return;
    }

    try {
      await buySale(saleId, purchaseCount);
      setResultSuccess(true);
    } catch (err) {
      setResultSuccess(false);
    } finally {
      setResultOpen(true);
    }
  }

  function handleCloseResult() {
    setResultOpen(false);
    onClose && onClose();
  }

  return (
    <>
      {resultOpen ? (
        <PurchaseResultModal
          isSuccess={resultSuccess}
          resultMessage={resultMessage}
          userPoint={userPoint}
          cardPrice={cardPrice}
          purchaseCount={purchaseCount}
          cardGrade={cardGrade}
          cardTitle={cardTitle}
          onClose={handleCloseResult}
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
