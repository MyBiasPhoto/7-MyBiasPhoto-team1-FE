// components/marketPlace/section/landing/skeleton/MarketPlaceCardSkeleton.js
import style from "@/components/marketPlace/skeleton/MarketPlaceCardSkeleton.module.css";

export default function MarketPlaceCardSkeleton({ count = 6 }) {
  return (
    <div className={style.cardList}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={style.cardContainer}>
          <div className={style.skeletonWrapper}>
            <div className={`${style.skeletonBox} ${style.large}`}></div>
            <div className={`${style.skeletonBox} ${style.medium}`}></div>
            <div className={style.subTitle}>
              <div className={style.subTitleBox}>
                <div className={`${style.skeletonBox} ${style.small}`}></div>
                <div className={`${style.skeletonBox} ${style.small}`}></div>
              </div>
              <div className={`${style.skeletonBox} ${style.small}`}></div>
            </div>
            <div className={`${style.skeletonBox} ${style.content}`}></div>
            <div className={`${style.skeletonBox} ${style.content}`}></div>
          </div>
        </div>
      ))}
    </div>
  );
}
