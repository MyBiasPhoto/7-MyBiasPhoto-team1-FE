"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styles from "./ChargePoint.module.css";
import { chargePoints } from "@/utils/api/users";
import toast from "react-hot-toast";

export default function ChargePoint({ onClose }) {
  const [amount, setAmount] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: chargePoints,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });

      toast.success("포인트 충전 완료!", {
        style: {
          fontFamily: "BR-B",
          background: "var(--black)",
          border: "1px solid var(--main)",
          padding: "16px 20px",
          color: "var(--white)",
          fontSize: "20px",
        },
        iconTheme: { primary: "var(--main)", secondary: "var(--black)" },
        duration: 800,
      });
      setTimeout(() => {
        onClose?.();
        setAmount("");
      }, 1000);
    },
  });

  const handleSubmit = e => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error("충전 금액을 입력해주세요.", {
        style: {
          fontFamily: "BR-B",
          background: "var(--black)",
          border: "1px solid var(--main)",
          padding: "16px 20px",
          color: "var(--white)",
          fontSize: "20px",
        },
        duration: 800,
      });
      return;
    }
    mutate(Number(amount));
  };

  return (
    <div>
      <div className={styles.area}>
        <span className={styles.title}>
          포인트 <span className={styles.span}>충전</span>
        </span>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>충전 금액</label>
          <input
            className={styles.input}
            type="number"
            min="1"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />
          {isError && <p className={styles.error}>{error.message}</p>}
          <button className={styles.btn} type="submit" disabled={isPending}>
            {isPending ? "충전 중..." : "충전하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
