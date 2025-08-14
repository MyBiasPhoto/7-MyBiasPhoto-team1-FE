"use client";

import { useState } from "react";
import style from "./tradeinfo.module.css";
import ExchangePhotoModal from "@/components/modals/exchangePhotoModal.js";

export default function TradeInfo({ sale }) {
  const [isModal, setIsModal] = useState(false);

  function openModal() {
    setIsModal(true);
  }

  function closeModal() {
    setIsModal(false);
  }

  function handleProposalCreated(newProposal) {
    try {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("exchange:created", {
            detail: newProposal,
          })
        );
      }
    } catch (e) {
      console.warn("exchange:created 이벤트 발행 실패:", e);
    }
  }

  function getDesiredGradeKey() {
    if (sale && typeof sale.desiredGrade === "string") {
      return sale.desiredGrade.toLowerCase();
    }
    return "";
  }

  return (
    <div className={style.Container}>
      <div className={style.title}>
        <p className={style.titleFont}>교환 희망 정보</p>
        <button onClick={openModal} className={style.titleButton}>
          포토카드 교환하기
        </button>
      </div>
      <div className={style.Content}>
        <p className={style.ContentFont}>{sale?.desiredDesc}</p>
        <div className={style.ContentTagBox}>
          {/* 태그들 */}
          <p className={`${style[getDesiredGradeKey()] || ""}`}>
            {sale?.desiredGrade}
          </p>
          <div className={style.Line}></div>
          <p className={style.Type}>{sale?.desiredGenre}</p>
        </div>
      </div>
      <button onClick={openModal} className={style.MobileButton}>
        포토카드 교환하기
      </button>
      {isModal && (
        <ExchangePhotoModal
          saleId={sale?.id}
          onClose={closeModal}
          onSuccess={handleProposalCreated}
        />
      )}
    </div>
  );
}
