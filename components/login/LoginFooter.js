"use client";

import Link from "next/link";
import styles from "@/app/login/page.module.css";

export default function LoginFooter() {
  return (
    <div className={styles.signup}>
      <span className={styles.signupText}>최애의 포토가 처음이신가요?</span>
      <Link href="/signup" className={styles.signupLink}>
        회원가입하기
      </Link>
    </div>
  );
}
