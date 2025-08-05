import Select from "@/components/marketPlace/select/select";
import SelectFilter from "@/components/marketPlace/select/selectFilter.js";
import style from "@/app/marketPlace/page.module.css";
import Image from "next/image";
import buttonS from "../../../../../public/icons/ic_filter.svg";
import {
  gradeOption,
  genreOption,
  amountOption,
  sortOption,
} from "@/components/marketPlace/config/config";

export default function FilterBar({
  onFilterChange,
  onToggleFilterModal,
  onSortChange,
}) {
  return (
    <div className={style.filterContainer}>
      <div className={style.filterBox}>
        <input placeholder="검색" className={style.filterInput} />
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
          option={amountOption}
          name={"매진여부"}
          onChange={(val) => onFilterChange("soldout", val)}
        />
      </div>

      <button className={style.filterBoxTable} onClick={onToggleFilterModal}>
        <Image src={buttonS} height={50} width={50} alt={"버튼"} />
      </button>

      <div className={style.filterSelect}>
        <SelectFilter
          option={sortOption}
          name={"낮은 가격순"}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
}
