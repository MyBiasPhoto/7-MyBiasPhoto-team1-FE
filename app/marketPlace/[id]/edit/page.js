"use client";

import style from "./page.module.css";
import EditArea from "@/components/marketPlace/edit/section/edit";
import EditTradeList from "@/components/marketPlace/edit/tradeList/tradeList";
import { fetchSaleById } from "@/utils/api/marketPlace";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import logo from "../../../../public/assets/logo.svg";
import { useEffect, useState, useMemo } from "react";

export default function MarketPlaceEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);

  // 현재 로그인 유저 정보 가져오기
  useEffect(() => {
    async function fetchCurrentUser() {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const url = `${baseUrl}/users/me`;

      try {
        const res = await fetch(url, {
          credentials: "include",
        });

        const text = await res.text();

        // JSON 파싱 시도
        try {
          const data = JSON.parse(text);
          if (data?.me) {
            setCurrentUser(data.me);
          } else {
            console.warn("서버에서 me 정보가 없습니다:", data);
          }
        } catch {
          console.error(
            "현재 유저 정보 불러오기 실패: JSON 아님, 원본 응답:",
            text
          );
        }
      } catch (e) {
        console.error("현재 유저 정보 요청 중 에러:", e);
      }
    }
    fetchCurrentUser();
  }, []);

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

  const isSeller = useMemo(() => {
    return (
      !!currentUser?.id && !!sale?.sellerId && sale.sellerId === currentUser.id
    );
  }, [currentUser?.id, sale?.sellerId]);

  // 판매자 아닐 시 구매 페이지로 이동
  useEffect(() => {
    if (!isLoading && sale?.id && !isSeller) {
      router.replace(`/marketPlace/${sale.id}`);
    }
  }, [isLoading, sale?.id, isSeller, router]);

  if (isLoading) {
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
  }

  if (isError) return <div>에러: {error.message}</div>;

  if (!sale?.id) return <div>해당 판매글을 찾을 수 없습니다.</div>;

  if (!isSeller) {
    return (
      <div className={style.isLoading}>
        <Image
          className={style.loadingLogo}
          src={logo}
          width={200}
          height={200}
          alt="이동 중..."
          loading="lazy"
        />
      </div>
    );
  }
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
