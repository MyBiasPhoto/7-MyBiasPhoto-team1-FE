import { useState } from "react";
import style from "./tradeinfo.module.css";
import ExchangePhotoModal from "@/components/modals/exchangePhotoModal.js";
export default function TradeInfo({ sale }) {
  const [isModal, setIsModal] = useState(false);

  const handleCancel = () => {
    setIsModal(false);
  };
  return (
    <div className={style.Container}>
      <div className={style.title}>
        <p className={style.titleFont}>교환 희망 정보</p>
        <button onClick={() => setIsModal(true)} className={style.titleButton}>
          포토카드 교환하기
        </button>
      </div>
      <div className={style.Content}>
        <p className={style.ContentFont}>{sale?.desiredDesc}</p>
        <div className={style.ContentTagBox}>
          {/* 태그들 */}
          <p className={`${style[sale?.desiredGrade.toLowerCase()]}`}>
            {sale?.desiredGrade}
          </p>
          <div className={style.Line}></div>
          <p className={style.Type}>{sale?.desiredGenre}</p>
        </div>
      </div>
      <button onClick={() => setIsModal(true)} className={style.MobileButton}>
        포토카드 교환하기
      </button>
      {isModal && <ExchangePhotoModal onClose={handleCancel} />}
    </div>
  );
}
