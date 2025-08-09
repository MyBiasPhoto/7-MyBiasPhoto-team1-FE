"use client";
import SearchInput from "../common/filter/SearchInput.js";
import Select from "@/components/marketPlace/select/select.js";
import style from "./FilterContainer.module.css";
import filterImg from "@/public/icons/ic_filter.svg";
import {
  gradeOption,
  genreOption,
  saleTypeOption,
  soldoutOption,
  onToggleFilterModal,
} from "../marketPlace/config/config";
import Image from "next/image";

export default function FilterContainer({ value, onFilterChange }) {
  return (
    <div className={style.filterContainer}>
      <div className={style.rowDesktop}>
        <SearchInput
          value={value?.search ?? ""}
          onChange={(val) => onFilterChange("search", val)}
        />
        <div className={style.selectContainer}>
          <Select
            option={gradeOption}
            name="등급"
            onChange={(opt) => onFilterChange("grade", opt?.value ?? "")}
          />
          <Select
            option={genreOption}
            name="장르"
            onChange={(opt) => onFilterChange("genre", opt?.value ?? "")}
          />
          {/* TODO: 현재 판매 방법에 대한 query가 없으므로 백엔드 로직 작성 후 수정 */}
          {/* <Select
            option={saleTypeOption}
            name="판매방법"
            onChange={(opt) => onFilterChange("saleType", opt?.value ?? "")}
          /> */}
          <Select
            option={soldoutOption}
            name="매진여부"
            onChange={(opt) => onFilterChange("soldout", opt?.value ?? "")}
          />
        </div>
      </div>
      <div className={style.rowMobile}>
        <button className={style.filterBtn} aria-label="필터 열기">
          <Image src={filterImg} width={20} height={20} alt="필터 버튼"></Image>
        </button>
        <SearchInput
          value={value?.search ?? ""}
          onChange={(val) => onFilterChange("search", val)}
        ></SearchInput>
      </div>
    </div>
  );
}
