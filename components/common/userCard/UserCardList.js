import UserCardItem from "./UserCardItem.js";
import style from "./UserCardList.module.css";

export default function UserCardList({ cards = [] }) {
  if (!cards.length) {
    return <div className={style.empty}>표시할 포토카드가 없어요.</div>;
  }

  return (
    <div role="list" className={style.cardList}>
      {cards.map((card) => (
        <div role="listitem" className={style.cardItem} key={card.userCardId}>
          <UserCardItem card={card} />
        </div>
      ))}
    </div>
  );
}
