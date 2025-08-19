// 비동기방식 x 일반적인 클라이언트 컴포넌트

import { useState, useEffect, useRef } from "react";
import iconDown from "../../../public/icons/ic_down.svg";
import Image from "next/image";
import style from "./select.module.css";
import React, { memo } from "react";

function Select({ name, option, onChange, defaultOption }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectName, setSelectName] = useState();
  const ref = useRef(null);

  const toggleOpen = () => setIsOpen(prev => !prev);

  const handleSelect = (value, e) => {
    e.stopPropagation();
    setSelectName(value);
    onChange(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const finalOptions = defaultOption ? [defaultOption, ...option] : option;

  return (
    <div className={style.selectContainer} ref={ref}>
      <div className={style.selectBox} onClick={toggleOpen}>
        <p
          className={style.selectBoxFont}
          style={{ "--selected-color": selectName?.color || "var(--white)" }}
        >
          {selectName?.label || name}
        </p>
        <Image
          className={style.selectIcon}
          src={iconDown}
          hegiht={20}
          width={20}
          alt="아이콘"
        />
        {isOpen && (
          <div className={style.modal}>
            {finalOptions.map(opt => (
              <div
                className={style.modalEvent}
                key={opt.value}
                onClick={e => handleSelect(opt, e)}
                style={{ ["--opt-color"]: opt.color || "var(--white)" }}
              >
                <p className={style.madalText}>{opt.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(Select);
