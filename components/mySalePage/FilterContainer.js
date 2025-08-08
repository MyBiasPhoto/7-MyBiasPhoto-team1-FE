"use client";
import SearchInput from "../common/filter/SearchInput.js";
import Select from "@/components/marketPlace/select/select.js";
import style from "./FilterContainer.module.css";
import {
  gradeOption,
  genreOption,
  saleTypeOption,
  soldoutOption,
} from "../marketPlace/config/config";
export default function FilterContainer({ value }) {
  return (
    <div className={style.filterContainer}>
      <SearchInput
        value={value}
        onChange={(val) => onFilterChange("search", val)}
      ></SearchInput>
      <div className={style.selectContainer}>
        <Select
          option={gradeOption}
          name={"등급"}
          onChange={(val) => onFilterChange("grade", val)}
        />
        <Select
          option={genreOption}
          name={"장르"}
          onChange={(val) => onFilterChange("genre", val)}
        />
        <Select
          option={saleTypeOption}
          name={"판매방법"}
          onChange={(val) => onFilterChange("saleType", val)}
        />
        <Select
          option={soldoutOption}
          name={"매진여부"}
          onChange={(val) => onFilterChange("soldout", val)}
        />
      </div>
    </div>
  );
}
