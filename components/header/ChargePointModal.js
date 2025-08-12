"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styles from "./ChargePointModal.module.css";
import { chargePoints } from "@/utils/api/users";

export default function ChargePointModal({ onClose }) {
  const [amount, setAmount] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: chargePoints,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      onClose();
    },
  });

  const handleSubmit = e => {
    e.preventDefault();
    mutate(Number(amount));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.area}>
        <span className={styles.title}>포인트 충전</span>
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
          <button className={styles.btn} type="submit" disabled={isPending}>
            {isPending ? "충전 중..." : "충전하기"}
          </button>
        </form>
        {isError && <p className={styles.error}>{error.message}</p>}
      </div>
    </div>
  );
}
