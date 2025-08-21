// components/myGallery/MyGalleryCard.js

import style from "./MyGalleryCard.module.css";
import placeholderImage from "@/public/assets/cardImage.png";
import Image from "next/image";
import logo from "@/public/assets/logo.svg";
import { useEffect, useRef } from "react";
import soldout from "@/public/assets/soldout.svg";

export default function MyGalleryCard({
  photoCardId,
  name,
  grade,
  ownerNickName,
  genre,
  count,
  price,
  imageUrl,
}) {
  const cardRef = useRef(null);
  return (
    <div className={style.box}>
      <div className={`${style.cardContainer}`} ref={cardRef}>
        <div className={style.cardBox}>
          <div className={style.cardImageBox}>
            <Image
              src={imageUrl || placeholderImage}
              alt={name}
              className={style.responsiveImage} // 스타일에서 object-fit 등 설정
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
          <div className={style.CardTextBox}>
            {/* 카드정보들 */}
            <p className={style.CardTextBoxTitle}>{name || "제목"}</p>
            <div className={style.CardSubTitle}>
              <div className={style.CardSubTitleBox}>
                <p className={`${style[grade.replace(/\s+/g, "_")]}`}>
                  {grade || "등급"}
                </p>
                <div className={style.subdiv}></div>
                <p>{genre || "장르"}</p>
              </div>
              <p className={style.subTitleWriter}>
                {ownerNickName || "판매자 id"}
              </p>
            </div>
          </div>
          <div className={style.CardSubTextBox}>
            {/* 가격및 수량 */}
            <div className={style.CardSubTitle2}>
              <p>가격</p>
              <span className={style.span}>{price || "0"} P</span>
              {/* 가격 추가 예정 */}
            </div>
            <div className={style.CardSubTitle2}>
              <p>수량</p>
              <span className={style.span}>{count || 1}</span>
            </div>
          </div>
          <div className={style.cardLogo}>
            <Image src={logo} height={18} width={120} alt={"로고"} />
          </div>
        </div>
      </div>
    </div>
  );
}
