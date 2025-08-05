"use client";

import { useState } from "react";
import styles from "./editPhotoModal.module.css";
import Image from "next/image";
import cardImage from "@/public/assets/cardImage.png";
import CloseIcon from "@/public/icons/ic_close.svg";
import MinusIcon from "@/public/icons/ic_-.svg";
import PlusIcon from "@/public/icons/ic_+.svg";
import DownIcon from "@/public/icons/ic_down.svg";

export default function EditPhotoModal({ onClose }) {
  const [selectedCard] = useState({
    id: "a1",
    title: "전설의 용사",
    grade: "legendary",
    writer: "홍길동",
    kind: "캐릭터",
    amount: 3,
    price: 1000,
  });

  const [amount, setAmount] = useState(1);
  const [price, setPrice] = useState("");
  const [grade, setGrade] = useState("");
  const [kind, setKind] = useState("");
  const [exchangeMemo, setExchangeMemo] = useState("");

  const increaseAmount = () => {
    if (amount < selectedCard.amount) setAmount(amount + 1);
  };

  const decreaseAmount = () => {
    if (amount > 1) setAmount(amount - 1);
  };

  const handleConfirm = () => {
    alert("수정 완료");
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h1 className={styles.header}>{selectedCard && "수정하기"}</h1>
        <button className={styles.closeButton} onClick={onClose}>
          <Image src={CloseIcon} alt="Close" width={32} height={32} />
        </button>
        <div className={styles.titleArea}>
          <h2 className={styles.titleTxt}>
            {selectedCard && `${selectedCard.title}`}
          </h2>
        </div>
        <div className={styles.contentArea}>
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
