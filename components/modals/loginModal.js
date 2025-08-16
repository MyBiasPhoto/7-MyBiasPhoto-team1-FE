// components/modals/loginModal.js
"use client";

import styles from "./loginModal.module.css";
import Image from "next/image";
import CloseIcon from "@/public/icons/ic_close.svg";
import Link from "next/link";

export default function LoginModal({ onClose, returnTo = "/" }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <Image src={CloseIcon} alt="Close" width={32} height={32} />
        </button>
        <h2 className={styles.title}>로그인이 필요합니다.</h2>
        <p className={styles.description}>
          로그인 하시겠습니까? <br />
          다양한 서비스를 편리하게 이용하실 수 있습니다.
        </p>
        <Link
          href={`/login?returnTo=${encodeURIComponent(returnTo)}`}
          className={styles.confirmButton}
        >
          확인
        </Link>
      </div>
    </div>
  );
}
