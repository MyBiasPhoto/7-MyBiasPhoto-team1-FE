"use client";

import Image from "next/image";
import cardImage from "../../../../public/assets/cardImage.png";
import style from "./buy.module.css";
import CustomInput from "../../customInput/customInput.js";
import { useEffect, useState } from "react";
import PurchasePhotoModal from "@/components/modals/purchasePhotoModal.js";
import LoginModal from "@/components/modals/loginModal.js";
import api from "@/lib/axiosAuth.js";
export default function Buy({ sale }) {
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(sale?.price * count);
  const [isModal, setIsModal] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  async function fetchMe() {
    try {
      const res = await api.get("/users/me", { _auth: true });
      const data = res?.data ?? null;
      return !!data?.me?.id;
    } catch (err) {
      // 취소 등 특수 케이스는 false 처리(기존과 동일)
      if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") return false;
      return false;
    }
  }

  // axios 도입전
  // async function fetchMe() {
  //   try {
  //     const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  //     const res = await fetch(`${baseUrl}/users/me`, {
  //       credentials: "include",
  //     });
  //     const data = await res.json().catch(() => null);
  //     return !!data?.me?.id;
  //   } catch {
  //     return false;
  //   }
  // }

  async function handleBuyClick() {
    const isLoggedIn = await fetchMe();
    if (isLoggedIn) {
      setIsModal(true); // 기존 구매 모달 열기
    } else {
      setIsLoginOpen(true); // 로그인 모달 열기
    }
  }

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
                    {sale.quantity || "0"}
                  </p>
                  <p>/{sale.initialQuantity}</p>
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
              <button onClick={handleBuyClick} className={style.buyButton}>
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
        {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
      </div>
    </div>
  );
}
