"use client";

import style from "./tradeList.module.css";
import TradeCard from "../../tradeCard/tradeCard";
import { useState } from "react";
export default function TradeList() {
  const [trade, setTrade] = useState([
    {
      id: 1,
      image: "/assets/cardImage.png",
      title: "스페인 여행",
      grade: "COMMON",
      category: "풍경",
      point: 4,
      writer: "유디",
      content:
        "스페인 여행 사진도 좋은데.. 우리집 앞마당 포토카드와 교환하고 싶습니다!",
    },
    {
      id: 2,
      image: "/assets/cardImage.png",
      title: "벚꽃 사진",
      grade: "RARE",
      category: "자연",
      point: 6,
      writer: "홍길동",
      content: "벚꽃 필 무렵의 감성을 담았어요.",
    },
  ]);

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
          <TradeCard
            key={card.id}
            {...card}
            onCancel={() => handleCancel(card.id)}
          />
        ))}
      </div>
    </div>
  );
}
