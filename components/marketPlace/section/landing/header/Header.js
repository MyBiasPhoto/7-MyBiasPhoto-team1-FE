import style from "@/app/marketPlace/page.module.css";

export default function Header({ onLoginClick }) {
  return (
    <div className={style.title_Box}>
      <input placeholder="검색" className={style.filterInputMobile} />
      <p className={style.title_Text}>마켓플레이스</p>
      <button onClick={onLoginClick} className={style.title_Button}>
        나의 포토카드 판매
      </button>
    </div>
  );
}
