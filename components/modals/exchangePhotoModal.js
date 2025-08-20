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
import FilterBartwo from "@/components/common/FilterBar2";
import galleryStyle from "@/app/myGallery/page.module.css";

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
  const [modalState, setModalState] = useState({ status: "idle", error: "" });

  // 로컬 상태를 FilterBartwo 인터페이스로 매핑
  function getFilterProxy() {
    return { search, grade: listGrade, genre: listKind };
  }

  // FilterBartwo가 던지는 액션을 로컬 setState로 변환
  function filterDispatch(action) {
    switch (action?.type) {
      case "SET_SEARCH":
        setSearch(action.payload ?? "");
        break;
      case "SET_GRADE":
        setListGrade(action.payload ?? "");
        break;
      case "SET_GENRE":
        setListKind(action.payload ?? "");
        break;
      case "RESET":
        setSearch("");
        setListGrade("");
        setListKind("");
        break;
      default:
        break;
    }
  }

  function pickValue(v) {
    if (v == null) return "";
    return typeof v === "object" ? v.value ?? "" : String(v);
  }

  async function fetchCards() {
    setModalState({ status: "loading", error: "" });
    try {
      const params = { page: 1 };
      if (search && search.trim()) params.search = search.trim();
      const g = pickValue(listGrade);
      if (g) params.grade = g; // 값이 있을 때만 전송
      const ge = pickValue(listKind);
      if (ge) params.genre = ge; // 값이 있을 때만 전송

      const res = await getUserCardOnIdle(params);

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

  const fetchDebounceRef = useRef(null);

  useEffect(
    function () {
      if (fetchDebounceRef.current) clearTimeout(fetchDebounceRef.current);
      fetchDebounceRef.current = setTimeout(function () {
        fetchCards();
      }, 250);
      return function () {
        if (fetchDebounceRef.current) clearTimeout(fetchDebounceRef.current);
      };
    },
    [search, listGrade, listKind]
  );

  // FIX: dispatch 제거, 로컬 setSearch 사용
  function handleSearchChange(e) {
    setSearch(e.target.value);
  }

  // 선택 핸들러(일반 함수 선언)
  function handleDesktopGradeChange(opt) {
    setListGrade(opt);
  }
  function handleDesktopGenreChange(opt) {
    setListKind(opt);
  }

  function toggleFilterModal() {
    setShowMobileFilter(function (prev) {
      return !prev;
    });
  }
  function openMobileFilter() {
    setShowMobileFilter(true);
  }
  function closeMobileFilter() {
    setShowMobileFilter(false);
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
        onClick={handleCardClick.bind(null, card)}
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
                        onClick={function () {
                          setShowMobileFilter(true);
                        }}
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
                          onChange={handleDesktopGradeChange}
                        />
                        <Select
                          option={genreOption}
                          name={"장르"}
                          onChange={handleDesktopGenreChange}
                        />
                      </div>
                    </div>
                    <div
                      className={`${galleryStyle.MobileModal} ${
                        showMobileFilter ? galleryStyle.show : ""
                      }`}
                    >
                      <div className={galleryStyle.MobileModalTitle}>
                        <div />
                        <p>필터</p>
                        <div
                          className={galleryStyle.modalClose}
                          onClick={function () {
                            setShowMobileFilter(false);
                          }}
                        />
                      </div>
                      <FilterBartwo
                        filters={getFilterProxy()}
                        dispatch={filterDispatch}
                        onClose={closeMobileFilter}
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
                            <ModalCard {...card} variant="grid" />
                          </div>
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <div className={styles.detailContainer}>
                    <div className={styles.aboutPhoto}>
                      <div className={styles.cardImage}>
                        <ModalCard {...selectedCard} variant="detail" />
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
