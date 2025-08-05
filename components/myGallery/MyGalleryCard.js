// components/myGallery/MyGalleryCard.js

import style from "./MyGalleryCard.module.css";
import placeholderImage from "@/public/assets/cardImage.png";
import Image from "next/image";
import logo from "@/public/assets/logo.svg";
import { useEffect, useRef } from "react";
import soldout from "@/public/assets/soldout.svg";

export default function MyGalleryCard({
  name,
  grade,
  sellerNickname,
  genre,
  quantity,
  price,
  imageUrl,
}) {
  const cardRef = useRef(null);
  return (
    <div className={`${style.cardContainer}`} ref={cardRef}>
      {/* ${style[grade]} ${style.glowEffect} */}
      <div className={style.cardBox}>
        <div className={style.cardImageBox}>
          {/* 이미지 */}
          {quantity == 0 && (
            <Image
              src={soldout}
              alt={"매진"}
              className={`${style.soldOutLayer} ${
                quantity === 0 ? style.show : style.hide
              }`}
            />
          )}
          <Image
            src={imageUrl || placeholderImage}
            alt={name}
            className={style.responsiveImage} // 스타일에서 object-fit 등 설정
            width={360}
            height={270}
          />
        </div>
        <div className={style.CardTextBox}>
          {/* 카드정보들 */}
          <p className={style.CardTextBoxTitle}>{name || "임시 제목."}</p>
          <div className={style.CardSubTitle}>
            <div className={style.CardSubTitleBox}>
              <p className={`${style[grade]}`}>{grade || "임시등급."}</p>
              <div className={style.subdiv}></div>
              <p>{genre || "임시w"}</p>
            </div>
            <p className={style.subTitleWriter}>
              {sellerNickname || "임시제작자."}
            </p>
          </div>
        </div>
        <div className={style.CardTextBox}>
          {/* 가격및 수량 */}
          <div className={style.CardSubTitle2}>
            <p>가격</p>
            <p>{price || "0"} P</p>
          </div>
          <div className={style.CardSubTitle2}>
            <p>수량</p>
            <p>{quantity || "0"}</p>
          </div>
        </div>
        <div className={style.cardLogo}>
          <Image src={logo} height={100} width={120} alt={"임시"} />
        </div>
      </div>
    </div>
  );
}
