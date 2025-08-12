"use client";
import style from "./page.module.css";

import EditArea from "@/components/marketPlace/edit/section/edit";
import EditTradeList from "@/components/marketPlace/edit/tradeList/tradeList";
import { fetchSaleById } from "@/utils/api/marketPlace";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import logo from "../../../../public/assets/logo.svg";

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
  if (isLoading)
    return (
      <div className={style.isLoading}>
        <Image
          className={style.loadingLogo}
          src={logo}
          width={500}
          height={500}
          alt="로딩중..."
          loading="lazy"
        />
      </div>
    );
  if (isError) return <div>에러: {error.message}</div>;
  return (
    <div className={style.Container}>
      <div className={style.Wrapper}>
        <EditArea sale={sale} />
      </div>
      <div className={style.Wrapper}>
        <EditTradeList sale={sale} />
      </div>
    </div>
  );
}
//TODO : TradeList도 알맞게 수정할 예정 지금 임시로 넣어둠
