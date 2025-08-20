// components/common/PageHeader/PageHeader.js
import styles from "./PageHeader.module.css";
import buttonS from "../../../public/icons/ic_filter.svg";
import Image from "next/image";

export default function PageHeader({
  title,
  placeholder = "검색",
  buttonLabel,
  onButtonClick,
  onToggleFilterModal,
}) {
  return (
    <div className={styles.title_Box}>
      <button className={styles.filterBoxTable} onClick={onToggleFilterModal}>
        <Image src={buttonS} height={24} width={24} alt={"버튼"} />
      </button>
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
