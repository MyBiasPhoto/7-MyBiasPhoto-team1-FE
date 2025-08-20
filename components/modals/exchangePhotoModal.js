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
import { getUserCardOnIdle } from "@/utils/api/getUserCardOnIdle";
import { createExchangeProposal } from "@/utils/api/exchange";
import ModalState from "@/components/modals/state/ModalState";
import galleryStyle from "@/app/myGallery/page.module.css";
import FilterBartwo from "@/components/common/FilterBar2";
import useGalleryFilters from "@/hooks/useMyGalleryFilters";

function noop() {}

export default function ExchangePhotoModal(props) {
  const { saleId, onClose = noop, onSuccess = noop } = props;

  const { state: filters, dispatch } = useGalleryFilters({
    selectedOptionType: "grade",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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
  const [modalState, setModalState] = useState({ status: "idle", error: "" });

  async function fetchCards() {
    setModalState({ status: "loading", error: "" });
    try {
      const res = await getUserCardOnIdle({
        page: 1,
        search: search || "",
        grade: listGrade?.value,
        genre: listKind?.value,
        search: filters.search || "",
        grade: filters.grade?.value,
        genre: filters.genre?.value,
      });

      const list = Array.isArray(res?.MyGalleryList) ? res.MyGalleryList : [];

      // 필요 필드 표준화
      const formattedCards = list.map((card) => ({
        // new
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
      setModalState({
        status: formattedCards.length ? "success" : "empty",
        error: "",
      }); // new
    } catch (e) {
      console.error("마이갤러리 조회 실패:", e);
      setCards([]);
      setModalState({
        status: "error",
        error: e?.message || "목록을 불러오지 못했습니다.",
      }); // new
    }
  }

  // useEffect(
  //   function () {
  //     fetchCards();
  //   },
  //   [search, listGrade, listKind]
  // );

  useEffect(() => {
    fetchCards();
  }, [filters.search, filters.grade, filters.genre]);

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

    // 1) saleId 누락
    if (!saleId) {
      setResultPayload({
        isSuccess: false,
        message:
          "필수 정보가 누락되었습니다. (saleId 없음) 페이지를 새로고침 후 다시 시도해 주세요.",
      });
      setShowResultModal(true);
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

      if (res && res.data) {
        try {
          onSuccess(res.data);
        } catch (_e) {
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
      setShowResultModal(true);
    }
  }

  function handleResultClose() {
    setShowResultModal(false);
    onClose();
  }

  // ====== 렌더링 헬퍼 ======
  function renderCard(card) {
    return (
      <div
        className={styles.cardItem}
        key={card.userCardId}
        onClick={handleSelectCard.bind(null, card)}
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

  const { state: filters, dispatch } = useGalleryFilters({
    selectedOptionType: "grade",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  return (
    <>
      {!showResultModal ? (
        <div className={styles.overlay} onClick={onClose}>
          <div
            className={`${styles.modal} ${selectedCard ? styles.detail : ""}`}
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
          >
            <div className={styles.modalWrap}>
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
                        onClick={() => setIsFilterModalOpen((prev) => !prev)}
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
                    {/* ★ MyGallery 모바일 필터 형식으로 교체 */}
                    <div
                      className={`${galleryStyle.MobileModal} ${
                        showMobileFilter ? galleryStyle.show : ""
                      }`}
                    >
                      <div className={galleryStyle.MobileModalTitle}>
                        <p>필터</p>
                        <p
                          className={galleryStyle.close}
                          onClick={() => setShowMobileFilter(false)}
                        >
                          x
                        </p>
                      </div>
                      <FilterBartwo
                        filters={filters}
                        dispatch={dispatch}
                        onClose={() => setIsFilterModalOpen(false)}
                        onChangeGrade={(val) => setListGrade(val)}
                        onChangeGenre={(val) => setListKind(val)}
                        onChangeSearch={(val) => setSearch(val)}
                      />
                    </div>
                    <div className={styles.cardList}>
                      {modalState.status !== "success" ? (
                        <ModalState
                          status={modalState.status}
                          error={modalState.error}
                          onRetry={fetchCards}
                          loadingText="포토카드 불러오는 중 …"
                          emptyText="마이갤러리가 비어 있습니다!"
                          errorText="에러!"
                          height={240}
                          emptyActionText="포토카드 생성하러 가기"
                          emptyActionHref="/myGallery"
                        />
                      ) : (
                        cards.map((card) => (
                          <div
                            className={styles.cardItem}
                            key={card.userCardId}
                            onClick={() => handleCardClick(card)}
                          >
                            <ModalCard {...card} />
                          </div>
                        ))
                      )}
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
