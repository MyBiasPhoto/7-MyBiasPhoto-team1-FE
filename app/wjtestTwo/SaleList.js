"use client";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import { fetchSales } from "@/utils/api/sales";

import { useQuery } from "@tanstack/react-query";

export default function SaleList() {
  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ["sales"],
    queryFn: fetchSales,

    //@TODO
    // queryKey: ["sales",page,filter,keyword 등등],
    // queryFn:()=> fetchSales(page,fileter,keyword), 이런식으로 들어올예정
  });
  const saleList = data?.saleList ?? [];
  // if (isLoading) return <LoadingSpinner />;
  if (isPending) return <LoadingSpinner />;
  if (error) return <p>에러 발생: {error.message}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">판매 목록</h1>
      <ul className="space-y-2 mt-4">
        {saleList.map((sale) => (
          <li key={sale.photoCardId} className="border p-2 rounded">
            <div>===================</div>
            {/* <img
              src={sale.imageUrl}
              alt={sale.name}
              className="w-40 h-30 mb-2"
            /> */}
            <div>이미지 url : {sale.imageUrl}</div>
            <div>카드이름: {sale.name}</div>
            <div>닉네임: {sale.nickname}</div>
            <div>가격: {sale.price}원</div>
            <div>등급: {sale.grade}</div>
            <div>장르: {sale.genre}</div>
            <div>
              잔여 / 전체:{sale.totalOnSale} / {sale.totalRegistered}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
