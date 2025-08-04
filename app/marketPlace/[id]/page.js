import BuyArea from "@/components/marketPlace/section/buy/buy.js";
import style from "./page.module.css";
import Trade from "@/components/marketPlace/section/tradeinfo/tradeinfo.js";
import TradeList from "@/components/marketPlace/section/tradeList/tradeList";

export default function MarketPlaceById() {
  return (
    <div className={style.Container}>
      <div className={style.Wrapper}>
        <BuyArea />
      </div>
      <div className={style.Wrapper}>
        <Trade />
      </div>
      <div className={style.Wrapper}>
        <TradeList />
      </div>
    </div>
  );
}
