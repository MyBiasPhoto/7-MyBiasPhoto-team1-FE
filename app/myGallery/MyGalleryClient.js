//app/myGallery/MyGalleryClient.js
"use client";
import FilterBar from "@/components/common/FilterBar";
import PageHeader from "@/components/common/pageHeader/PageHeader";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import MyGalleryCardGrid from "@/components/myGallery/MyGalleryCardGrid";
import Pagination from "@/components/common/pagination/Pagination";
import useDebounce from "@/hooks/useDebounce";
import useGalleryFilters from "@/hooks/useMyGalleryFilters";
import { fetchMyGalleryData } from "@/utils/api/myGalleries";
import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import CardRaritySummary from "@/components/common/CardRarityCount/CardRaritySummary";
import { useState, useCallback } from "react";
import FilterBartwo from "@/components/common/FilterBar2";
import {
  genreOption,
  gradeOption,
} from "@/components/marketPlace/config/config";

import style from "./page.module.css";
import { useAuth } from "@/utils/auth/authContext";
import LoginModal from "@/components/modals/loginModal";

export default function MyGalleryClient({ initialFilters }) {
  const router = useRouter();
  const pathname = usePathname();

  const { isLogin, bootstrapped, user } = useAuth();

  const { state: filters, dispatch } = useGalleryFilters({
    ...initialFilters,
    selectedOptionType: "grade",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 500);
  const queryFilters = {
    ...filters,
    search: debouncedSearch,
  };

  const { data, isPending, isLoading, error } = useQuery({
    queryKey: ["gallery", queryFilters],
    queryFn: () => fetchMyGalleryData(queryFilters),
    // keepPreviousData: true,
    enabled: bootstrapped && isLogin, //부트스트랩 끝나고 + 로그인 일때만 쿼리수행
  });

  const myGalleryList = data?.myGroupedCards ?? [];
  // const myGalleryList = data?.myMarketList ?? [];

  const totalCount = data?.totalCount ?? 0;
  const currentPage = data?.page ?? filters.page;
  const pageSize = data?.pageSize ?? 5;

  const { userNickname, myMarketList = [], page = 1, gradeCounts } = data ?? {};

  const toggleFilterModal = useCallback(
    () => setIsFilterModalOpen((prev) => !prev),
    []
  );

  // ✅ 부트스트랩 전에는 스켈레톤/스피너만
  if (!bootstrapped) {
    return (
      <div className={style.myGallery}>
        <PageHeader title="마이갤러리" />
        <div className={style.myGalleryContainer}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className={style.myGallery}>
      {/* {console.log(initialFilters)} */}
      <PageHeader
        title={"마이갤러리"}
        buttonLabel={"포토카드 생성하기"}
        onButtonClick={() => {
          //@TODO 포토카드생성 모달 연결
          router.push(`${pathname}/create`);
          console.log("포토카드생성하기 버튼 클릭+포카 생성모달 연결");
        }}
        onToggleFilterModal={toggleFilterModal}
      />

      <div className={style.myGalleryContainer}>
        <div className={style.topTitle}>
          <CardRaritySummary
            gradeCounts={gradeCounts ?? []}
            nickname={user.nickname ?? ""}
          />
        </div>
        <FilterBar filters={filters} dispatch={dispatch} />

        {error && <div>에러발생 : {error.message}</div>}

        <MyGalleryCardGrid
          items={myGalleryList}
          isLoading={isLoading}
          isPending={isPending}
        />
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={(page) => {
            dispatch({ type: "SET_PAGE", payload: page });
          }}
        />

        {isFilterModalOpen && (
          <div className={style.MobileModal}>
            <div className={style.MobileModalTitle}>
              <p>필터</p>
              <p
                className={style.close}
                onClick={() => setIsFilterModalOpen(false)}
              >
                x
              </p>
            </div>
            <FilterBartwo
              filters={filters}
              dispatch={dispatch}
              onClose={() => setIsFilterModalOpen(false)}
            />
          </div>
        )}
        {/* {console.log("필터값:", filters)} */}

        <div
          className={`${style.MobileModal} ${
            isFilterModalOpen ? style.show : ""
          }`}
        >
          <div className={style.MobileModalTitle}>
            <p>필터</p>
            <p
              className={style.close}
              onClick={() => setIsFilterModalOpen(false)}
            >
              x
            </p>
          </div>
          <FilterBartwo
            filters={filters}
            dispatch={dispatch}
            onClose={() => setIsFilterModalOpen(false)}
          />
        </div>
      </div>

      {/* ✅ 로그인 안 되어 있으면 모달 표시 (닫아도 페이지는 머무름) */}
      {!isLogin && (
        <LoginModal
          // 모달 닫기 동작을 막고 싶으면 onClose 제거하거나 noClose props 만들어 처리
          onClose={() => {
            // 사용자가 모달을 닫으면 홈 등으로 보낼지, 그냥 닫을지 팀 정책에 맞게
            // router.push("/login?returnTo=" + encodeURIComponent(pathname));
          }}
          returnTo={pathname} // 선택: 로그인 페이지에서 완료 후 돌아올 경로
        />
      )}
    </div>
  );
}
