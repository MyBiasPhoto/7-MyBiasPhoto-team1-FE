// components/common/FilterBar.js
import style from "@/components/common/FilterBar2.module.css";
import {
  myGalleryGradeOption,
  myGalleryGenreOption,
} from "@/utils/constants/Filters";
import { useState } from "react";

export default function FilterBar({ filters, dispatch, onClose }) {
  const [activeFilter, setActiveFilter] = useState(null); // 'grade', 'genre', null

  const handleSelect = (type, value) => {
    dispatch({ type, payload: value });
    setActiveFilter(null); // 선택 후 닫기
    if (onClose) onClose();
  };
  const gradeColors = {
    흔한: "var(--main)",
    레어: "var(--blue)",
    슈퍼레어: "var(--purple)",
    레전드리: "var(--pink)",
  };

  const renderOptions = () => {
    if (activeFilter === "grade") {
      return myGalleryGradeOption.map((opt) => (
        <div
          key={opt.value}
          className={`${style.option} ${style.optionFont}`}
          onClick={() => handleSelect("SET_GRADE", opt.value)}
          style={{ color: gradeColors[opt.label] || "#fff" }}
        >
          {opt.label}
        </div>
      ));
    }
    if (activeFilter === "genre") {
      return myGalleryGenreOption.map((opt) => (
        <div
          key={opt.value}
          className={`${style.option} ${style.optionFont}`}
          onClick={() => handleSelect("SET_GENRE", opt.value)}
        >
          {opt.label}
        </div>
      ));
    }
    return null;
  };

  return (
    <div className={style.Container}>
      <div className={style.box}>
        <span
          className={`${style.font} ${
            activeFilter === "grade" ? style.active : ""
          }`}
          onClick={() =>
            setActiveFilter(activeFilter === "grade" ? null : "grade")
          }
        >
          등급
        </span>
        <span
          className={`${style.font} ${
            activeFilter === "genre" ? style.active : ""
          }`}
          onClick={() =>
            setActiveFilter(activeFilter === "genre" ? null : "genre")
          }
        >
          장르
        </span>
      </div>

      <div className={style.optionContainer}>{renderOptions()}</div>
    </div>
  );
}
