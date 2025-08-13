"use client";

import { useReducer, useEffect } from "react";
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
  editedQuantity: 1,
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
        editedQuantity: Math.min(state.editedQuantity + 1, action.maxQuantity),
      };
    case "DECREASE_QUANTITY":
      return {
        ...state,
        editedQuantity: Math.max(1, state.editedQuantity - 1),
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function EditPhotoModal({ sale, onClose }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const queryClient = useQueryClient();

  // Modal 열릴 때 sale 데이터로 초기값 세팅
  useEffect(() => {
    if (sale) {
      dispatch({
        type: "SET_FIELD",
        field: "editedQuantity",
        value: sale.quantity, // 서버에서 가져온 원래 수량
      });
      dispatch({ type: "SET_FIELD", field: "price", value: sale.price });
      dispatch({
        type: "SET_FIELD",
        field: "desiredGrade",
        value: sale.desiredGrade || "",
      });
      dispatch({
        type: "SET_FIELD",
        field: "desiredGenre",
        value: sale.desiredGenre || "",
      });
      dispatch({
        type: "SET_FIELD",
        field: "desiredDesc",
        value: sale.desiredDesc || "",
      });
    }
  }, [sale]);

  // 버튼 클릭 시 안전하게 수량 조정
  const increaseQuantity = () => {
    dispatch({
      type: "INCREASE_QUANTITY",
      maxQuantity: sale.initialQuantity, // 서버가 제공하는 최대 수량이 있으면 사용
    });
  };

  const decreaseQuantity = () => {
    dispatch({ type: "DECREASE_QUANTITY" });
  };

  const { mutate } = useMutation({
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
      id: sale.id,
      data: {
        quantity: state.editedQuantity, // 수정 수량
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
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h1 className={styles.header}>수정하기</h1>
        <button className={styles.closeButton} onClick={onClose}>
          <Image src={CloseIcon} alt="Close" width={32} height={32} />
        </button>

        <div className={styles.titleArea}>
          <h2 className={styles.titleTxt}>{sale?.photoCard.name}</h2>
        </div>
        {console.log(sale)}

        <div className={styles.contentArea}>
          <div className={styles.detailContainer}>
            <div className={styles.aboutPhoto}>
              <div className={styles.cardImage}>
                <Image
                  src={sale?.photoCard.imageUrl || cardImage}
                  alt={"포카 이미지"}
                  width={50}
                  height={50}
                  quality={100}
                  className={styles.responsiveImage}
                />
              </div>
              <div className={styles.cardInfo}>
                <div className={styles.cardSubTitle}>
                  <div className={styles.cardSubTitleBox}>
                    <p className={`${styles[sale?.photoCard.grade]}`}>
                      {sale?.photoCard.grade}
                    </p>
                    <span className={styles.divider}>|</span>
                    <p className={styles.kind}>{sale?.photoCard.genre}</p>
                  </div>
                  <p className={styles.subTitleWriter}>
                    {sale?.seller.nickname}
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
                          disabled={state.editedQuantity <= 1}
                        >
                          <Image
                            src={MinusIcon}
                            alt="감소"
                            width={20}
                            height={20}
                          />
                        </button>
                        <span>{state.editedQuantity}</span>
                        <button
                          onClick={increaseQuantity}
                          className={styles.iconButton}
                          disabled={
                            state.editedQuantity >= sale.initialQuantity
                          }
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
                          / {sale.maxQuantity || sale.quantity}{" "}
                          {/* 최대 허용 수량 */}
                        </span>
                        <span className={styles.maxHint}>
                          원래 {sale.initialQuantity}장
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

            {/* 교환 희망 정보 */}
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
                        <option value="SUPER_RARE">슈퍼레어</option>
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

            {/* 버튼 */}
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
