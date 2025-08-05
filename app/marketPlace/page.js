"use client";
import Select from "@/components/marketPlace/select/select";
import SelectFilter from "@/components/marketPlace/select/selectFilter.js";
import style from "@/app/marketPlace/page.module.css";
import {
  gradeOption,
  amountOption,
  genreOption,
  sortOption,
} from "@/components/marketPlace/config/config";
import Card from "@/components/marketPlace/card/card";
import buttonS from "../../public/icons/ic_filter.svg";
import Image from "next/image";
import { useState } from "react";
import recicle from "../../public/icons/ic_exchange.svg";
import LoginModal from "@/components/modals/loginModal";
import SellPhotoModal from "@/components/modals/sellPhotoModal";
import { useQuery } from "@tanstack/react-query";
import fetchSales from "@/utils/api/marketPlace";

export default function MarketPlace() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptionType, setSelectedOptionType] = useState(null);
  //
  const [selectedFilters, setSelectedFilters] = useState({
    grade: null,
    genre: null,
    soldout: null,
  });

  const [tempFilters, setTempFilters] = useState({
    grade: null,
    genre: null,
    soldout: null,
  });
  //
  const [loginModal, setLoginModal] = useState(false);
  const [login, setLogin] = useState(true);
  // 일단임시 로그인됐을 때

  const { data, error, isLoading } = useQuery({
    queryKey: ["sales", selectedFilters],
    queryFn: () => {
      return fetchSales(selectedFilters);
    },
    keepPreviousData: true,
  });

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error occurred</p>;

  const cards = data?.sales || [];
  //임시로불러오기

  const optionMap = {
    grade: gradeOption,
    genre: genreOption,
    soldout: amountOption,
  };

  const optionTypes = [
    { value: "grade", label: "등급" },
    { value: "genre", label: "장르" },
    { value: "soldout", label: "매진여부" },
  ];

  const handleOptionClick = (type) => {
    setSelectedOptionType(type);
  };
  const handleButton = () => {
    console.log("로그울림");
    setIsOpen((prev) => !prev);
  };
  //

  //

  const handleGradeChange = (val) => {
    setSelectedFilters((prev) => ({
      ...prev,
      grade: val.value.toUpperCase(),
    }));
  };

  const handleGenreChange = (val) => {
    setSelectedFilters((prev) => ({
      ...prev,
      genre: val.value,
    }));
  };

  const handleSoldoutChange = (val) => {
    setSelectedFilters((prev) => ({
      ...prev,
      soldout: val.value,
    }));
  };
  //

  const handleLogin = (e) => {
    e.stopPropagation();
    setLoginModal((prev) => !prev);
    console.log(loginModal);
  };

  const handleChange = () => {
    console.log("임시");
  };

  return (
    <div className={style.marketPlace}>
      {console.log(cards)}
      <div className={style.marketPlaceContainer}>
        <div className={style.title_Box}>
          {/* title */}
          <input placeholder="검색" className={style.filterInputMobile}></input>
          <p className={style.title_Text}>마켓플레이스</p>
          <button onClick={handleLogin} className={style.title_Button}>
            나의 포토카드 판매
          </button>
        </div>
        <div className={style.filterContainer}>
          <div className={style.filterBox}>
            {/* filter */}
            <input placeholder="검색" className={style.filterInput}></input>
            <Select
              option={gradeOption}
              name={"등급"}
              onChange={handleGradeChange}
            ></Select>
            <Select
              option={genreOption}
              name={"장르"}
              onChange={handleGenreChange}
            ></Select>
            <Select
              option={amountOption}
              name={"매진여부"}
              onChange={handleSoldoutChange}
            ></Select>
          </div>
          <button className={style.filterBoxTable} onClick={handleButton}>
            <Image src={buttonS} height={50} width={50} alt={"버튼"} />
          </button>
          {/* 셀렉트1개 */}
          <div className={style.filterSelect}>
            <SelectFilter
              option={sortOption}
              name={"낮은 가격순"}
              onChange={handleChange}
            ></SelectFilter>
          </div>
        </div>
        <div className={style.cardList}>
          {/* 카드진열대 */}
          {/* 대충 list받아온거 .map 으로 나열할 예정 */}
          {cards.map((card) => (
            <div className={style.cardItem} key={card.saleId}>
              <Card {...card} />
            </div>
          ))}
        </div>
      </div>
      {isOpen && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <div className={style.modalTitle}>
              {/* title */}
              <div></div>
              <p className={style.modalTitleFont}>필터</p>
              <p
                className={style.modalClose}
                onClick={() => setIsOpen((prev) => !prev)}
              >
                x
              </p>
            </div>
            <div className={style.modalOption}>
              {optionTypes.map((opt) => (
                <p
                  key={opt.value}
                  onClick={() => handleOptionClick(opt.value)}
                  className={`${style.optionItem} ${
                    selectedOptionType === opt.value
                      ? style.optionItemActive
                      : ""
                  }`}
                >
                  {opt.label}
                </p>
              ))}
            </div>
            <div className={style.modalOptionLine}></div>
            {/* 등급,장르,매진여부 눌렀을 떄 나오는 블럭형식의 option들 */}
            <div className={style.optionBlock}>
              {optionMap[selectedOptionType]?.map((opt) => (
                <div
                  key={opt.value}
                  className={style.options}
                  onClick={() => {
                    if (selectedOptionType === "grade") {
                      setTempFilters((prev) => ({
                        ...prev,
                        grade: opt.value.toUpperCase(),
                      }));
                    } else if (selectedOptionType === "genre") {
                      setTempFilters((prev) => ({
                        ...prev,
                        genre: opt.value,
                      }));
                    } else if (selectedOptionType === "soldout") {
                      setTempFilters((prev) => ({
                        ...prev,
                        soldout: opt.value,
                      }));
                    }
                  }}
                >
                  <p key={opt.value} className={style[opt.value.toLowerCase()]}>
                    {opt.label}
                  </p>
                  <p>{0}개</p>
                </div>
              ))}
            </div>
            <div className={style.modalButtonBox}>
              <button>
                <Image src={recicle} height={50} width={50} alt={"버튼"} />
              </button>
              <button
                onClick={() => {
                  setSelectedFilters(tempFilters);
                  setIsOpen(false);
                }}
                className={style.modalButton}
              >
                포토보기
              </button>
            </div>
          </div>
        </div>
      )}
      <div>{loginModal ? login ? <SellPhotoModal /> : <LoginModal /> : ""}</div>
      {/* 로그인이되었을 때 조건만 추가하면 연결완료 */}
    </div>
  );
}
