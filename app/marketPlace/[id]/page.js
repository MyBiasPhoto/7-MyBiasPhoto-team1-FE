import BuyArea from "@/components/marketPlace/section/buy/buy.js";
import style from "./page.module.css";
import Trade from "@/components/marketPlace/section/tradeinfo/tradeinfo.js";
import TradeList from "@/components/marketPlace/section/tradeList/tradeList";

export default function MarketPlaceById() {
  return (
    <div className={style.Container}>
      <BuyArea></BuyArea>
      <Trade></Trade>
      <TradeList></TradeList>
    </div>
  );
}
