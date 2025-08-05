import style from "@/app/marketPlace/page.module.css";
import Card from "@/components/marketPlace/card/card";

export default function CardList({ cards }) {
  return (
    <div className={style.cardList}>
      {cards.map((card) => (
        <div key={card.saleId} className={style.cardItem}>
          <Card {...card} />
        </div>
      ))}
    </div>
  );
}
