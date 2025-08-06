//app/myGallery/MyGalleryClient.js
"use client";
import FilterBar from "@/components/common/FilterBar";
import PageHeader from "@/components/common/pageHeader/PageHeader";

import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import MyGalleryCardGrid from "@/components/myGallery/MyGalleryCardGrid";
import useDebounce from "@/hooks/useDebounce";
import useGalleryFilters from "@/hooks/useMyGalleryFilters";
import { fetchMyGalleryData } from "@/utils/api/myGalleries";
import { useQuery } from "@tanstack/react-query";

import style from "./page.module.css";

export default function MyGalleryClient({ initialFilters }) {
  const { state: filters, dispatch } = useGalleryFilters(initialFilters);

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

  const saleList = data?.sales ?? []; // saleList -> sales

  return (
    <div className={style.myGallery}>
      <PageHeader
        title={"마이갤러리"}
        buttonLabel={"포토카드 생성하기"}
        onButtonClick={() => {
          //@TODO 포토카드생성 모달 연결
          console.log("포토카드생성하기 버튼 클릭+포카 생성모달 연결");
        }}
      />
      <div>정우진 님이 보유한 포토카드 자리(CardStatus 컴포넌트 예정)</div>
      <div>Common 10장 Rare 3장 ~~~</div>
      <div className={style.myGalleryContainer}>
        <FilterBar filters={filters} dispatch={dispatch} />

        {error && <div>에러발생 : {error.message}</div>}

        {isPending ? (
          <div>
            <LoadingSpinner />
          </div>
        ) : saleList?.length === 0 ? (
          <div>검색결과 없음</div>
        ) : (
          <MyGalleryCardGrid items={saleList} />
        )}
      </div>
    </div>
  );
}
