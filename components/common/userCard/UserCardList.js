import Image from "next/image.js";
import UserCardItem from "./UserCardItem.js";
import style from "./UserCardList.module.css";
import logo from "@/public/assets/logo.svg";

export default function UserCardList({ cards = [] }) {
  if (!cards.length) {
    return (
      <div className={style.empty}>
        <p>그런 카드는 없어요!</p>
        <Image src={logo} width={300} height={200} alt={"로고"} />
      </div>
    );
  }

  return (
    <div role="list" className={style.cardList}>
      {cards.map(card => (
        <div role="listitem" className={style.cardItem} key={card.userCardId}>
          <UserCardItem card={card} />
        </div>
      ))}
    </div>
  );
}
