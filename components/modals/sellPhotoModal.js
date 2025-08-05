"use client";

import { useState } from "react";
import styles from "./sellPhotoModal.module.css";
import Image from "next/image";
import cardImage from "@/public/assets/cardImage.png";
import Select from "@/components/marketPlace/select/select";
import {
  gradeOption,
  genreOption,
} from "@/components/marketPlace/config/config";
import SellResultModal from "@/components/modals/sellResultModal";
import Card from "@/components/marketPlace/card/card";
import CloseIcon from "@/public/icons/ic_close.svg";
import SearchIcon from "@/public/icons/ic_search.svg";
import MinusIcon from "@/public/icons/ic_-.svg";
import PlusIcon from "@/public/icons/ic_+.svg";
import DownIcon from "@/public/icons/ic_down.svg";

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

export default function SellPhotoModal({ onClose }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [amount, setAmount] = useState(1);
  const [price, setPrice] = useState("");
  const [grade, setGrade] = useState("");
  const [kind, setKind] = useState("");
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

  const increaseAmount = () => {
    if (amount < selectedCard.amount) setAmount(amount + 1);
  };

  const decreaseAmount = () => {
    if (amount > 1) setAmount(amount - 1);
  };

  return (
    <>
      {!showResultModal ? (
        <div className={styles.overlay} onClick={onClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h1 className={styles.header}>
              {selectedCard ? "나의 포토카드 판매하기" : "마이갤러리"}
            </h1>
            <button className={styles.closeButton} onClick={onClose}>
              <Image src={CloseIcon} alt="Close" width={32} height={32} />
            </button>
            <div className={styles.titleArea}>
              <h2 className={styles.titleTxt}>
                {selectedCard
                  ? `${selectedCard.title}`
                  : "나의 포토카드 판매하기"}
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
                      <Image
                        src={cardImage}
                        alt={"임시"}
                        className={styles.responsiveImage}
                      />
                    </div>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardSubTitle}>
                        <div className={styles.cardSubTitleBox}>
                          <p className={`${styles[selectedCard?.grade]}`}>
                            {selectedCard?.grade || "임시등급"}
                          </p>
                          <span className={styles.divider}>|</span>
                          <p className={styles.kind}>
                            {selectedCard?.kind || "임시종류"}
                          </p>
                        </div>
                        <p className={styles.subTitleWriter}>
                          {selectedCard?.writer || "임시제작자"}
                        </p>
                      </div>
                      <div className={styles.saleDetail}>
                        <div className={styles.amountRow}>
                          <label>총 판매 수량</label>
                          <div className={styles.amountControl}>
                            <div className={styles.amountControlBox}>
                              <button
                                onClick={decreaseAmount}
                                className={styles.iconButton}
                              >
                                <Image
                                  src={MinusIcon}
                                  alt="감소"
                                  width={20}
                                  height={20}
                                />
                              </button>
                              <span>{amount}</span>
                              <button
                                onClick={increaseAmount}
                                className={styles.iconButton}
                              >
                                <Image
                                  src={PlusIcon}
                                  alt="증가"
                                  width={20}
                                  height={20}
                                />
                              </button>
                            </div>
                            <div className={styles.amountBox}>
                              <span className={styles.maxAmount}>
                                / {selectedCard.amount}
                              </span>
                              <span className={styles.maxHint}>
                                최대 {selectedCard.amount}장
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.priceRow}>
                          <label>장당 가격</label>
                          <div className={styles.priceInput}>
                            <input
                              type="number"
                              value={price}
                              min="0"
                              onChange={(e) => setPrice(e.target.value)}
                              placeholder="숫자만 입력"
                              className={styles.inputField}
                            />
                            <span className={styles.point}>P</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.exchangeInfo}>
                    <h2 className={styles.exchangeTitle}>교환 희망 정보</h2>
                    <div className={styles.exchangeDetail}>
                      <div className={styles.exchangeFilterArea}>
                        <div className={styles.exchangeFilter}>
                          <div className={styles.filterName}>
                            <p>등급</p>
                          </div>
                          <div className={styles.exchangeFilterBox}>
                            <select
                              className={styles.gradeSelect}
                              value={grade}
                              onChange={(e) => setGrade(e.target.value)}
                            >
                              <option disabled value="">
                                등급을 선택해 주세요
                              </option>
                              <option value="legendary">Legendary</option>
                              <option value="super_rare">Super Rare</option>
                              <option value="rare">Rare</option>
                              <option value="common">Common</option>
                            </select>
                            <Image
                              src={DownIcon}
                              alt="화살표"
                              width={28}
                              height={28}
                              className={styles.selectIcon}
                            />
                          </div>
                        </div>
                        <div className={styles.exchangeFilter}>
                          <div className={styles.filterName}>
                            <p>장르</p>
                          </div>
                          <div className={styles.exchangeFilterBox}>
                            <select
                              className={styles.genreSelect}
                              value={kind}
                              onChange={(e) => setKind(e.target.value)}
                            >
                              <option disabled value="">
                                장르를 선택해 주세요
                              </option>
                              <option value="character">캐릭터</option>
                              <option value="view">풍경</option>
                              <option value="real">실사화</option>
                              <option value="etc">기타</option>
                            </select>
                            <Image
                              src={DownIcon}
                              alt="화살표"
                              width={28}
                              height={28}
                              className={styles.selectIcon}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={styles.exchangeInput}>
                        <p>교환 희망 설명</p>
                        <textarea
                          placeholder="설명을 입력해 주세요"
                          className={styles.memo}
                          value={exchangeMemo}
                          onChange={(e) => setExchangeMemo(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.btnArea}>
                    <button className={styles.cancelBtn} onClick={handleBack}>
                      취소하기
                    </button>
                    <button
                      className={styles.confirmBtn}
                      onClick={handleConfirm}
                    >
                      판매하기
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <SellResultModal
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
