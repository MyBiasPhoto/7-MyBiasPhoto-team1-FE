import Select from "@/components/marketPlace/select/select";
import SelectFilter from "@/components/marketPlace/select/selectFilter";
import style from "@/app/marketPlace/page.module.css";
import Image from "next/image";
import buttonS from "../../../../../public/icons/ic_filter.svg";
import recicle from "@/public/icons/ic_exchange.svg";
import {
  gradeOption,
  genreOption,
  amountOption,
  sortOption,
} from "@/components/marketPlace/config/config";
import React, { memo } from "react";

function FilterBar({
  onFilterChange,
  onToggleFilterModal,
  onSortChange,
  dispatch,
  searchValue,
}) {
  return (
    <div className={style.filterContainer}>
      <div className={style.filterBox}>
        <input
          placeholder="검색"
          value={searchValue}
          className={style.filterInput}
          onChange={val => onFilterChange("search", val.target)}
        />
        <Select
          option={gradeOption}
          name={"등급"}
          onChange={val => onFilterChange("grade", val)}
        />
        <Select
          option={genreOption}
          name={"장르"}
          onChange={val => onFilterChange("genre", val)}
        />
        <Select
          option={amountOption}
          name={"매진여부"}
          onChange={val => onFilterChange("soldout", val)}
        />
        <Image
          onClick={() => {
            dispatch({ type: "RESET_TEMP" });
            dispatch({ type: "APPLY_TEMP" });
          }}
          src={recicle}
          width={20}
          height={50}
          alt="버튼"
          className={style.recicle}
        />
      </div>

      <button className={style.filterBoxTable} onClick={onToggleFilterModal}>
        <Image src={buttonS} height={35} width={35} alt={"버튼"} />
      </button>

      <div className={style.filterSelect}>
        <SelectFilter
          option={sortOption}
          name={"낮은 가격순"}
          onChange={val => onFilterChange("orderBy", val)}
        />
      </div>
    </div>
  );
}

export default memo(FilterBar);
