import style from "./editTrade.module.css";
import icon from "@/public/icons/ic_exchange.svg";
import Image from "next/image";

export default function EditTradeInfo({ sale }) {
  return (
    <div className={style.Container}>
      <div className={style.title}>
        <Image src={icon} height={28} width={28} alt={"아이콘"} />
        <p className={style.titleFont}>교환 희망 정보</p>
      </div>
      <div className={style.Content}>
        <div className={style.ContentTagBox}>
          {/* 태그들 */}
          <p className={`${style[sale?.desiredGrade.toLowerCase()]}`}>
            {sale?.desiredGrade}
          </p>
          <div className={style.Line}></div>
          <p className={style.Type}>{sale?.desiredGenre}</p>
        </div>
        <p className={style.ContentFont}>{sale?.desiredDesc}</p>
      </div>
    </div>
  );
}
