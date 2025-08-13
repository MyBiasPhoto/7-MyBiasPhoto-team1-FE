"use client";
import up from "@/public/icons/ic_+.svg";
import down from "@/public/icons/ic_-.svg";
import Image from "next/image";
import { useEffect } from "react";
import style from "./customInput.module.css";
export default function CustomInput({ sale, count, setCount }) {
  const handlePClick = () => {
    if (count >= sale.quantity) return;
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
