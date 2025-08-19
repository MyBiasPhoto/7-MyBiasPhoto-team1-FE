// components/common/FilterBar.js
import style from "@/app/myGallery/page.module.css";
import {
  gradeOption,
  genreOption,
} from "@/components/marketPlace/config/config";
import Select from "../marketPlace/select/select";

export default function FilterBar({ filters, dispatch }) {
  return (
    <div className={style.filterContainer}>
      <div className={style.filterBox}>
        {/* 검색 */}
        <input
          type="text"
          value={filters.search || ""}
          onChange={e =>
            dispatch({ type: "SET_SEARCH", payload: e.target.value })
          }
          placeholder="검색어 입력"
          className={style.filterInput}
        />

        {/* 등급 필터 */}
        <Select
          name="전체"
          option={gradeOption}
          onChange={opt => dispatch({ type: "SET_GRADE", payload: opt.value })}
        />

        {/* 장르 필터 */}
        <Select
          name="전체"
          option={genreOption}
          onChange={opt => dispatch({ type: "SET_GENRE", payload: opt.value })}
        />
      </div>
    </div>
  );
}
