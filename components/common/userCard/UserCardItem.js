import placeholderImage from "@/public/assets/cardImage.png";
import logo from "@/public/assets/logo.svg";
import Image from "next/image";
import { useRef } from "react";
import Card from "@/components/marketPlace/card/card";
import style from "./UserCardItem.module.css";
/**
 * @typedef {Object} Card
 * @property {string} name
 * @property {string} genre
 * @property {string} grade
 * @property {string} owner
 * @property {string} imageUrl
 * @property {number} price
 */

/**
 * @param {{ card: Card, mode?: string }} props
 */
export default function UserCardItem({ card, mode }) {
  const cardRef = useRef(null);
  return (
    <div className={`${style.cardContainer}`} ref={cardRef}>
      {/*카드 이미지 */}
      <div className={style.contentContainer}>
        <div className={style.ImageContainer}>
          <Image
            src={card.imageUrl || placeholderImage}
            alt={card.name}
            className={style.responsiveImage}
            width={360}
            height={270}
          />
        </div>
        {/* 카드정보 */}
        {/* 카드 텍스트 정보 영역 */}
        <div className={style.infoBlock}>
          <p className={style.title}>{card.name || "제목"}</p>
          <div className={style.infoRow}>
            <div className={style.photoCardInformation}>
              <p
                className={`${style.cardGrade} ${
                  style[card.grade.toLowerCase()]
                }`}
              >
                {card.grade || "등급"}
              </p>
              <span className={style.divider}>|</span>
              <p className={style.genre}>{card.genre || "장르"}</p>
            </div>
            <p className={style.cardOwner}>
              {card.ownerNickName || "판매자 닉네임"}
            </p>
          </div>
        </div>
        {/* 가격및 수량 */}
        <div className={style.saleInformation}>
          <p className={style.InfoTextContainer}>
            가격
            <span>{card.price || "0"} P</span>
          </p>
          <p className={style.InfoTextContainer}>
            수량
            {/* userCard는 한장씩 백엔드에서 넘어옴으로 수량이 한장으로 고정 */}
            <span>1</span>
          </p>
        </div>
        {/* 로고 */}
        <div className={style.cardLogo}>
          <Image src={logo} height={100} width={120} alt={"임시"} />
        </div>
      </div>
    </div>

    // maketpalce꺼 연결하는 코드
    // <Card
    //   saleId={card.userCardId}
    //   name={card.name}
    //   grade={card.grade}
    //  card.owner={card.owner}
    //   genre={card.genre}
    //   quantity={card.quantity ?? 1}
    //   price={card.price ?? 0}
    //   imageUrl={card.imageUrl}
    //   initialQuantity={card.initialQuantity ?? 1}
    //   totalQuantity={card.totalQuantity}
    //   isMaster={true}
    // />
  );
}
