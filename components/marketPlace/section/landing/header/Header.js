import style from "@/app/marketPlace/page.module.css";

export default function Header({ onLoginClick, onFilterChange, searchValue }) {
  return (
    <div className={style.title_Box}>
      <input
        placeholder="검색"
        className={style.filterInputMobile}
        value={searchValue}
        onChange={(val) => onFilterChange("search", val.target)}
      />
      <p className={style.title_Text}>마켓플레이스</p>
      <button onClick={onLoginClick} className={style.title_Button}>
        나의 포토카드 판매
      </button>
    </div>
  );
}
