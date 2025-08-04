"use client";
import style from "./tradeCard.module.css";
import Image from "next/image";
import defaultImg from "@/public/assets/cardImage.png";

export default function TradeCard() {
  return (
    <div className={style.Container}>
      <div className={style.ImageBox}>
        <Image src={defaultImg} width={440} height={240} alt="스페인 여행" />
      </div>
      <div className={style.Title}>
        <p className={style.titleFont}>스페인 여행</p>
        <div className={style.subTitleRow}>
          <div className={style.subTitleTags}>
            <p className={style.grade}>COMMON</p>
            <span className={style.divider}>|</span>
            <p className={style.category}>풍경</p>
            <span className={style.divider}>|</span>
            <p className={style.point}>
              <span className={style.bold}>4P</span> 에 구매
            </p>
          </div>
          <p className={style.writer}>유디</p>
        </div>
      </div>
      <div>
        <p className={style.content}>
          스페인 여행 사진도 좋은데.. 우리집 앞마당 포토카드와 교환하고
          싶습니다!
        </p>
      </div>
      <button className={style.closeButton}>취소하기</button>
    </div>
  );
}
