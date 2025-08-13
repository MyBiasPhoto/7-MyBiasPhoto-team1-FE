import style from "@/app/marketPlace/page.module.css";
import Card from "@/components/marketPlace/card/card";
import React, { memo } from "react";
// import { FixedSizeList } from "react-window";

function CardList({ cards, currentUserNickname, onCardClick }) {
  return (
    <div className={style.cardList}>
      {cards.map((card) => (
        <div
          key={card.saleId}
          className={style.cardItem}
          onClick={() => onCardClick(card)}
        >
          <Card
            {...card}
            isMaster={card.sellerNickname === currentUserNickname}
          />
        </div>
      ))}
    </div>
  );
}

export default memo(CardList);
