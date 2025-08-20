import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import cardImage from "../../../public/assets/cardImage.png";
import logo from "../../../public/assets/logo.svg";
import soldout from "../../../public/assets/soldout.svg";
import style from "./card.module.css";
import React, { memo } from "react";
function Card({
  saleId,
  name,
  grade,
  sellerNickname,
  genre,
  quantity,
  price,
  imageUrl,
  initialQuantity,
  isMaster,
  totalQuantity,
}) {
  const cardRef = useRef(null);

  // useEffect(() => {
  //   const cardElement = cardRef.current;
  //   if (!cardElement) return;

  //   const handleMouseMove = (e) => {
  //     const x = e.offsetX;
  //     const y = e.offsetY;
  //     const rotateY = (1 / -5) * x + 20;
  //     const rotateX = (4 / 30) * y - 20;

  //     cardElement.style.transform = `perspective(550px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  //   };

  //   const handleMouseLeave = () => {
  //     cardElement.style.transform = `perspective(550px) rotateY(0deg) rotateX(0deg)`;
  //   };

  //   cardElement.addEventListener("mousemove", handleMouseMove);
  //   cardElement.addEventListener("mouseleave", handleMouseLeave);

  //   return () => {
  //     cardElement.removeEventListener("mousemove", handleMouseMove);
  //     cardElement.removeEventListener("mouseleave", handleMouseLeave);
  //   };
  // }, []);

  const href = isMaster
    ? `/marketPlace/${saleId}/edit`
    : `/marketPlace/${saleId}`;
  return (
    <Link className={style.LinkBox} href={href}>
      <div
        className={` ${style.cardContainer} ${
          style[`glow-${grade.replace(/\s+/g, "_").toLowerCase()}`]
        }`}
        ref={cardRef}
      >
        {/* ${style[grade]} ${style.glowEffect} */}
        <div className={style.cardBox}>
          <div className={style.cardImageBox}>
            {/* 이미지 */}
            {quantity == 0 && (
              <Image
                src={soldout}
                alt={"임시2"}
                className={`${style.soldOutLayer} ${
                  quantity === 0 ? style.show : style.hide
                }`}
              />
            )}
            <Image
              src={imageUrl || cardImage}
              alt={name}
              fill
              className={style.responsiveImage} // 스타일에서 object-fit 등 설정
              loading="lazy"
              sizes="(max-width: 640px) 50vw,(max-width: 1024px) 33vw, 25vw"
            />
          </div>
          <div className={`${style.CardTextBox} ${style.CardTextBoxUpgrade}`}>
            {/* 카드정보들 */}
            <p className={style.CardTextBoxTitle}>{name || "제목"}</p>
            <div className={style.CardSubTitle}>
              <div className={style.CardSubTitleBox}>
                <p
                  className={`${
                    style[grade.replace(/\s+/g, "_").toUpperCase()]
                  }`}
                >
                  {grade || "등급"}
                </p>
                <div className={style.subdiv}></div>
                <p className={style.subTitleGenre}>{genre || "종류"}</p>
              </div>
              <p className={style.subTitleWriter}>
                {sellerNickname || "제작자"}
              </p>
            </div>
          </div>
          <div className={style.CardTextSubBox}>
            {/* 가격및 수량 */}
            <div className={style.CardSubTitle2}>
              <p className={style.cardFontColor}>가격</p>
              <p className={style.cardFontColorWhite}>{price || "0"} P</p>
            </div>
            <div className={style.CardSubTitle2}>
              <p className={style.cardFontColor}>잔여</p>
              <div className={`${style.priceBox} ${style.cardFontColor}`}>
                <p className={style.cardFontColor}>
                  <span className={style.cardFontColorWhite}>
                    {quantity || "0"}{" "}
                  </span>
                  / {initialQuantity || "5"}
                </p>
                {/* 이거토탈퀀티티로바꿔야됨 */}
              </div>
            </div>
          </div>
          <div className={style.cardLogo}>
            <Image src={logo} hegiht={18} width={120} alt={"로고"} />
          </div>
        </div>
        {/* <div className={style.cardBack}>
          <p>여기에 카드 뒷면 내용</p>
        </div> */}
      </div>
    </Link>
  );
}

export default memo(Card);
