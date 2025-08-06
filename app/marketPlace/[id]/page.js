"use client";
import BuyArea from "@/components/marketPlace/section/buy/buy.js";
import style from "./page.module.css";
import Trade from "@/components/marketPlace/section/tradeinfo/tradeinfo.js";
import TradeList from "@/components/marketPlace/section/tradeList/tradeList";
import { fetchSaleById } from "@/utils/api/marketPlace";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function MarketPlaceById() {
  const { id } = useParams();

  const {
    data: sale,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["sale", id],
    queryFn: () => fetchSaleById(id),
    enabled: !!id,
  });

  // if (isLoading) return <div>로딩 중...</div>;
  // if (isError) return <div>에러: {error.message}</div>;
  return (
    <div className={style.Container}>
      <div className={style.Wrapper}>
        <BuyArea sale={sale} />
      </div>
      <div className={style.Wrapper}>
        <Trade sale={sale} />
      </div>
      <div className={style.Wrapper}>
        <TradeList sale={sale} />
      </div>
    </div>
  );
}
