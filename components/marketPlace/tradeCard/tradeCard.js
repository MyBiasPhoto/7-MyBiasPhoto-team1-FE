/*"use client";
import style from "./tradeCard.module.css";
import Image from "next/image";
import defaultImg from "@/public/assets/cardImage.png";
import { useState } from "react";
export default function TradeCard({
  image,
  title,
  grade,
  category,
  point,
  writer,
  content,
  onCancel,
}) {
  return (
    <div className={style.Container}>
      <div className={style.ImageBox}>
        <Image src={defaultImg} width={440} height={240} alt="스페인 여행" />
      </div>
      <div className={style.Title}>
        <p className={style.titleFont}>{title || "스페인 여행"}</p>
        <div className={style.subTitleRow}>
          <div className={style.subTitleTags}>
            <p className={style.grade}>{grade || "COMMON"}</p>
            {/* 우진 오류 수정 부분 */}
            <span className={style.divider}>|</span>
            <p className={style.category}>{category || "풍경"}</p>
            <span className={style.divider}>|</span>
            <p className={style.point}>
              <span className={style.bold}>{point || "4"}P</span> 에 구매
            </p>
          </div>
          <p className={style.writer}>{writer || "유디"}</p>
        </div>
      </div>
      <div>
        <p className={style.content}>
          {content ||
            "스페인 여행 사진도 좋은데.. 우리집 앞마당 포토카드와 교환하고싶습니다!"}
        </p>
      </div>
      <button onClick={onCancel} className={style.closeButton}>
        취소하기
      </button>
    </div>
  );
} */

"use client";

import style from "./tradeCard.module.css";
import Image from "next/image";
import defaultImg from "@/public/assets/cardImage.png";

function normalizeProposal(proposal) {
  if (!proposal) return {};

  const sale = proposal.sale || {};
  const saleCard = sale.photoCard || {};
  const seller = sale.seller || {};

  const proposedCard = proposal.proposedCard || {};
  const proposedPhotoCard = proposedCard.photoCard || {};
  const proposer = proposal.proposer || proposal.buyer || {};

  const hasProposed = !!(
    proposedPhotoCard &&
    (proposedPhotoCard.imageUrl ||
      proposedPhotoCard.name ||
      proposedPhotoCard.title)
  );

  // 기준 카드
  const baseCard = hasProposed ? proposedPhotoCard : saleCard;

  const imageUrl = baseCard.imageUrl || baseCard.image || defaultImg;
  const title = baseCard.name || baseCard.title || "";
  const grade = baseCard.grade || "";
  const category = baseCard.genre || baseCard.category || "";
  const price = baseCard.price || baseCard.point || null;
  const writer =
    baseCard.writer ||
    baseCard.author ||
    baseCard.artist ||
    proposer.nickname ||
    proposer.name ||
    (hasProposed ? "" : seller.nickname) ||
    "";
  const message = proposal.message || "";
  const proposerName = proposer.nickname || proposer.name || "";

  return {
    id: proposal.id,
    saleId: proposal.saleId || sale.id,
    imageUrl,
    title,
    grade,
    category,
    price,
    writer,
    message,
    proposerName,
  };
}

export default function TradeCard(props) {
  const {
    proposal,
    mode = "buyer",
    onCancel,
    onReject,
    onAccept,
    loading = false,
  } = props;

  const data = normalizeProposal(proposal);

  const gradeKey = (data.grade || "").toLowerCase().replace(/\s+/g, "_");
  const gradeClass =
    style.grade + " " + (style[gradeKey] ? style[gradeKey] : "");

  return (
    <div className={style.Container}>
      {/* 이미지 */}
      <div className={style.ImageBox}>
        <Image
          src={typeof data.imageUrl === "string" ? data.imageUrl : defaultImg}
          width={440}
          height={240}
          alt={data.title || "trade-card"}
        />
      </div>

      {/* 제목 + 태그 */}
      <div className={style.Title}>
        <p className={style.titleFont}>{data.title}</p>
        <div className={style.subTitleRow}>
          <div className={style.subTitleTags}>
            {data.grade && <p className={gradeClass}>{data.grade}</p>}
            {(data.grade || data.category) && (
              <span className={style.divider}>|</span>
            )}
            {data.category && <p className={style.category}>{data.category}</p>}
          </div>
          {data.writer && <p className={style.writer}>{data.writer}</p>}
        </div>
      </div>

      {/* 가격 */}
      {data.price && (
        <p className={style.price}>{data.price.toLocaleString()} P</p>
      )}

      {/* 제안자 */}
      {data.proposerName && (
        <p className={style.proposer}>{data.proposerName}</p>
      )}

      {/* 교환 제시 멘트 */}
      {data.message && (
        <div>
          <p className={style.content}>{data.message}</p>
        </div>
      )}

      {/* 버튼 */}
      {mode === "buyer" ? (
        <button
          type="button"
          onClick={() => onCancel?.(data.id)}
          className={style.closeButton}
          disabled={loading}
        >
          {loading ? "처리 중..." : "취소하기"}
        </button>
      ) : (
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          <button
            type="button"
            onClick={() => onReject?.(data.id)}
            className={style.closeButton}
            disabled={loading}
          >
            {loading ? "처리 중..." : "거절하기"}
          </button>
          <button
            type="button"
            onClick={() => onAccept?.(data.id, data.saleId)}
            className={style.confirmButton}
            disabled={loading}
          >
            {loading ? "처리 중..." : "승인하기"}
          </button>
        </div>
      )}
    </div>
  );
}
