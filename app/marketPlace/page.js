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

export default function marketPlace() {
  const handleChange = (val) => {
    console.log("선택된 값:", val);
  };
  return (
    <div className={style.marketPlace}>
      <div className={style.marketPlaceContainer}>
        <div className={style.title_Box}>
          {/* title */}
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
          {/* 셀렉트1개 */}
          <div className={style.filterSelect}>
            <SelectFilter
              option={sortOption}
              name={"낮은 가격순"}
              onChange={handleChange}
            ></SelectFilter>
          </div>
        </div>
        <div>
          {/* 카드진열대 */}
          {/* 대충 list받아온거 .map 으로 나열할 예정 */}
          <Card></Card>
        </div>
      </div>
    </div>
  );
}
