"use client";

import style from "./tradeList.module.css";
import EditTradeCard from "../card/card";
import { useEffect, useState } from "react";
import ExchangeRefuseModal from "@/components/modals/exchangeRefuseModal";
import ExchangeApproveModal from "@/components/modals/exchangeApproveModal";
import {
  getReceivedExchangeProposals,
  acceptExchangeProposal,
  rejectExchangeProposal,
} from "@/utils/api/exchange";

// proposal → EditTradeCard props 정규화
function normalizeProposalForEditCard(proposal) {
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
  const baseCard = hasProposed ? proposedPhotoCard : saleCard;

  const image = baseCard.imageUrl || baseCard.image || null;
  const title = baseCard.name || baseCard.title || "";
  const grade = baseCard.grade || "COMMON";
  const category = baseCard.genre || baseCard.category || "";
  const point = baseCard.price || baseCard.point || null; // 가격/포인트가 있으면 표시
  const writer =
    baseCard.writer ||
    baseCard.author ||
    baseCard.artist ||
    proposer.nickname ||
    proposer.name ||
    (hasProposed ? "" : seller.nickname) ||
    "";
  const content = proposal.message || ""; // 교환 제시 멘트

  return {
    id: proposal.id,
    image,
    title,
    grade,
    category,
    point,
    writer,
    content,
    saleId: proposal.saleId || sale.id,
  };
}

export default function EditTradeList({ sale }) {
  const [trade, setTrade] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [targetProposalId, setTargetProposalId] = useState(null);

  useEffect(
    function () {
      var ignore = false;

      async function loadReceived() {
        try {
          const res = await getReceivedExchangeProposals(sale?.id);
          const list = Array.isArray(res?.proposals) ? res.proposals : [];
          if (!ignore) setTrade(list);
        } catch (e) {
          if (!ignore) setTrade([]);
        }
      }

      if (sale?.id) loadReceived();
      return function () {
        ignore = true;
      };
    },
    [sale?.id]
  );

  function openRejectModal(proposalId) {
    setTargetProposalId(proposalId);
    setIsRejectModalOpen(true);
  }
  function openApproveModal(proposalId) {
    setTargetProposalId(proposalId);
    setIsApproveModalOpen(true);
  }
  function closeModals() {
    setTargetProposalId(null);
    setIsRejectModalOpen(false);
    setIsApproveModalOpen(false);
  }

  async function confirmReject() {
    if (!targetProposalId) return;
    try {
      setLoadingId(targetProposalId);
      await rejectExchangeProposal(targetProposalId);
      setTrade(function (prev) {
        return prev.filter(function (p) {
          return p.id !== targetProposalId;
        });
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoadingId(null);
      closeModals();
    }
  }

  async function confirmApprove() {
    if (!targetProposalId) return;
    try {
      setLoadingId(targetProposalId);
      const res = await acceptExchangeProposal(targetProposalId);
      const remaining = res?.data?.remainingQuantity;

      if (remaining === 0) {
        // 남은 수량 0 → 이 판매글의 나머지 제안도 더 이상 유효하지 않음 → 전부 제거
        setTrade(function (prev) {
          return prev.filter(function (p) {
            return p.saleId !== sale?.id;
          });
        });
      } else {
        // 남은 수량 존재 → 방금 승인한 제안만 제거
        setTrade(function (prev) {
          return prev.filter(function (p) {
            return p.id !== targetProposalId;
          });
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoadingId(null);
      closeModals();
    }
  }

  function renderItem(p) {
    const card = normalizeProposalForEditCard(p);
    return (
      <EditTradeCard
        key={card.id}
        {...card}
        onCancel={function () {
          openRejectModal(card.id);
        }} // 판매자: "거절" 버튼
        onAccept={function () {
          openApproveModal(card.id);
        }} // 판매자: "승인" 버튼
        loading={loadingId === card.id}
      />
    );
  }

  return (
    <div>
      <div className={style.title}>
        <p>교환 제시 목록</p>
      </div>

      <div className={style.list}>{trade.map(renderItem)}</div>
      {isRejectModalOpen && (
        <ExchangeRefuseModal
          onClose={closeModals}
          onConfirm={confirmReject}
          loading={loadingId !== null}
        />
      )}
      {isApproveModalOpen && (
        <ExchangeApproveModal
          onClose={closeModals}
          onConfirm={confirmApprove}
          loading={loadingId !== null}
        />
      )}
    </div>
  );
}
