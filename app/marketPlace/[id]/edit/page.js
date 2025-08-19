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
  const [userLoading, setUserLoading] = useState(true); // 유저 로딩 상태

  // 현재 로그인 유저 정보 가져오기
  useEffect(function loadCurrentUser() {
    let cancelled = false; // fetch 중 컴포넌트 언마운트 대비

    async function fetchCurrentUser() {
      setUserLoading(true); // 로딩 시작
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const url = `${baseUrl}/users/me`;

      try {
        const res = await fetch(url, { credentials: "include" });
        let data = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }
        if (!cancelled) {
          setCurrentUser(data?.me ?? null);
        }
      } catch {
        if (!cancelled) setCurrentUser(null);
      } finally {
        if (!cancelled) setUserLoading(false); // 로딩 종료 (성공/실패 무관)
      }
    }

    fetchCurrentUser();
    return function cleanup() {
      cancelled = true;
    };
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
  useEffect(
    function maybeRedirectNonSeller() {
      if (isLoading || userLoading) return; // 경쟁 상태 차단: 둘 다 로딩 끝나고 판단
      if (!sale?.id) return;
      if (!isSeller) {
        router.replace(`/marketPlace/${sale.id}`);
      }
    },
    [isLoading, userLoading, sale?.id, isSeller, router]
  );

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
