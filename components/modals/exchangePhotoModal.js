"use client";

import { useState } from "react";
import styles from "./exchangePhotoModal.module.css";
import Image from "next/image";
import Select from "@/components/marketPlace/select/select";
import {
  gradeOption,
  genreOption,
} from "@/components/marketPlace/config/config";
import ExchangeResultModal from "./exchangeResultModal";
import Card from "@/components/marketPlace/card/card";
import CloseIcon from "@/public/icons/ic_close.svg";
import SearchIcon from "@/public/icons/ic_search.svg";

const cards = [
  {
    id: "a1",
    title: "전설의 용사",
    grade: "legendary",
    writer: "홍길동",
    kind: "캐릭터",
    amount: 3,
    price: 1000,
  },
  {
    id: "a2",
    title: "빛의 정령",
    grade: "rare",
    writer: "이몽룡",
    kind: "캐릭터",
    amount: 2,
    price: 500,
  },
  {
    id: "a3",
    title: "어둠의 숲",
    grade: "super_rare",
    writer: "성춘향",
    kind: "배경",
    amount: 1,
    price: 1200,
  },
  {
    id: "a4",
    title: "현실주의 고양이",
    grade: "common",
    writer: "최길동",
    kind: "캐릭터",
    amount: 5,
    price: 300,
  },
  {
    id: "a5",
    title: "추상적 감정",
    grade: "etc",
    writer: "임꺽정",
    kind: "기타",
    amount: 0,
    price: 900,
  },
];

export default function ExchangePhotoModal({ onClose }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [exchangeMemo, setExchangeMemo] = useState("");

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleBack = () => {
    setSelectedCard(null);
  };

  const handleConfirm = () => {
    setShowResultModal(true);
  };

  return (
    <>
      {!showResultModal ? (
        <div className={styles.overlay} onClick={onClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h1 className={styles.header}>
              {selectedCard ? "포토카드 교환하기" : "마이갤러리"}
            </h1>
            <button className={styles.closeButton} onClick={onClose}>
              <Image src={CloseIcon} alt="Close" width={32} height={32} />
            </button>
            <div className={styles.titleArea}>
              <h2 className={styles.titleTxt}>
                {selectedCard ? `${selectedCard.title}` : "포토카드 교환하기"}
              </h2>
            </div>

            <div className={styles.contentArea}>
              {!selectedCard ? (
                <>
                  <div className={styles.searchArea}>
                    <div className={styles.searchWrap}>
                      <input
                        type="text"
                        placeholder="검색"
                        className={styles.searchInput}
                      />
                      <Image
                        src={SearchIcon}
                        alt="Search"
                        className={styles.searchIcon}
                        width={24}
                        height={24}
                      />
                    </div>
                    <div className={styles.filterBox}>
                      <Select
                        option={gradeOption}
                        name={"등급"}
                        onChange={(val) => console.log("등급 선택:", val)}
                      />
                      <Select
                        option={genreOption}
                        name={"장르"}
                        onChange={(val) => console.log("장르 선택:", val)}
                      />
                    </div>
                  </div>

                  <div className={styles.cardList}>
                    {cards.map((card) => (
                      <div
                        className={styles.cardItem}
                        key={card.id}
                        onClick={() => handleCardClick(card)}
                      >
                        <Card {...card} />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className={styles.detailContainer}>
                  <div className={styles.aboutPhoto}>
                    <div className={styles.cardImage}>
                      <Card {...selectedCard} />
                    </div>
                    <div className={styles.cardInfo}>
                      <div className={styles.exchangeInput}>
                        <p>교환 제시 내용</p>
                        <textarea
                          placeholder="내용을 입력해 주세요"
                          className={styles.memo}
                          value={exchangeMemo}
                          onChange={(e) => setExchangeMemo(e.target.value)}
                        />
                      </div>
                      <div className={styles.btnArea}>
                        <button
                          className={styles.cancelBtn}
                          onClick={handleBack}
                        >
                          취소하기
                        </button>
                        <button
                          className={styles.confirmBtn}
                          onClick={handleConfirm}
                        >
                          교환하기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <ExchangeResultModal
          isSuccess={true}
          onClose={() => {
            setShowResultModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
