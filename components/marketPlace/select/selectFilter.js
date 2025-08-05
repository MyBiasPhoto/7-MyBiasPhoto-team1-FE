// 비동기방식 x 일반적인 클라이언트 컴포넌트

import { useState } from "react";
import iconDown from "../../../public/icons/ic_down.svg";
import Image from "next/image";
import style from "./select.module.css";

export default function SelectFilter({ name, option, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectName, setSelectName] = useState();

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleSelect = (value, e) => {
    e.stopPropagation();
    setSelectName(value);
    onChange(value);
    setIsOpen(false);
  };
  return (
    <div className={style.selectContainerFilter}>
      <div className={style.selectBox} onClick={toggleOpen}>
        <p className={style.selectBoxFont}>{selectName?.label || name}</p>
        <Image
          className={style.selectIcon}
          src={iconDown}
          hegiht={20}
          width={20}
          alt="아이콘"
        />
        {isOpen && (
          <div className={style.modalFilter}>
            {option.map((opt) => (
              <div key={opt.value} onClick={(e) => handleSelect(opt, e)}>
                <p className={style.selectBoxFont}>{opt.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
