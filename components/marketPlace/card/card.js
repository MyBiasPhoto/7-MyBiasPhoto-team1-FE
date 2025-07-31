import style from "./card.module.css";
import cardImage from "../../../public/assets/cardImage.png";
import Image from "next/image";
import logo from "../../../public/assets/logo.svg";

export default function Card({ title, grade, writer, kind, amount, pirce }) {
  return (
    <div className={style.cardContainer}>
      <div className={style.cardBox}>
        <div className={style.cardImageBox}>
          {/* 이미지 */}
          <Image src={cardImage} hegiht={360} width={360} alt={"임시"} />
        </div>
        <div className={style.CardTextBox}>
          {/* 카드정보들 */}
          <p className={style.CardTextBoxTitle}>{title || "임시 제목."}</p>
          <div className={style.CardSubTitle}>
            <div className={style.CardSubTitleBox}>
              <p>{grade || "임시등급."}</p>
              <div className={style.subdiv}></div>
              <p>{kind || "임시종류."}</p>
            </div>
            <p>{writer || "임시제작자."}</p>
          </div>
        </div>
        <div className={style.CardTextBox}>
          {/* 가격및 수량 */}
          <div className={style.CardSubTitle2}>
            <p>가격</p>
            <p>{pirce || "0"} P</p>
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
