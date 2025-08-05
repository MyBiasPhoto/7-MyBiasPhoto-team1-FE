"use client";
import style from "@/app/marketPlace/page.module.css";
import {
  amountOption,
  genreOption,
  gradeOption,
  sortOption,
} from "@/components/marketPlace/config/config";
import fetchSales from "@/utils/api/marketPlace";
import { useQuery } from "@tanstack/react-query";
import { useReducer, useState, useMemo } from "react";
import { useEffect } from "react";
import CardList from "@/components/marketPlace/section/landing/cardList/CardList";
import FilterBar from "@/components/marketPlace/section/landing/filterBar/FilterBar";
import FilterModal from "@/components/marketPlace/section/landing/filterModal/FilterModal";
import Header from "@/components/marketPlace/section/landing/header/Header";
import LoginModalWrapper from "@/components/marketPlace/section/landing/loginModalWrapper/loginModalWrapper";
import getCountByOption from "@/components/marketPlace/util/util";

export default function MarketPlace() {
  // 1. 상태 선언
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 임시 로그인 상태

  const initialFilterState = {
    selected: { grade: null, genre: null, soldout: null, orderBy: null },
    temp: { grade: null, genre: null, soldout: null, orderBy: null },
    selectedOptionType: null,
  };

  // 2. 리듀서 정의 및 사용
  function filterReducer(state, action) {
    switch (action.type) {
      case "SET_SELECTED":
        return { ...state, selected: { ...state.selected, ...action.payload } };
      case "SET_TEMP":
        return { ...state, temp: { ...state.temp, ...action.payload } };
      case "SET_OPTION_TYPE":
        return { ...state, selectedOptionType: action.payload };
      case "APPLY_TEMP":
        return { ...state, selected: { ...state.temp } };
      default:
        return state;
    }
  }
  const [filterState, dispatch] = useReducer(filterReducer, initialFilterState);

  // 3. 데이터 fetching
  const { data, error, isLoading } = useQuery({
    queryKey: ["sales", filterState.selected],
    queryFn: () => fetchSales(filterState.selected),
    keepPreviousData: true,
  });
  const cards = data?.sales || [];

  // 4. 옵션 및 타입 변수
  const optionMap = {
    grade: gradeOption,
    genre: genreOption,
    soldout: amountOption,
    orderBy: sortOption,
  };
  const optionTypes = [
    { value: "grade", label: "등급" },
    { value: "genre", label: "장르" },
    { value: "soldout", label: "매진여부" },
  ];

  const countMap = useMemo(() => {
    if (!cards || cards.length === 0)
      return {
        grade: [],
        genre: [],
        soldout: [],
      };

    const gradeCount = getCountByOption(cards, gradeOption, "grade");
    const genreCount = getCountByOption(cards, genreOption, "genre");
    const soldoutCount = getCountByOption(cards, amountOption, "soldout");

    return {
      grade: gradeCount,
      genre: genreCount,
      soldout: soldoutCount,
    };
  }, [cards]);

  // 5. 이벤트 핸들러 함수 그룹
  const handleOptionClick = (type) => {
    dispatch({ type: "SET_OPTION_TYPE", payload: type });
  };

  const handleFilterChange = (filterKey, val) => {
    dispatch({
      type: "SET_SELECTED",
      payload: {
        [filterKey]:
          filterKey === "grade" ? val.value.toUpperCase() : val.value,
      },
    });
  };

  const toggleFilterModal = () => setIsFilterModalOpen((prev) => !prev);

  const handleLoginClick = (e) => {
    e.stopPropagation();
    setLoginModalOpen((prev) => !prev);
  };

  const handleSortChange = (value) => {
    dispatch({
      type: "SET_SELECTED",
      payload: { orderBy: value },
    });
  };

  //
  useEffect(() => {
    console.log("selected filter changed:", filterState.selected);
  }, [filterState.selected]);

  // 6. JSX (컴포넌트 분리)
  return (
    <div className={style.marketPlace}>
      <Header onLoginClick={handleLoginClick} />

      <div className={style.marketPlaceContainer}>
        <FilterBar
          onFilterChange={handleFilterChange}
          onToggleFilterModal={toggleFilterModal}
          onSortChange={handleSortChange}
        />

        <CardList cards={cards} />
      </div>

      {isFilterModalOpen && (
        <FilterModal
          filterState={filterState}
          dispatch={dispatch}
          optionTypes={optionTypes}
          optionMap={optionMap}
          countMap={countMap}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}

      <LoginModalWrapper
        isOpen={loginModalOpen}
        isLoggedIn={isLoggedIn}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
}
