"use client";

import Image from "next/image";
import cardImage from "../../../../public/assets/cardImage.png";
import style from "./buy.module.css";
import CustomInput from "../../customInput/customInput.js";
import { useEffect, useState } from "react";
export default function Buy() {
  const title = "우리집 앞마당";
  const grade = "레전드리";
  const tags = "풍경";
  const writer = "미쓰 쏜";
  const descripiton =
    "설명명명명명명명명명명명명명명설명명명명명명명명명명명명명명명명명명명명명명명명명명명명명명명명명명명명명명명명명명";
  const price = "10";
  const amount = "1";
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(price * count);

  useEffect(() => {
    setTotal(price * count);
  }, [count]);
  return (
    <div>
      <div>
        {/* 타이틀 */}
        <p className={style.TitleFont}>마켓플레이스</p>
      </div>
      <div>
        {/* 마켓플레이스 */}
        <div className={style.Title}>
          <p>{title || "우리집 앞마당"}</p>
        </div>
        <div className={style.Content}>
          <div>
            {/* 왼쪽이미지 */}
            <Image
              src={cardImage}
              alt={"임시사진"}
              className={style.ContentImg}
            ></Image>
          </div>
          <div className={style.ContentRight}>
            {/* 오른쪽 정보들 */}
            <div className={style.ContentHeader}>
              {/* 등급 태그 제작자 */}
              <div className={style.ContentHeaderTags}>
                <p className={style.ContentHeaderGrade}>
                  {grade || "레전드리"}
                </p>
                <div className={style.Line}></div>
                <p className={style.ContentHeaderTag}>{tags || "풍경"}</p>
              </div>
              <div>
                <p className={style.ContentHeaderWriter}>
                  {writer || "미쓰손"}
                </p>
              </div>
            </div>
            <div>
              {/* 설명 */}
              <p className={style.descripiton}>
                {descripiton ||
                  "어쩌주저쩌군ㅁ암나어무무모ㅓ부므ㅝ브므므므므ㅡ므므므ㅡ."}
              </p>
            </div>
            <div className={style.info}>
              {/* 가격 잔여 */}
              <div className={style.infoPrice}>
                <p>가격</p>
                <div className={style.infoPriceDetail}>
                  <p>{price || "10"}</p>
                  <p>P</p>
                </div>
              </div>
              <div className={style.infoAmount}>
                <p>잔여</p>
                <div className={style.infoAmountDetail}>
                  <p className={style.infoAmountDetailNumber}>
                    {amount || "10"}
                  </p>
                  <p>/5</p>
                </div>
              </div>
            </div>
            <div className={style.subInfo}>
              {/* 구매수량 총 가격 */}
              <div className={style.infoBuyCount}>
                <p>구매수량</p>
                <div>
                  <CustomInput count={count} setCount={setCount}></CustomInput>
                  {/* 커스텀으로바꿀예정 */}
                </div>
              </div>
              <div className={style.infoTotal}>
                <p>총 가격</p>
                <div className={style.infoTotalPrice}>
                  {/* amount * 인풋저거 커스텀 결과값 */}
                  <p>{total}</p>
                  <p>P</p>
                  <p className={style.infoTotalPriceDetail}>{`(${count}장)`}</p>
                </div>
              </div>
            </div>
            <div className={style.buyButtonBox}>
              <button className={style.buyButton}>포토카드 구매하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
