// components/marketPlace/section/landing/skeleton/MarketPlaceCardSkeleton.js
import style from "@/components/marketPlace/skeleton/MarketPlaceCardSkeleton.module.css";

export default function MarketPlaceCardSkeleton({ count = 6 }) {
  return (
    <div className={style.cardList}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={style.cardItem}>
          <div className={style.image}></div>
          <div className={style.info}></div>
          <div className={style.title}></div>
          <div className={style.line}></div>
          <div className={style.line}></div>
          <div className={style.line}></div>
          <div className={style.info}></div>
          <div className={style.info}></div>
        </div>
      ))}
    </div>
  );
}
