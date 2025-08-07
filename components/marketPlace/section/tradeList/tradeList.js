"use client";

import style from "./tradeList.module.css";
import TradeCard from "../../tradeCard/tradeCard";
import { useState } from "react";
import Modal from "@/components/modals/exchangeCancelModal";

export default function TradeList({ sale }) {
  const [trade, setTrade] = useState(sale?.proposals || []);
  const [isModal, setIsModal] = useState(false);

  const handleCancel = (id) => {
    setTrade((prev) => prev.filter((card) => card.id !== id));
    setIsModal(true);
  };
  return (
    <div>
      <div className={style.title}>
        <p>내가 제시한 교환 목록</p>
      </div>
      <div className={style.list}>
        {/* 카드리스트 */}
        {trade.map((card) => (
          <TradeCard
            key={card.id}
            {...card}
            onCancel={() => handleCancel(card.id)}
          />
        ))}
      </div>
      {isModal && <Modal></Modal>}
    </div>
  );
}
