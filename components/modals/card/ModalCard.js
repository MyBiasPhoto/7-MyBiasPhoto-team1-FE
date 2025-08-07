import styles from "./ModalCard.module.css";
import cardImage from "../../../public/assets/cardImage.png";
import Image from "next/image";
import logo from "../../../public/assets/logo.svg";
import { useEffect, useRef } from "react";
import soldout from "../../../public/assets/soldout.svg";

export default function ModalCard({
  saleId,
  name,
  grade,
  sellerNickname,
  genre,
  quantity,
  price,
  imageUrl,
  initialQuantity,
}) {
  const cardRef = useRef(null);

  return (
    <div className={`${styles.cardContainer}`} ref={cardRef}>
      {/* ${style[grade]} ${style.glowEffect} */}
      <div className={styles.cardBox}>
        <div className={styles.cardImageBox}>
          {/* 이미지 */}
          {quantity == 0 && (
            <Image
              src={soldout}
              alt={"임시2"}
              className={`${styles.soldOutLayer} ${
                quantity === 0 ? styles.show : styles.hide
              }`}
            />
          )}
          <Image
            src={imageUrl || cardImage}
            alt={"임시"}
            fill
            className={styles.responsiveImage} // 스타일에서 object-fit 등 설정
          />
        </div>
        <div className={styles.CardTextBox}>
          {/* 카드정보들 */}
          <p className={styles.CardTextBoxTitle}>{name || "임시 제목."}</p>
          <div className={styles.CardSubTitle}>
            <div className={styles.CardSubTitleBox}>
              <p className={`${styles[grade]}`}>{grade || "임시등급."}</p>
              <div className={styles.subDiv}></div>
              <p>{genre || "임시종류."}</p>
            </div>
            <p className={styles.subTitleWriter}>
              {sellerNickname || "임시제작자."}
            </p>
          </div>
        </div>
        <div className={styles.CardTextBox}>
          {/* 가격및 수량 */}
          <div className={styles.CardSubTitle2}>
            <p>가격</p>
            <p>{price || "0"} P</p>
          </div>
          <div className={styles.CardSubTitle2}>
            <p>잔여</p>
            <p>
              {quantity || "0"} / {initialQuantity || "5"}
            </p>
          </div>
        </div>
        <div className={styles.cardLogo}>
          <Image src={logo} height={100} width={120} alt={"임시"} />
        </div>
      </div>
    </div>
  );
}
