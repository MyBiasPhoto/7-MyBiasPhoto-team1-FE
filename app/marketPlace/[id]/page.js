import BuyArea from "@/components/marketPlace/section/buy/buy.js";
import style from "./page.module.css";

export default function MarketPlaceById() {
  return (
    <div className={style.Container}>
      <BuyArea></BuyArea>
      <div>{/* 교환 희망 정보 */}</div>
      <div>{/* 내가 제시한 교환 목록 */}</div>
    </div>
  );
}
