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

export default function EditTradeList({ sale }) {
  const [trade, setTrade] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [target, setTarget] = useState(null);

  // 목록 불러오기
  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await getReceivedExchangeProposals(sale?.id);
        const list = Array.isArray(res?.proposals) ? res.proposals : [];

        // status 필터 적용 (PENDING만)
        const filtered = list.filter((p) => p.status === "PENDING");

        if (!ignore) {
          const mapped = filtered.map((p) => ({
            id: p.id,
            image:
              p.proposedCard?.photoCard?.imageUrl ||
              p.proposedCard?.photoCard?.image ||
              null,
            title:
              p.proposedCard?.photoCard?.name ||
              p.proposedCard?.photoCard?.title ||
              "",
            grade: p.proposedCard?.photoCard?.grade || "COMMON",
            category: p.proposedCard?.photoCard?.genre || "",
            point: p.proposedCard?.photoCard?.price || null,
            writer: p.proposer?.nickname || p.proposer?.name || "",
            proposerName: p.proposer?.nickname || p.proposer?.name || "",
            content: p.message || "",
          }));
          setTrade(mapped);
        }
      } catch {
        if (!ignore) setTrade([]);
      }
    }
    if (sale?.id) load();
    return () => {
      ignore = true;
    };
  }, [sale?.id]);

  function openRejectModal(p) {
    setTarget(p);
    setIsRejectOpen(true);
  }
  function openApproveModal(p) {
    setTarget(p);
    setIsApproveOpen(true);
  }
  function closeModals() {
    setIsRejectOpen(false);
    setIsApproveOpen(false);
    setTarget(null);
  }

  // 거절
  async function handleConfirmReject() {
    if (!target?.id) return;
    try {
      setLoadingId(target.id);
      await rejectExchangeProposal(target.id);

      // 즉시 목록에서 제거
      setTrade((prev) => prev.filter((p) => p.id !== target.id));
      // 교환 거절 alert
      window.alert("교환이 거절되었습니다.");
    } catch (e) {
      console.error(e);
      window.alert("거절 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoadingId(null);
      closeModals();
    }
  }

  // 승인
  async function handleConfirmApprove() {
    if (!target?.id) return;
    try {
      setLoadingId(target.id);
      const res = await acceptExchangeProposal(target.id);
      const remaining = res?.data?.remainingQuantity;

      // 즉시 목록에서 제거
      if (remaining === 0) {
        setTrade((prev) => prev.filter((p) => p.saleId !== sale?.id));
      } else {
        setTrade((prev) => prev.filter((p) => p.id !== target.id));
      }
      // 교환 승인 alert
      window.alert("교환이 승인되었습니다.");
    } catch (e) {
      console.error(e);
      window.alert("승인 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoadingId(null);
      closeModals();
    }
  }

  return (
    <div>
      <div className={style.title}>
        <p>받은 교환 제시 목록</p>
      </div>

      <div className={style.list}>
        {trade.map((p) => (
          <EditTradeCard
            key={p.id}
            {...p}
            loading={loadingId === p.id}
            onCancel={() => openRejectModal(p)}
            onAccept={() => openApproveModal(p)}
          />
        ))}
      </div>

      {isRejectOpen && (
        <ExchangeRefuseModal
          onClose={closeModals}
          onConfirm={handleConfirmReject}
          loading={loadingId !== null}
          cardTitle={target?.title}
          cardGrade={target?.grade}
        />
      )}

      {isApproveOpen && (
        <ExchangeApproveModal
          onClose={closeModals}
          onConfirm={handleConfirmApprove}
          loading={loadingId !== null}
          cardTitle={target?.title}
          cardGrade={target?.grade}
        />
      )}
    </div>
  );
}
