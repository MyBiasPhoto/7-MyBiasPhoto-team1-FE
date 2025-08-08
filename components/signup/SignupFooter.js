"use client";
import Link from "next/link";
import styles from "@/app/signup/page.module.css";

export default function SignupFooter() {
  return (
    <div className={styles.login}>
      <span className={styles.loginText}>이미 최애의 포토 회원이신가요?</span>
      <Link href="/login" className={styles.loginLink}>
        로그인하기
      </Link>
    </div>
  );
}
