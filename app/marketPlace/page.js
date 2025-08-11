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
import { useReducer, useState, useMemo, useRef } from "react";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 임시 로그인 상태
  const [master, setMaster] = useState(false); //임시 판매자인상태
  const observerTarget = useRef(null);
  const [currentUserNickname, setCurrentUserNickname] = useState("");

  const initialFilterState = {
    selected: {
      grade: null,
      genre: null,
      soldout: null,
      orderBy: null,
      search: null,
    },
    temp: {
      grade: null,
      genre: null,
      soldout: null,
      orderBy: null,
      search: null,
    },
    selectedOptionType: null,
    page: 1,
    allCards: [],
    totalPages: 1,
  };

  // 2. 리듀서 정의 및 사용
  function filterReducer(state, action) {
    switch (action.type) {
      case "SET_SELECTED":
        return {
          ...state,
          selected: { ...state.selected, ...action.payload },
          page: 1,
          allCards: [],
        };
      case "SET_TEMP":
        return { ...state, temp: { ...state.temp, ...action.payload } };
      case "SET_OPTION_TYPE":
        return { ...state, selectedOptionType: action.payload };
      case "APPLY_TEMP":
        return {
          ...state,
          selected: { ...state.temp },
          page: 1,
          allCards: [],
        };
      case "RESET_TEMP":
        return { ...state, temp: initialFilterState.temp };
      case "SET_PAGE":
        return { ...state, page: action.payload };
      case "SET_DATA":
        const { sales, totalPages } = action.payload;
        return {
          ...state,
          allCards: state.page === 1 ? sales : [...state.allCards, ...sales],
          totalPages: totalPages,
        };
      default:
        return state;
    }
  }
  const [filterState, dispatch] = useReducer(filterReducer, initialFilterState);

  // 3. 데이터 fetching
  const { data, error, isLoading } = useQuery({
    queryKey: ["sales", filterState.selected, filterState.page],
    queryFn: () =>
      fetchSales({ ...filterState.selected, page: filterState.page }),
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

  const handleCardClick = (card) => {
    console.log("현재 유저 닉네임:", currentUserNickname);
    console.log("카드 제작자 닉네임:", card.sellerNickname);
    if (card.sellerNickname === currentUserNickname) {
      setMaster(true);
    } else {
      setMaster(false);
    }
  };

  // 판매자랑 내 이름하고 일치했을경우 판매자 OR 구매자로직으로들어가는 형태
  //하다가망함 user하고 카드올린주인하고 일치하면 true 아니면 false임

  //

  //로그인됐는지 안됐는지 판단하는 로직(로컬스토리지에있는 user값이 있으면 로그인 없으면 로그아웃으로판단하기로함)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      const user = JSON.parse(storedUser);
      if (user?.nickname) {
        setIsLoggedIn(true);
        setCurrentUserNickname(user.nickname);
      } else {
        setIsLoggedIn(false);
        setCurrentUserNickname("");
      }
    } catch {
      setIsLoggedIn(false);
      setCurrentUserNickname("");
    }
  }, [filterState.allCards, currentUserNickname]);
  //

  useEffect(() => {
    if (data?.sales) {
      // 리듀서에 data 객체 전체를 payload로 전달합니다.
      dispatch({ type: "SET_DATA", payload: data });
    }
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          filterState.page < filterState.totalPages
        ) {
          dispatch({ type: "SET_PAGE", payload: filterState.page + 1 });
        }
      },
      { threshold: 1.0 }
    );
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [isLoading, filterState.page, filterState.totalPages]);

  // 6. JSX (컴포넌트 분리)
  return (
    <div className={style.marketPlace}>
      {/* <button
        className={`${master ? style.masterActive : style.masterInactive}`}
        onClick={() => setMaster((prev) => !prev)}
      >
        {master ? "판매자" : "유저"}
      </button> */}
      <Header
        onLoginClick={handleLoginClick}
        onFilterChange={handleFilterChange}
        searchValue={filterState.selected.search || ""}
      />

      <div className={style.marketPlaceContainer}>
        <FilterBar
          onFilterChange={handleFilterChange}
          onToggleFilterModal={toggleFilterModal}
          onSortChange={handleSortChange}
          dispatch={dispatch}
          searchValue={filterState.selected.search || ""}
        />
        {console.log("여기엔 뭐가뜨나요?", filterState.allCards)}
        <CardList
          onCardClick={handleCardClick}
          currentUserNickname={currentUserNickname}
          cards={filterState.allCards}
        />
        <button
          className={style.scrollButton}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          맨 위로
        </button>
        <div ref={observerTarget}></div>
        {isLoading && filterState.page > 1 && (
          <div className={style.Loading}>
            <div className={style.spinner}></div>
          </div>
        )}{" "}
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
