import style from "@/app/marketPlace/page.module.css";
import Card from "@/components/marketPlace/card/card";

export default function CardList({ cards, currentUserNickname, onCardClick }) {
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
