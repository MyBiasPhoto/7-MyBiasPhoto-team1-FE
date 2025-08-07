"use client";

import Image from "next/image";
import cardImage from "../../../../public/assets/cardImage.png";
import style from "./edit.module.css";
import CustomInput from "../../customInput/customInput.js";
import { useEffect, useState } from "react";
import EditTrade from "@/components/marketPlace/edit/area/editTrade";
import Modal from "@/components/modals/editPhotoModal";
export default function Edit({ sale }) {
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(sale?.photoCard?.initialPrice * count);
  const [isModal, setIsModal] = useState(false);

  const handleCancel = () => {
    setIsModal(false);
  };

  useEffect(() => {
    setTotal(sale?.photoCard.initialPrice * count);
  }, [count, sale]);
  if (!sale) return;
  if (!total) return;
  return (
    <div>
      {console.log(sale.photoCard.grade)}
      <div>
        {/* 타이틀 */}
        <p className={style.TitleFont}>마켓플레이스</p>
      </div>
      <div>
        {/* 마켓플레이스 */}
        <div className={style.Title}>
          <p>{sale.photoCard.name || "우리집 앞마당"}</p>
        </div>
        <div className={style.Content}>
          <div>
            {/* 왼쪽이미지 */}
            <Image
              src={sale?.photoCard?.imageUrl || cardImage}
              width={500}
              height={500}
              alt={"임시사진"}
              className={style.ContentImg}
            ></Image>
          </div>
          <div className={style.ContentRight}>
            {/* 오른쪽 정보들 */}
            <div className={style.ContentHeader}>
              {/* 등급 태그 제작자 */}
              <div className={style.ContentHeaderTags}>
                <p
                  className={`${style.ContentHeaderGrade} ${
                    style[sale.photoCard.grade.toLowerCase()]
                  }`}
                >
                  {sale.photoCard.grade || "등급"}
                </p>
                <div className={style.Line}></div>
                <p className={style.ContentHeaderTag}>
                  {sale?.photoCard?.genre || "타입"}
                </p>
              </div>
              <div>
                <p className={style.ContentHeaderWriter}>
                  {sale.seller.nickname || "제작자"}
                </p>
              </div>
            </div>
            <div>
              {/* 설명 */}
              <p className={style.descripiton}>
                {sale.photoCard.description || "설명"}
              </p>
            </div>
            <div className={style.info}>
              {/* 가격 잔여 */}
              <div className={style.infoPrice}>
                <p>가격</p>
                <div className={style.infoPriceDetail}>
                  <p>{sale.photoCard.initialPrice || "10"}</p>
                  <p>P</p>
                </div>
              </div>
              <div className={style.infoAmount}>
                <p>잔여</p>
                <div className={style.infoAmountDetail}>
                  <p className={style.infoAmountDetailNumber}>
                    {sale.quantity || "10"}
                  </p>
                  <p>/{sale.initialQuantity}</p>
                </div>
              </div>
            </div>
            <div className={style.subInfo}>
              <div>
                <EditTrade sale={sale} />
              </div>
            </div>
            <div className={style.buyButtonBox}>
              <button
                onClick={() => setIsModal(true)}
                className={style.buyButton}
              >
                수정하기
              </button>
              <button className={style.deleteButton}>판매 내리기</button>
            </div>
          </div>
        </div>
      </div>
      {isModal && <Modal onClose={handleCancel} />}
    </div>
  );
}
