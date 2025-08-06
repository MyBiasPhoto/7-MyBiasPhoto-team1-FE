import style from "./tradeinfo.module.css";
export default function TradeInfo({ sale }) {
  return (
    <div className={style.Container}>
      <div className={style.title}>
        <p className={style.titleFont}>교환 희망 정보</p>
        <button className={style.titleButton}>포토카드 교환하기</button>
      </div>
      <div className={style.Content}>
        <p className={style.ContentFont}>{sale?.desiredDesc}</p>
        <div className={style.ContentTagBox}>
          {/* 태그들 */}
          <p>{sale?.desiredGrade}</p>
          <div className={style.Line}></div>
          <p className={style.Type}>{sale?.desiredGenre}</p>
        </div>
      </div>
    </div>
  );
}
