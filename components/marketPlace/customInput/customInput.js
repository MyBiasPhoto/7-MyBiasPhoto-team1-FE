"use client";
import style from "./CustomInput.module.css";
import Image from "next/image";
import down from "@/public/icons/ic_-.svg";
import up from "@/public/icons/ic_+.svg";
import { useEffect, useState } from "react";
export default function CustomInput({ count, setCount }) {
  const handlePClick = () => {
    setCount(count + 1);
  };

  const handleMClick = () => {
    if (count <= 1) return;
    setCount(count - 1);
  };
  useEffect(() => {}, []);
  return (
    <div className={style.Container}>
      <div className={style.box}>
        <div
          className={style.box_m}
          onClick={() => {
            handleMClick();
          }}
        >
          <Image src={down} height={24} width={24} alt="-"></Image>
        </div>
        <div>
          <p className={style.boxFont}>{count || 1}</p>
        </div>
        <div
          className={style.box_p}
          onClick={() => {
            handlePClick();
          }}
        >
          <Image src={up} height={24} width={24} alt="+"></Image>
        </div>
      </div>
    </div>
  );
}
