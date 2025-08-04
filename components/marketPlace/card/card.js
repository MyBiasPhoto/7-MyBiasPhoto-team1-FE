import style from "./card.module.css";
import cardImage from "../../../public/assets/cardImage.png";
import Image from "next/image";
import logo from "../../../public/assets/logo.svg";
import { useEffect, useRef } from "react";
import soldout from "../../../public/assets/soldout.svg";

export default function Card({ title, grade, writer, kind, amount, price }) {
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
  return (
    <div className={`${style.cardContainer}`} ref={cardRef}>
      {/* ${style[grade]} ${style.glowEffect} */}
      <div className={style.cardBox}>
        <div className={style.cardImageBox}>
          {/* 이미지 */}
          {amount == 0 && (
            <Image
              src={soldout}
              alt={"임시2"}
              className={`${style.soldOutLayer} ${
                amount === 0 ? style.show : style.hide
              }`}
            />
          )}
          <Image
            src={cardImage}
            alt={"임시"}
            className={style.responsiveImage} // 스타일에서 object-fit 등 설정
          />
        </div>
        <div className={style.CardTextBox}>
          {/* 카드정보들 */}
          <p className={style.CardTextBoxTitle}>{title || "임시 제목."}</p>
          <div className={style.CardSubTitle}>
            <div className={style.CardSubTitleBox}>
              <p className={`${style[grade]}`}>{grade || "임시등급."}</p>
              <div className={style.subdiv}></div>
              <p>{kind || "임시종류."}</p>
            </div>
            <p className={style.subTitleWriter}>{writer || "임시제작자."}</p>
          </div>
        </div>
        <div className={style.CardTextBox}>
          {/* 가격및 수량 */}
          <div className={style.CardSubTitle2}>
            <p>가격</p>
            <p>{price || "0"} P</p>
          </div>
          <div className={style.CardSubTitle2}>
            <p>잔여</p>
            <p>{amount || "0"} / 5</p>
          </div>
        </div>
        <div className={style.cardLogo}>
          <Image src={logo} hegiht={100} width={120} alt={"임시"} />
        </div>
      </div>
    </div>
  );
}
