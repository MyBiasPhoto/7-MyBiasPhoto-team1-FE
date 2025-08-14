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

export default function MyGalleryClient({ initialFilters }) {
  const router = useRouter();
  const pathname = usePathname();
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
  });

  const myGalleryList = data?.MyGalleryList ?? [];
  // const myGalleryList = data?.myMarketList ?? [];

  const totalCount = data?.totalCount ?? 0;
  const currentPage = data?.page ?? filters.page;
  const pageSize = data?.pageSize ?? 5;

  const { userNickname, myMarketList = [], page = 1, gradeCounts } = data ?? {};

  const toggleFilterModal = useCallback(
    () => setIsFilterModalOpen((prev) => !prev),
    []
  );

  return (
    <div className={style.myGallery}>
      {console.log(initialFilters)}
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
            nickname={userNickname ?? ""}
          />
        </div>
        <FilterBar filters={filters} dispatch={dispatch} />

        {error && <div>에러발생 : {error.message}</div>}

        {isPending ? (
          <div>
            <LoadingSpinner />
          </div>
        ) : myGalleryList?.length === 0 ? (
          <div>검색결과 없음</div>
        ) : (
          <>
            <MyGalleryCardGrid items={myGalleryList} />
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={(page) => {
                dispatch({ type: "SET_PAGE", payload: page });
              }}
            />
          </>
        )}
        {console.log("필터값:", filters)}

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
      </div>
    </div>
  );
}
