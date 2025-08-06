// components/common/PageHeader/PageHeader.js
import styles from "./PageHeader.module.css";

export default function PageHeader({
  title,
  placeholder = "검색",
  buttonLabel,
  onButtonClick,
}) {
  return (
    <div className={styles.title_Box}>
      <input placeholder={placeholder} className={styles.filterInputMobile} />
      <p className={styles.title_Text}>{title}</p>
      {buttonLabel && (
        <button onClick={onButtonClick} className={styles.title_Button}>
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
