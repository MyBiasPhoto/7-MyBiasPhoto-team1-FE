"use client";

import style from "./tradeList.module.css";
import TradeCard from "../../tradeCard/tradeCard";
import { useEffect, useState } from "react";
import ExchangeCancelModal from "@/components/modals/exchangeCancelModal";
import {
  getMyExchangeProposals,
  cancelExchangeProposal,
} from "@/utils/api/exchange";

export default function TradeList(props) {
  const { sale } = props;

  const [proposals, setProposals] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // 취소 모달
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState(null);

  // 1) 목록 로드 (내 제안들 → 현재 판매글 기준으로 필터)
  useEffect(
    function () {
      var ignore = false;

      async function loadMy() {
        try {
          var res = await getMyExchangeProposals({
            page: 1,
            pageSize: 50,
            status: "PENDING",
          });
          var list = Array.isArray(res?.proposals) ? res.proposals : [];
          var filtered = sale?.id
            ? list.filter(function (p) {
                return p.saleId === sale.id;
              })
            : list;
          if (!ignore) setProposals(filtered);
        } catch (_e) {
          if (!ignore) setProposals([]);
        }
      }

      if (sale?.id) loadMy();
      return function () {
        ignore = true;
      };
    },
    [sale?.id]
  );

  // 2) 새 제안 즉시 반영 (ExchangePhotoModal → window.dispatchEvent('exchange:created', {detail: proposal}))
  useEffect(
    function () {
      function onCreated(e) {
        var p = e.detail;
        if (!p || !p.saleId || !sale?.id || p.saleId !== sale.id) return;
        setProposals(function (prev) {
          var exists =
            Array.isArray(prev) &&
            prev.some(function (x) {
              return x.id === p.id;
            });
          if (exists) return prev;
          return [p].concat(prev);
        });
      }
      window.addEventListener("exchange:created", onCreated);
      return function () {
        window.removeEventListener("exchange:created", onCreated);
      };
    },
    [sale?.id]
  );

  // 3) 취소 플로우 (모달 열기 → 확인에서 실제 취소)
  function openCancelModal(proposalId) {
    setCancelTargetId(proposalId);
    setIsCancelOpen(true);
  }
  function closeCancelModal() {
    setIsCancelOpen(false);
    setCancelTargetId(null);
  }
  async function confirmCancel() {
    try {
      if (!cancelTargetId) return;
      setLoadingId(cancelTargetId);
      await cancelExchangeProposal(cancelTargetId);
      setProposals(function (prev) {
        return prev.filter(function (p) {
          return p.id !== cancelTargetId;
        });
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
      closeCancelModal();
    }
  }

  // 렌더 아이템 (구매자 전용 → 버튼은 ‘취소하기’만 노출)
  function renderItem(p) {
    return (
      <TradeCard
        key={p.id}
        proposal={p}
        mode="buyer"
        loading={loadingId === p.id}
        onCancel={function () {
          openCancelModal(p.id);
        }}
      />
    );
  }

  return (
    <div>
      <div className={style.title}>
        <p>내가 제시한 교환 목록</p>
      </div>

      <div className={style.list}>{proposals.map(renderItem)}</div>

      {isCancelOpen && (
        <ExchangeCancelModal
          onClose={closeCancelModal}
          onConfirm={confirmCancel}
        />
      )}
    </div>
  );
}
