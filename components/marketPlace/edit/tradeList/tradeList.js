"use client";

import style from "./tradeList.module.css";
import EditTradeCard from "../card/card";
import { useState } from "react";
export default function EditTradeList({ sale }) {
  // const [trade, setTrade] = useState(sale?.proposals || []);

  const mockTrade = [
    {
      id: 1,
      image: null, // 실제 이미지 URL이 있으면 넣어줘
      title: "제주도 푸른 밤",
      grade: "COMMON",
      category: "자연",
      point: 3,
      writer: "홍길동",
      content: "이 포토카드랑 교환 원해요!",
    },
  ];
  const [trade, setTrade] = useState(mockTrade);
  
  const handleCancel = (id) => {
    setTrade((prev) => prev.filter((card) => card.id !== id));
  };
  return (
    <div>
      <div className={style.title}>
        <p>내가 제시한 교환 목록</p>
      </div>
      <div className={style.list}>
        {/* 카드리스트 */}
        {trade.map((card) => (
          <EditTradeCard
            key={card.id}
            {...card}
            onCancel={() => handleCancel(card.id)}
          />
        ))}
      </div>
    </div>
  );
}
