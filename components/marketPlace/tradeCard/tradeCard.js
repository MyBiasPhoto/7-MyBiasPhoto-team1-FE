"use client";

import style from "./tradeCard.module.css";
import Image from "next/image";
import defaultImg from "@/public/assets/cardImage.png";

// 구매자 카드 데이터 매핑
function normalizeBuyerProposal(proposal) {
  if (!proposal) return {};

  const sale = proposal.sale || {};
  const saleCard = sale.photoCard || {};
  const seller = sale.seller || {};

  const imageUrl = saleCard.imageUrl || saleCard.image || defaultImg;

  const title = saleCard.name || saleCard.title || "";
  const grade = saleCard.grade || "";
  const category = saleCard.genre || saleCard.category || "";
  const price = saleCard.price || saleCard.point || null;
  const writer = seller.nickname || seller.name || "";
  const message = proposal.message || "";

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
  };
}

export default function TradeCard({ proposal, onCancel, loading = false }) {
  const data = normalizeBuyerProposal(proposal);

  const gradeKey = (data.grade || "").toLowerCase().replace(/\s+/g, "_");
  const gradeClass =
    style.grade + " " + (style[gradeKey] ? style[gradeKey] : "");

  return (
    <div className={style.Container}>
      <div className={style.ImageBox}>
        <Image
          src={typeof data.imageUrl === "string" ? data.imageUrl : defaultImg}
          width={440}
          height={240}
          alt={data.title || "trade-card"}
        />
      </div>
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

      {data.price && (
        <p className={style.price}>{data.price.toLocaleString()} P</p>
      )}

      {/* 교환 제시 멘트 */}
      {data.message && (
        <div>
          <p className={style.content}>{data.message}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => onCancel?.(data.id)}
        className={style.closeButton}
        disabled={loading}
      >
        {loading ? "처리 중..." : "취소하기"}
      </button>
    </div>
  );
}
