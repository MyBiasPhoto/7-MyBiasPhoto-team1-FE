"use client";

import Image from "next/image";
import cardImage from "../../../../public/assets/cardImage.png";
import style from "./buy.module.css";
import CustomInput from "../../customInput/customInput.js";
import { useEffect, useState } from "react";
import PurchasePhotoModal from "@/components/modals/purchasePhotoModal.js";
export default function Buy({ sale }) {
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(sale?.price * count);
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    setTotal(sale?.price * count);
  }, [count, sale]);
  if (!sale) return;
  if (!total) return;
  return (
    <div>
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
                  <p>{sale.price || "10"}</p>
                  <p>P</p>
                </div>
              </div>
              <div className={style.infoAmount}>
                <p>잔여</p>
                <div className={style.infoAmountDetail}>
                  <p className={style.infoAmountDetailNumber}>
                    {sale.initialQuantity || "0"}
                  </p>
                  <p>/{sale.photoCard.totalQuantity}</p>
                </div>
              </div>
            </div>
            <div className={style.subInfo}>
              {/* 구매수량 총 가격 */}
              <div className={style.infoBuyCount}>
                <p>구매수량</p>
                <div>
                  <CustomInput
                    sale={sale}
                    count={count}
                    setCount={setCount}
                  ></CustomInput>
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
              <button
                onClick={() => {
                  setIsModal(true);
                }}
                className={style.buyButton}
              >
                포토카드 구매하기
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        {isModal && (
          <PurchasePhotoModal
            saleId={sale.id} // saleId 추가 - KJS
            cardGrade={sale.photoCard.grade}
            cardTitle={sale.photoCard.name}
            purchaseCount={count}
            cardPrice={sale.photoCard.initialPrice}
            onClose={() => setIsModal(false)}
          />
        )}
      </div>
    </div>
  );
}
