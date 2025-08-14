"use client";

import style from "./card.module.css";
import Image from "next/image";
import defaultImg from "@/public/assets/cardImage.png";

export default function EditTradeCard({
  image,
  title,
  grade,
  category,
  point,
  writer,
  content,
  proposerName,
  onCancel,
  onAccept,
  loading = false,
}) {
  return (
    <div className={style.Container}>
      {/* 카드 이미지 */}
      <div className={style.ImageBox}>
        <Image
          src={image || defaultImg}
          width={440}
          height={240}
          alt={title || "제안 카드"}
        />
      </div>

      {/* 카드 정보 */}
      <div className={style.Title}>
        <p className={style.titleFont}>{title || "제안 카드"}</p>
        <div className={style.subTitleRow}>
          <div className={style.subTitleTags}>
            {grade && (
              <p
                className={`${style.grade} ${
                  style[grade.toLowerCase().replace(/\s+/g, "_")]
                }`}
              >
                {grade}
              </p>
            )}
            {(grade || category) && <span className={style.divider}>|</span>}
            {category && <p className={style.category}>{category}</p>}
            {point && (
              <>
                <span className={style.divider}>|</span>
                <p className={style.point}>
                  <span className={style.bold}>{point}P</span> 에 구매
                </p>
              </>
            )}
          </div>
          {/* 제안자 표시 */}
          {proposerName && (
            <p className={style.writer}>제안자: {proposerName}</p>
          )}
        </div>
      </div>

      {/* 교환 제시 멘트 */}
      {content && (
        <div>
          <p className={style.content}>{content}</p>
        </div>
      )}

      {/* 버튼 */}
      <div className={style.buttonArea}>
        <button
          onClick={onCancel}
          className={style.closeButton}
          disabled={loading}
        >
          {loading ? "처리 중..." : "거절하기"}
        </button>
        <button
          onClick={onAccept}
          className={style.acceptButton}
          disabled={loading}
        >
          {loading ? "처리 중..." : "승인하기"}
        </button>
      </div>
    </div>
  );
}
