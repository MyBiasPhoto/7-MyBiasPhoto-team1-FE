"use client";
import CardRaritySummary from "@/components/common/CardRarityCount/CardRaritySummary.js";
import ContentHeader from "@/components/common/contentHeader/ContentHeader";
import UserCardList from "@/components/common/userCard/UserCardList";
import ConnectedFilterModal from "@/components/mySalePage/ConnectedFilterModal";
import FilterContainer from "@/components/mySalePage/FilterContainer.js";
import useDebounce from "@/hooks/useDebounce";
import { fetchMySaleData } from "@/utils/api/mySale";
import { useAuth } from "@/utils/auth/authContext";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import style from "./page.module.css";
import Pagination from "@/components/common/pagination/Pagination";

export default function MySaleClient({ initialFilters }) {
  const [filters, setFilters] = useState(initialFilters);
  const [searchDraft, setSearchDraft] = useState(initialFilters.search ?? "");

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const openFilterModal = () => setIsFilterModalOpen(true);

  {
    /* 마이페이지 이동 버튼에 로그인이 안되어있을때는 로그인 페이지로 이동하고 
    로그인이 된 상태일때만 mySale 페이지로 이동하도록 수정 요청,
     경로를 mySalePage에서 mySale로 변경하였으므로, mySale로 연결되도록 수정 요청 */
  }

  // 타이핑 멈춘 뒤 자동 검색 (디바운스)
  const debouncedSearch = useDebounce(searchDraft, 500);

  useEffect(() => {
    setFilters((prev) =>
      prev.search === debouncedSearch
        ? prev
        : { ...prev, search: debouncedSearch, page: 1 }
    );
  }, [debouncedSearch]);

  // 엔터/돋보기 클릭 시 즉시 검색
  const handleSearchCommit = useCallback(() => {
    setFilters((prev) =>
      prev.search === searchDraft
        ? prev
        : { ...prev, search: searchDraft, page: 1 }
    );
  }, [searchDraft]);

  const handleFilterChange = useCallback((key, val) => {
    if (key === "search") return setSearchDraft(val ?? "");
    setFilters((prev) => {
      const next = { ...prev, [key]: val ?? "" };
      // TODO: 서버에서 saleType 쿼리 구현 후 아래 주석 반영
      if (["grade", "genre", /*"saleType",*/ "soldOut"].includes(key))
        next.page = 1;
      return next;
    });
  }, []);

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ["mySale", filters],
    queryFn: () => fetchMySaleData(filters),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  const {
    userNickname,
    myMarketList = [],
    totalCount = 0,
    page = 1,
    pageSize = 0,
    gradeCounts,
  } = data ?? {};

  if (isPending && !data)
    return <div className={style.pageContainer}>불러오는 중…</div>;
  if (isError) {
    return (
      <div className={style.pageContainer}>
        <p>데이터를 불러오는 중 문제가 발생했습니다.</p>
        <p>잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  return (
    <div className={style.pageContainer}>
      <div className={style.section}>
        <ContentHeader pageTitle="나의 판매 포토카드" />
      </div>

      <div className={style.section}>
        <CardRaritySummary gradeCounts={gradeCounts} nickname={userNickname} />
      </div>

      <div className={style.section}>
        <FilterContainer
          value={{ ...filters, search: searchDraft }}
          onFilterChange={handleFilterChange}
          onSearchCommit={handleSearchCommit}
          isFetching={isFetching}
          onOpenFilterModal={openFilterModal}
        />
      </div>

      <div className={style.section}>
        <UserCardList cards={myMarketList} />
      </div>
      <div>
        <Pagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={(nextPage) => {
            setFilters((prev) => ({ ...prev, page: nextPage }));
          }}
        ></Pagination>
      </div>
      {isFilterModalOpen && (
        <ConnectedFilterModal
          value={filters}
          onApply={(next) =>
            setFilters((prev) => ({ ...prev, ...next, page: 1 }))
          }
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}
    </div>
  );
}
