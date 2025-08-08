"use client";

import styles from "./sellCancelModal.module.css";
import Image from "next/image";
import CloseIcon from "@/public/icons/ic_close.svg";
import { useCancelSale } from "../marketPlace/hook/useCancleSale/useCancleSale";
import { useRouter } from "next/navigation";

const SellCancelModal = ({ onClose, saleId }) => {
  const router = useRouter();
  const { mutate, isPending, isError } = useCancelSale();

  const handleCancelSale = () => {
    mutate(
      { id: saleId },
      {
        onSuccess: () => {
          onClose();
          router.push("/marketPlace");
        },
        onError: (error) => {
          console.error("판매 중단 실패:", error);
          alert("판매 중단에 실패했습니다.");
        },
      }
    );
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <Image src={CloseIcon} alt="Close" width={32} height={32} />
        </button>
        <h2 className={styles.title}>포토카드 판매 내리기</h2>
        <p className={styles.description}>정말로 판매를 중단하시겠습니까?</p>
        <button onClick={handleCancelSale} className={styles.confirmButton}>
          판매 내리기
        </button>
      </div>
    </div>
  );
};

export default SellCancelModal;
