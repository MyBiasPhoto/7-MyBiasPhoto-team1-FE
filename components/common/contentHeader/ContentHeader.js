import style from "./ContentHeader.module.css";

export default function ContentHeader({ pageTitle, onClick, button }) {
  return (
    <div className={style.titleBox}>
      <p className={style.titleText}>{pageTitle}</p>
      {onClick && (
        <button onClick={onClick} className={style.titleButton}>
          {button}
        </button>
      )}
    </div>
  );
}
