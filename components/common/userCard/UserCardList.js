import UserCardItem from "./UserCardItem.js";
import style from "./UserCardList.module.css";
export default function UserCardList({ cards }) {
  return (
    <div className={style.cardList}>
      {cards.map((card) => (
        <div className={style.cardItem} key={card.userCardId}>
          <UserCardItem card={card} />
        </div>
      ))}
    </div>
  );
}
