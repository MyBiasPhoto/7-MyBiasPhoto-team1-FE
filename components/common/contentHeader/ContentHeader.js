import style from "./ContentHeader.module.css";

export default function ContentHeader({ pageTitle }) {
  return (
    <div className={style.titleBox}>
      <p className={style.titleText}>{pageTitle}</p>
    </div>
  );
}
