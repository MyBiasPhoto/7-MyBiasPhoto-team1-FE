import style from "@/app/marketPlace/page.module.css";
import Card from "@/components/marketPlace/card/card";
import React, { memo } from "react";
// import { FixedSizeList } from "react-window";
import photo from "@/public/assets/logo.svg";
import Image from "next/image";

function CardList({ cards, currentUserNickname, onCardClick }) {
  if (!cards || cards.length === 0) {
    return (
      <div className={style.emptyMessageBox}>
        <p>그런 카드는 없어요!</p>
        <Image src={photo} alt={"로고"} width={300} height={200}></Image>
      </div>
    );
  }
  return (
    <div className={style.cardList}>
      {cards.map(card => (
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
