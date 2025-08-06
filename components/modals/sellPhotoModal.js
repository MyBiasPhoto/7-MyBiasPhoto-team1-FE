"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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

export default function SellPhotoModal({ onClose }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState(1);
  const [price, setPrice] = useState("");
  const [listGrade, setListGrade] = useState(""); // 카드 리스트 나오는 외부? 모달 필터 용
  const [listKind, setListKind] = useState(""); // 위와 동일
  const [grade, setGrade] = useState(""); // 상세 모달
  const [kind, setKind] = useState(""); // 상세 모달
  const [exchangeMemo, setExchangeMemo] = useState("");
  const [cardDrafts, setCardDrafts] = useState({});

  const fetchCards = async () => {
    try {
      const res = await axios.get("http://localhost:3000/sales", {
        params: {
          page: 1,
          pageSize: 20,
          includeSoldOut: "true",
          search: search || "",
          orderBy: "newest",
          grade: listGrade ? gradeMap[listGrade] : undefined,
          genre: listKind ? genreMap[listKind] : undefined,
        },
      });

      setCards(res.data.sales);
    } catch (error) {
      console.error("판매 리스트 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [search, listGrade, listKind]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  function handleCardClick(card) {
    const formattedCard = {
      ...card,
      title: card.name,
      writer: card.sellerNickname,
      kind: card.genre,
      amount: card.quantity,
    };

    setSelectedCard(formattedCard);

    const draft = cardDrafts[card.saleId] || {};
    setAmount(draft.amount || 1);
    setPrice(draft.price || "");
    setGrade(draft.grade || "");
    setKind(draft.kind || "");
    setExchangeMemo(draft.exchangeMemo || "");
  }

  useEffect(() => {
    if (!selectedCard) return;

    setCardDrafts((prev) => ({
      ...prev,
      [selectedCard.saleId]: {
        amount,
        price,
        grade,
        kind,
        exchangeMemo,
      },
    }));
  }, [amount, price, grade, kind, exchangeMemo, selectedCard]);

  function handleBack() {
    setSelectedCard(null);
  }

  //취소하기 말고 esc로 돌아가기
  useEffect(() => {
    if (!selectedCard) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCard]);

  function handleConfirm() {
    setShowResultModal({
      show: true,
      cardTitle: selectedCard?.title,
      cardGrade: selectedCard?.grade,
      userCardCount: 0,
      currentCardTotal: 0,
    });

    setCardDrafts({});
  }

  function handleCloseModal() {
    setShowResultModal({ show: false });
    setCardDrafts({});
    onClose();
  }

  const increaseAmount = () => {
    if (amount < selectedCard.amount) setAmount(amount + 1);
  };

  const decreaseAmount = () => {
    if (amount > 1) setAmount(amount - 1);
  };

  const gradeClassMap = {
    COMMON: styles.common,
    RARE: styles.rare,
    "SUPER RARE": styles["super_rare"],
    LEGENDARY: styles.legendary,
    ETC: styles.etc,
  };

  const gradeMap = {
    common: "COMMON",
    rare: "RARE",
    super_rare: "SUPER RARE",
    legendary: "LEGENDARY",
  };

  const genreMap = {
    album: "앨범",
    special: "특전",
    fan: "팬싸",
    season: "시즌그리팅",
    meet: "팬미팅",
    concert: "콘서트",
    md: "MD",
    collab: "콜라보",
    club: "팬클럽",
    etc: "기타",
  };

  return (
    <>
      {showResultModal.show ? (
        <SellResultModal
          cardTitle={showResultModal.cardTitle}
          cardGrade={showResultModal.cardGrade}
          userCardCount={showResultModal.userCardCount}
          currentCardTotal={showResultModal.currentCardTotal}
          onClose={() => {
            setShowResultModal({ show: false });
            onClose();
          }}
        />
      ) : (
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
                        value={search}
                        onChange={handleSearchChange}
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
                        onChange={(val) => setListGrade(val)}
                      />
                      <Select
                        option={genreOption}
                        name={"장르"}
                        onChange={(val) => setListKind(val)}
                      />
                    </div>
                  </div>

                  <div className={styles.cardList}>
                    {cards.map((card) => (
                      <div
                        className={styles.cardItem}
                        key={card.saleId}
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
                        src={selectedCard.imageUrl || cardImage}
                        alt="선택된 카드 이미지"
                        className={styles.responsiveImage}
                        width={360}
                        height={270}
                      />
                    </div>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardSubTitle}>
                        <div className={styles.cardSubTitleBox}>
                          <p className={gradeClassMap[selectedCard?.grade]}>
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
                              <option value="album">앨범</option>
                              <option value="special">특전</option>
                              <option value="fan">팬싸</option>
                              <option value="season">시즌그리팅</option>
                              <option value="meet">팬미팅</option>
                              <option value="concert">콘서트</option>
                              <option value="md">MD</option>
                              <option value="collab">콜라보</option>
                              <option value="club">팬클럽</option>
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
      )}
    </>
  );
}
