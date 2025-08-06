// components/common/FilterBar.js
import style from "@/app/myGallery/page.module.css";
import {
  myGalleryGradeOption,
  myGalleryGenreOption,
} from "@/utils/constants/Filters";
export default function FilterBar({ filters, dispatch }) {
  return (
    <div className={style.filterContainer}>
      <div className={style.filterBox}>
        {/* 검색 */}
        <input
          type="text"
          value={filters.search}
          onChange={(e) =>
            dispatch({ type: "SET_SEARCH", payload: e.target.value })
          }
          placeholder="검색어 입력"
        />

        {/* 등급 필터 */}
        <select
          value={filters.grade || ""}
          onChange={(e) =>
            dispatch({ type: "SET_GRADE", payload: e.target.value })
          }
        >
          <option value="">등급 전체</option>
          {myGalleryGradeOption.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* 장르 필터 */}
        <select
          value={filters.genre || ""}
          onChange={(e) =>
            dispatch({ type: "SET_GENRE", payload: e.target.value })
          }
        >
          <option value="">장르 전체</option>
          {myGalleryGenreOption.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
