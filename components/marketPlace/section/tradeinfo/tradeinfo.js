"use client";

import { useState } from "react";
import style from "./tradeinfo.module.css";
import ExchangePhotoModal from "@/components/modals/exchangePhotoModal.js";
import LoginModal from "@/components/modals/loginModal.js";
import api from "@/lib/axiosAuth.js";
export default function TradeInfo({ sale }) {
  const [isModal, setIsModal] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  function openModal() {
    setIsModal(true);
  }

  function closeModal() {
    setIsModal(false);
  }

  function handleProposalCreated(newProposal) {
    try {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("exchange:created", {
            detail: newProposal,
          })
        );
      }
    } catch (e) {
      console.warn("exchange:created 이벤트 발행 실패:", e);
    }
  }

  function getDesiredGradeKey() {
    if (sale && typeof sale.desiredGrade === "string") {
      return sale.desiredGrade.toLowerCase();
    }
    return "";
  }

  async function fetchMe() {
    try {
      const res = await api.get("/users/me", { _auth: true });
      const data = res?.data ?? null;
      return !!(data && data.me && data.me.id);
    } catch (e) {
      if (axios.isAxiosError(e) && e.code === "ERR_CANCELED") return false;
      return false;
    }
  }

  // axios 도입전
  // function fetchMe() {
  //   return (async function () {
  //     try {
  //       const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  //       const res = await fetch(`${baseUrl}/users/me`, {
  //         credentials: "include",
  //       });
  //       const data = await res.json().catch(function () {
  //         return null;
  //       });
  //       return !!(data && data.me && data.me.id);
  //     } catch (e) {
  //       return false;
  //     }
  //   })();
  // }

  function handleTradeClick() {
    (async function () {
      const isLoggedIn = await fetchMe();
      if (isLoggedIn) {
        setIsModal(true);
      } else {
        setIsLoginOpen(true);
      }
    })();
  }

  return (
    <div className={style.Container}>
      <div className={style.title}>
        <p className={style.titleFont}>교환 희망 정보</p>
        <button onClick={handleTradeClick} className={style.titleButton}>
          포토카드 교환하기
        </button>
      </div>
      <div className={style.Content}>
        <p className={style.ContentFont}>{sale?.desiredDesc}</p>
        <div className={style.ContentTagBox}>
          {/* 태그들 */}
          <p className={`${style[getDesiredGradeKey()] || ""}`}>
            {sale?.desiredGrade}
          </p>
          <div className={style.Line}></div>
          <p className={style.Type}>{sale?.desiredGenre}</p>
        </div>
      </div>
      <button onClick={handleTradeClick} className={style.MobileButton}>
        포토카드 교환하기
      </button>
      {isModal && (
        <ExchangePhotoModal
          saleId={sale?.id}
          onClose={closeModal}
          onSuccess={handleProposalCreated}
        />
      )}
      {isLoginOpen && (
        <LoginModal
          onClose={function () {
            setIsLoginOpen(false);
          }}
        />
      )}
    </div>
  );
}
