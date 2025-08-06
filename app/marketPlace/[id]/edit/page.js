"use client";
import style from "./page.module.css";

import { fetchSaleById } from "@/utils/api/marketPlace";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import TradeList from "@/components/marketPlace/section/tradeList/tradeList";
import EditArea from "@/components/marketPlace/edit/section/edit";

export default function MarketPlaceEdit() {
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
  return (
    <div className={style.Container}>
      <div className={style.Wrapper}>
        <EditArea sale={sale} />
      </div>
      <div className={style.Wrapper}>
        <TradeList sale={sale} />
      </div>
    </div>
  );
}
//TODO : TradeList도 알맞게 수정할 예정 지금 임시로 넣어둠
