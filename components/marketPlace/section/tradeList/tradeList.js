import style from "./tradeList.module.css";
import TradeCard from "../../tradeCard/tradeCard";
export default function TradeList() {
  return (
    <div>
      <div className={style.title}>
        <p>내가 제시한 교환 목록</p>
      </div>
      <div>{/* 카드리스트 */}</div>
    </div>
  );
}
