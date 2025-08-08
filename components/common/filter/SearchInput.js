import style from "./SearchInput.module.css";

export default function SearchInput({ value, onChange }) {
  return (
    <input
      placeholder="검색"
      value={value}
      className={style.filterInput}
      onChange={(val) => onChange("search", e.target)}
    />
  );
}
