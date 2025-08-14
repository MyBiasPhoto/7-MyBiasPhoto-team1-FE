"use client";

import { useState, useEffect, useRef } from "react";
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
import FilterIcon from "@/public/icons/ic_filter.svg";
import { fetchMyGalleryData } from "@/utils/api/myGalleries";
import { createExchangeProposal } from "@/utils/api/exchange";

function noop() {}

export default function ExchangePhotoModal(props) {
  const { saleId, onClose = noop, onSuccess = noop } = props;

  const [selectedCard, setSelectedCard] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultPayload, setResultPayload] = useState({
    isSuccess: false,
    message: "",
  });
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
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function fetchCards() {
    try {
      const res = await fetchMyGalleryData({
        page: 1,
        search: search || "",
        grade: listGrade?.value,
        genre: listKind?.value,
      });

      const list = Array.isArray(res?.MyGalleryList) ? res.MyGalleryList : [];

      // 필요 필드 표준화
      const formattedCards = res.MyGalleryList.map((card) => ({
        userCardId: card.userCardId,
        name: card.name,
        imageUrl: card.imageUrl,
        grade: card.grade,
        genre: card.genre,
        price: card.price ?? 0, // API 값 사용
        quantity: card.count ?? 1, // 현재 수량
        initialQuantity: card.initialQuantity ?? card.count ?? 1, // 초기 수량
        sellerNickname: card.ownerNickName || "나", // 제작자
      }));
      setCards(formattedCards);
    } catch (e) {
      console.error("마이갤러리 조회 실패:", e);
      setCards([]);
    }
  }

  useEffect(
    function () {
      fetchCards();
    },
    [search, listGrade, listKind]
  );

  function handleSearchChange(e) {
    setSearch(e.target.value);
  }

  function handleCardClick(card) {
    const formattedCard = {
      ...card,
      title: card.name,
      writer: card.sellerNickname,
      kind: card.genre,
      amount: card.quantity,
      price: card.price,
      initialQuantity: card.initialQuantity,
    };
    setSelectedCard(formattedCard);

    const draft = cardDrafts[card.userCardId] || {};
    setExchangeMemo(draft.exchangeMemo || "");
  }

  useEffect(
    function () {
      if (!selectedCard) return;
      setCardDrafts(function (prev) {
        return {
          ...prev,
          [selectedCard.userCardId]: { exchangeMemo },
        };
      });
    },
    [exchangeMemo, selectedCard]
  );

  function handleBack() {
    setSelectedCard(null);
  }

  useEffect(
    function () {
      if (!selectedCard) return;
      function handleKeyDown(e) {
        if (e.key === "Escape") handleBack();
      }
      window.addEventListener("keydown", handleKeyDown);
      return function () {
        window.removeEventListener("keydown", handleKeyDown);
      };
    },
    [selectedCard]
  );

  async function handleConfirm(e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    // 디버그: 필수 값 확인
    // console.log("[DEBUG] saleId:", saleId, " selectedCard:", selectedCard);

    // 1) saleId 누락
    if (!saleId) {
      setResultPayload({
        isSuccess: false,
        message:
          "필수 정보가 누락되었습니다. (saleId 없음) 페이지를 새로고침 후 다시 시도해 주세요.",
      });
      setShowResultModal(true); // ← 무조건 결과 모달 표시
      return;
    }

    // 2) 선택한 카드 없음
    if (!selectedCard || !selectedCard.userCardId) {
      setResultPayload({
        isSuccess: false,
        message: "교환에 사용할 카드를 먼저 선택해 주세요.",
      });
      setShowResultModal(true);
      return;
    }

    // 3) 메모 없음
    if (!exchangeMemo || !exchangeMemo.trim()) {
      setResultPayload({
        isSuccess: false,
        message: "교환 제시 내용을 입력해 주세요.",
      });
      setShowResultModal(true);
      return;
    }

    try {
      setSubmitting(true);
      const res = await createExchangeProposal(
        saleId,
        selectedCard.userCardId,
        exchangeMemo.trim()
      );

      // 성공 시 상위에 즉시 반영(상세 하단 목록에 new proposal prepend)
      if (res && res.data) {
        try {
          onSuccess(res.data);
        } catch (_e) {
          // 부모 콜백 오류는 막아줌
          console.warn("onSuccess callback error:", _e);
        }
      }

      setResultPayload({
        isSuccess: true,
        message:
          res && res.message
            ? res.message
            : "포토카드 교환 제시에 성공했습니다!",
      });
    } catch (err) {
      setResultPayload({
        isSuccess: false,
        message: err && err.message ? err.message : "교환 제시에 실패했습니다.",
      });
    } finally {
      setSubmitting(false);
      setShowResultModal(true); // ← 성공/실패 관계없이 항상 결과 모달 오픈
    }
  }

  function handleResultClose() {
    setShowResultModal(false);
    // 결과 모달 닫을 때 본 모달도 같이 닫기
    onClose();
  }

  // ====== 렌더링 헬퍼 (인라인 화살표함수 지양) ======
  function renderCard(card) {
    return (
      <div
        className={styles.cardItem}
        key={card.userCardId}
        onClick={handleSelectCard.bind(null, card)} // 화살표 함수 대신 bind
      >
        <ModalCard
          userCardId={card.userCardId}
          name={card.name}
          imageUrl={card.imageUrl}
          grade={card.grade}
          genre={card.genre}
          quantity={card.quantity}
          initialQuantity={card.initialQuantity}
          price={card.price}
          sellerNickname={card.sellerNickname}
        />
      </div>
    );
  }

  function handleTouchStart(e) {
    dragStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  }

  useEffect(function () {
    document.body.style.overflow = "hidden";
    return function () {
      document.body.style.overflow = "auto";
    };
  }, []);

  function handleTouchMove(e) {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diffY = currentY - dragStartY.current;
    if (diffY > 0) {
      setDragOffset(diffY);
      modalRef.current.style.transform = `translateY(${diffY}px)`;
    }
  }

  function handleTouchEnd() {
    setIsDragging(false);
    if (dragOffset > 150) {
      if (modalRef.current) {
        modalRef.current.style.transition = "transform 0.3s ease-out";
        modalRef.current.style.transform = `translateY(100vh)`;
      }
      setTimeout(function () {
        onClose();
        setDragOffset(0);
      }, 300);
    } else {
      if (modalRef.current) {
        modalRef.current.style.transition = "transform 0.2s ease-out";
        modalRef.current.style.transform = "translateY(0px)";
      }
      setDragOffset(0);
    }
  }

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
                    <button
                      className={styles.filterToggleBtn}
                      onClick={() => setShowMobileFilter((prev) => !prev)}
                    >
                      <Image
                        src={FilterIcon}
                        alt="필터 아이콘"
                        width={24}
                        height={24}
                      />
                    </button>
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
                  {showMobileFilter && (
                    <div className={styles.mobileFilterBox}>
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
                  )}
                  <div className={styles.cardList}>
                    {cards.map((card) => (
                      <div
                        className={styles.cardItem}
                        key={card.userCardId}
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
                          onChange={function (e) {
                            setExchangeMemo(e.target.value);
                          }}
                        />
                      </div>
                      <div className={styles.btnArea}>
                        <button
                          className={styles.cancelBtn}
                          onClick={handleBack}
                          disabled={submitting}
                        >
                          취소하기
                        </button>
                        <button
                          className={styles.confirmBtn}
                          onClick={handleConfirm}
                          disabled={submitting}
                        >
                          {submitting ? "전송 중..." : "교환하기"}
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
          isSuccess={resultPayload.isSuccess}
          message={resultPayload.message}
          onClose={function () {
            setShowResultModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
