"use client";

import { useReducer } from "react";
import styles from "./editPhotoModal.module.css";
import Image from "next/image";
import cardImage from "@/public/assets/cardImage.png";
import CloseIcon from "@/public/icons/ic_close.svg";
import MinusIcon from "@/public/icons/ic_-.svg";
import PlusIcon from "@/public/icons/ic_+.svg";
import DownIcon from "@/public/icons/ic_down.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatedSale } from "@/utils/api/marketPlace";

const initialState = {
  initialQuantity: 1,
  price: "",
  desiredGrade: "",
  desiredGenre: "",
  desiredDesc: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "INCREASE_QUANTITY":
      return {
        ...state,
        initialQuantity: Math.min(state.initialQuantity + 1, action.max),
      };
    case "DECREASE_QUANTITY":
      return {
        ...state,
        initialQuantity: Math.max(1, state.initialQuantity - 1),
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function EditPhotoModal({ sale, onClose }) {
  const [selectedCard] = [sale]; // sale 그대로 사용
  const [state, dispatch] = useReducer(reducer, initialState);
  const queryClient = useQueryClient();

  const increaseQuantity = () => {
    dispatch({ type: "INCREASE_QUANTITY", max: selectedCard.quantity });
  };

  const decreaseQuantity = () => {
    dispatch({ type: "DECREASE_QUANTITY" });
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: updatedSale,
    onSuccess: () => {
      queryClient.invalidateQueries(["sale", sale.id]);
      alert("수정 완료");
      onClose();
    },
    onError: (error) => {
      console.error("수정 실패", error);
      alert("수정 중 오류가 발생했습니다.");
    },
  });

  const handleConfirm = () => {
    const saleData = {
      id: selectedCard.id,
      data: {
        initialQuantity: state.initialQuantity,
        price: Number(state.price),
        desiredGrade: state.desiredGrade,
        desiredGenre: state.desiredGenre,
        desiredDesc: state.desiredDesc,
      },
    };

    mutate(saleData);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      {console.log("asdasd", selectedCard)}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h1 className={styles.header}>{selectedCard && "수정하기"}</h1>
        <button className={styles.closeButton} onClick={onClose}>
          <Image src={CloseIcon} alt="Close" width={32} height={32} />
        </button>
        <div className={styles.titleArea}>
          <h2 className={styles.titleTxt}>
            {selectedCard && `${selectedCard.photoCard.name}`}
          </h2>
        </div>
        <div className={styles.contentArea}>
          <div className={styles.detailContainer}>
            <div className={styles.aboutPhoto}>
              <div className={styles.cardImage}>
                <Image
                  src={`${selectedCard.photoCard.imageUrl}` || cardImage}
                  alt={"임시"}
                  width={50}
                  quality={100}
                  height={50}
                  className={styles.responsiveImage}
                />
              </div>
              <div className={styles.cardInfo}>
                <div className={styles.cardSubTitle}>
                  <div className={styles.cardSubTitleBox}>
                    <p className={`${styles[selectedCard?.grade]}`}>
                      {selectedCard.photoCard.grade || "임시등급"}
                    </p>
                    <span className={styles.divider}>|</span>
                    <p className={styles.kind}>
                      {selectedCard.photoCard.genre || "임시종류"}
                    </p>
                  </div>
                  <p className={styles.subTitleWriter}>
                    {selectedCard.seller.nickname || "임시제작자"}
                  </p>
                </div>

                <div className={styles.saleDetail}>
                  <div className={styles.amountRow}>
                    <label>총 판매 수량</label>
                    <div className={styles.amountControl}>
                      <div className={styles.amountControlBox}>
                        <button
                          onClick={decreaseQuantity}
                          className={styles.iconButton}
                        >
                          <Image
                            src={MinusIcon}
                            alt="감소"
                            width={20}
                            height={20}
                          />
                        </button>
                        <span>{state.initialQuantity}</span>
                        <button
                          onClick={increaseQuantity}
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
                          / {selectedCard.photoCard.totalQuantity}
                        </span>
                        <span className={styles.maxHint}>
                          최대 {selectedCard.photoCard.totalQuantity}장
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.priceRow}>
                    <label>장당 가격</label>
                    <div className={styles.priceInput}>
                      <input
                        type="number"
                        value={state.price}
                        min="0"
                        onChange={(e) =>
                          dispatch({
                            type: "SET_FIELD",
                            field: "price",
                            value: e.target.value,
                          })
                        }
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
                        value={state.desiredGrade}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_FIELD",
                            field: "desiredGrade",
                            value: e.target.value,
                          })
                        }
                      >
                        <option disabled value="">
                          등급을 선택해 주세요
                        </option>
                        <option value="LEGENDARY">레전드리</option>
                        <option value="SUPER RARE">슈퍼레어</option>
                        <option value="RARE">레어</option>
                        <option value="COMMON">흔한</option>
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
                        value={state.desiredGenre}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_FIELD",
                            field: "desiredGenre",
                            value: e.target.value,
                          })
                        }
                      >
                        <option disabled value="">
                          장르를 선택해 주세요
                        </option>
                        <option value="ALBUM">앨범</option>
                        <option value="SPECIAL">특전</option>
                        <option value="FANSIGN">팬싸</option>
                        <option value="SEASON_GREETING">시즌그리팅</option>
                        <option value="FANMEETING">팬미팅</option>
                        <option value="CONCERT">콘서트</option>
                        <option value="MD">MD</option>
                        <option value="COLLAB">콜라보</option>
                        <option value="FANCLUB">팬클럽</option>
                        <option value="ETC">기타</option>
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
                    value={state.desiredDesc}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "desiredDesc",
                        value: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className={styles.btnArea}>
              <button className={styles.cancelBtn} onClick={onClose}>
                취소하기
              </button>
              <button className={styles.confirmBtn} onClick={handleConfirm}>
                수정하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
