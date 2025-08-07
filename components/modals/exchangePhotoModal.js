"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./exchangePhotoModal.module.css";
import Image from "next/image";
import Select from "@/components/marketPlace/select/select";
import {
  gradeOption,
  genreOption,
} from "@/components/marketPlace/config/config";
import ExchangeResultModal from "./exchangeResultModal";
import ModalCard from "./card/ModalCard";
import CloseIcon from "@/public/icons/ic_close.svg";
import SearchIcon from "@/public/icons/ic_search.svg";

export default function ExchangePhotoModal({ onClose }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [listGrade, setListGrade] = useState("");
  const [listKind, setListKind] = useState("");
  const [exchangeMemo, setExchangeMemo] = useState("");
  const [cardDrafts, setCardDrafts] = useState({});
  const modalRef = useRef(null);
  const dragStartY = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const fetchCards = async () => {
    try {
      const res = await axios.get("http://localhost:4000/sales", {
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
    setExchangeMemo(draft.exchangeMemo || "");
  }

  useEffect(() => {
    if (!selectedCard) return;

    setCardDrafts((prev) => ({
      ...prev,
      [selectedCard.saleId]: {
        exchangeMemo,
      },
    }));
  }, [exchangeMemo, selectedCard]);

  function handleBack() {
    setSelectedCard(null);
  }

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

  const handleTouchStart = (e) => {
    dragStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diffY = currentY - dragStartY.current;
    if (diffY > 0) {
      setDragOffset(diffY);
      modalRef.current.style.transform = `translateY(${diffY}px)`;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (dragOffset > 150) {
      modalRef.current.style.transition = "transform 0.3s ease-out";
      modalRef.current.style.transform = `translateY(100vh)`;

      setTimeout(() => {
        onClose();
        setDragOffset(0);
      }, 300);
    } else {
      modalRef.current.style.transition = "transform 0.2s ease-out";
      modalRef.current.style.transform = "translateY(0px)";
      setDragOffset(0);
    }
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
      {!showResultModal ? (
        <div className={styles.overlay} onClick={onClose}>
          <div
            className={`${styles.modal} ${selectedCard ? styles.detail : ""}`}
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
          >
            <div
              className={styles.dragBar}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            ></div>
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
                        <ModalCard {...card} />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className={styles.detailContainer}>
                  <div className={styles.aboutPhoto}>
                    <div className={styles.cardImage}>
                      <ModalCard {...selectedCard} />
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
