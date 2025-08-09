"use client";

import style from "./SearchInput.module.css";
import { useRef } from "react";

export default function SearchInput({ value, onChange, onEnter, isLoading }) {
  const composingRef = useRef(false);

  return (
    <div className={style.inputWrap}>
      <input
        placeholder="검색"
        value={value}
        className={style.filterInput}
        onCompositionStart={() => (composingRef.current = true)}
        onCompositionEnd={(e) => {
          composingRef.current = false;
          onChange?.(e.target.value);
        }}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !composingRef.current) {
            e.preventDefault();
            onEnter?.();
          }
        }}
      />
      {/* 선택: 로딩 인디케이터 표시 */}
      {isLoading ? <span className={style.spinner} /> : null}
    </div>
  );
}
