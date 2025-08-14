"use client";

import style from "./tradeList.module.css";
import TradeCard from "../../tradeCard/tradeCard";
import { useEffect, useState, useCallback } from "react";
import ExchangeCancelModal from "@/components/modals/exchangeCancelModal";
import {
  getMyExchangeProposals,
  cancelExchangeProposal,
} from "@/utils/api/exchange";

export default function TradeList({ sale }) {
  const [proposals, setProposals] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);

  const loadProposals = useCallback(async () => {
    try {
      const res = await getMyExchangeProposals({
        page: 1,
        pageSize: 50,
        status: "PENDING",
      });
      const list = Array.isArray(res?.proposals) ? res.proposals : [];

      // 백업 프론트 필터 및 sale 범위 한정
      const filtered = list.filter((p) => p.status === "PENDING");
      const scoped = sale?.id
        ? filtered.filter((p) => p.saleId === sale.id)
        : filtered;

      setProposals(scoped);
    } catch {
      setProposals([]);
    }
  }, [sale?.id]);

  // 초기 로드
  useEffect(() => {
    loadProposals();
  }, [loadProposals]);

  // 실시간 반영
  useEffect(() => {
    function onCreated() {
      loadProposals();
    }
    window.addEventListener("exchange:created", onCreated);
    return () => {
      window.removeEventListener("exchange:created", onCreated);
    };
  }, [loadProposals]);

  function openCancelModal(proposal) {
    const card = proposal.proposedCard?.photoCard || {};
    setCancelTarget({
      id: proposal.id,
      grade: card.grade || "",
      title: card.title || card.name || "",
    });
    setIsCancelOpen(true);
  }
  function closeCancelModal() {
    setIsCancelOpen(false);
    setCancelTarget(null);
  }

  // 취소
  async function confirmCancel() {
    if (!cancelTarget?.id) return;
    try {
      setLoadingId(cancelTarget.id);
      await cancelExchangeProposal(cancelTarget.id);

      // 즉시 목록에서 제거
      setProposals((prev) => prev.filter((p) => p.id !== cancelTarget.id));

      // 교환 취소 alert
      window.alert("교환이 취소되었습니다.");
    } catch (e) {
      console.error(e);
      window.alert("취소 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoadingId(null);
      closeCancelModal();
    }
  }

  return (
    <div>
      <div className={style.title}>
        <p>내가 제시한 교환 목록</p>
      </div>

      <div className={style.list}>
        {proposals.map((p) => (
          <TradeCard
            key={p.id}
            proposal={p}
            loading={loadingId === p.id}
            onCancel={() => openCancelModal(p)}
          />
        ))}
      </div>

      {isCancelOpen && (
        <ExchangeCancelModal
          onClose={closeCancelModal}
          onConfirm={confirmCancel}
          cardTitle={cancelTarget?.title}
          cardGrade={cancelTarget?.grade}
        />
      )}
    </div>
  );
}
