"use client";
import Select from "@/components/marketPlace/select/select.js";
import filterImg from "@/public/icons/ic_filter.svg";
import Image from "next/image";
import SearchInput from "../common/filter/SearchInput.js";
import {
  genreOption,
  gradeOption,
  saleTypeOption,
} from "../marketPlace/config/config";
import style from "./FilterContainer.module.css";

export default function FilterContainer({
  value,
  onFilterChange,
  onOpenFilterModal,
}) {
  return (
    <div className={style.filterContainer}>
      <div className={style.rowDesktop}>
        <SearchInput
          value={value?.search ?? ""}
          onChange={val => onFilterChange("search", val)}
        />
        <div className={style.selectContainer}>
          <Select
            option={gradeOption}
            name="등급"
            onChange={opt => onFilterChange("grade", opt?.value ?? "")}
          />
          <Select
            option={genreOption}
            name="장르"
            onChange={opt => onFilterChange("genre", opt?.value ?? "")}
          />
          <Select
            option={saleTypeOption}
            name="판매방법"
            onChange={opt => onFilterChange("saleType", opt?.value ?? "")}
          />
        </div>
      </div>
      <div className={style.rowMobile}>
        <button
          className={style.filterBtn}
          aria-label="필터 열기"
          onClick={onOpenFilterModal}
        >
          <Image src={filterImg} width={24} height={24} alt="필터 버튼"></Image>
        </button>
        <SearchInput
          value={value?.search ?? ""}
          onChange={val => onFilterChange("search", val)}
        ></SearchInput>
      </div>
    </div>
  );
}
