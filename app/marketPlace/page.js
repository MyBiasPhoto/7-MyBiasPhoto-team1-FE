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

export default function MarketPlace() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptionType, setSelectedOptionType] = useState(null);
  const cards = [
    {
      id: "a1",
      title: "전설의 용사",
      grade: "legendary",
      writer: "홍길동",
      kind: "캐릭터",
      amount: 3,
      price: 1000,
    },
    {
      id: "a2",
      title: "빛의 정령",
      grade: "rare",
      writer: "이몽룡",
      kind: "캐릭터",
      amount: 2,
      price: 500,
    },
    {
      id: "a3",
      title: "어둠의 숲",
      grade: "super_rare",
      writer: "성춘향",
      kind: "배경",
      amount: 1,
      price: 1200,
    },
    {
      id: "a4",
      title: "현실주의 고양이",
      grade: "common",
      writer: "최길동",
      kind: "캐릭터",
      amount: 5,
      price: 300,
    },
    {
      id: "a5",
      title: "추상적 감정",
      grade: "etc",
      writer: "임꺽정",
      kind: "기타",
      amount: 0,
      price: 900,
    },
  ];

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

  const handleOptionClick = type => {
    setSelectedOptionType(type);
  };
  const handleButton = () => {
    console.log("로그울림");
    setIsOpen(prev => !prev);
  };
  const handleChange = val => {
    console.log("선택된 값:", val);
  };
  return (
    <div className={style.marketPlace}>
      <div className={style.marketPlaceContainer}>
        <div className={style.title_Box}>
          {/* title */}
          <input placeholder="검색" className={style.filterInputMobile}></input>
          <p className={style.title_Text}>마켓플레이스</p>
          <button className={style.title_Button}>나의 포토카드 판매</button>
        </div>
        <div className={style.filterContainer}>
          <div className={style.filterBox}>
            {/* filter */}
            <input placeholder="검색" className={style.filterInput}></input>
            <Select
              option={gradeOption}
              name={"등급"}
              onChange={handleChange}
            ></Select>
            <Select
              option={genreOption}
              name={"장르"}
              onChange={handleChange}
            ></Select>
            <Select
              option={amountOption}
              name={"매진여부"}
              onChange={handleChange}
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
          {cards.map(card => (
            <div className={style.cardItem} key={card.id}>
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
                onClick={() => setIsOpen(prev => !prev)}
              >
                x
              </p>
            </div>
            <div className={style.modalOption}>
              {optionTypes.map(opt => (
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
              {optionMap[selectedOptionType]?.map(opt => (
                <div key={opt.value} className={style.options}>
                  <p key={opt.value} className={style[opt.value.toLowerCase()]}>
                    {opt.label}
                  </p>
                </div>
              ))}
            </div>
            <div className={style.modalButtonBox}>
              <button>
                <Image src={recicle} height={50} width={50} alt={"버튼"} />
              </button>
              <button className={style.modalButton}>포토보기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
