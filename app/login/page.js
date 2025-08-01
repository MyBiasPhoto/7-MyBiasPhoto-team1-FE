"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleLogin = () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("잘못된 이메일 형식입니다.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("비밀번호는 8자 이상 입력해 주세요.");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (valid) {
      console.log("로그인 요청 보냄");
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        <Image src="/assets/logo.svg" alt="로고" width={330} height={60} />
      </Link>

      <div className={styles.email}>
        <label htmlFor="email" className={styles.emailText}>
          이메일
        </label>
        <input
          id="email"
          type="email"
          placeholder="이메일을 입력해 주세요"
          onChange={(e) => setEmail(e.target.value)}
          className={styles.emailInput}
          required
        />
        {emailError && <p className={styles.error}>{emailError}</p>}
      </div>

      <div className={styles.password}>
        <label htmlFor="password" className={styles.passwordText}>
          비밀번호
        </label>
        <div className={styles.passwordInputWrapper}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력해 주세요"
            onChange={(e) => setPassword(e.target.value)}
            className={styles.passwordInput}
            required
          />
          <Image
            src={
              showPassword ? "/icons/ic_visible.svg" : "/icons/ic_invisible.svg"
            }
            alt="비밀번호 보기 아이콘"
            width={24}
            height={24}
            className={styles.visibleIcon}
            onClick={togglePasswordVisibility}
          />
        </div>
        {passwordError && <p className={styles.error}>{passwordError}</p>}
      </div>

      <div className={styles.btn}>
        <button
          onClick={handleLogin}
          className={`${styles.button} ${styles.loginbtn}`}
        >
          <span className={styles.loginbtnText}>로그인</span>
        </button>

        <button className={`${styles.button} ${styles.googlebtn}`}>
          <Image
            src="/icons/google.svg"
            alt="Google 아이콘"
            width={22}
            height={22}
          />
          <span className={styles.googlebtnText}>Google로 시작하기</span>
        </button>
      </div>

      <div className={styles.signup}>
        <span className={styles.signupText}>최애의 포토가 처음이신가요?</span>
        <Link href="/signup" className={styles.signupLink}>
          회원가입하기
        </Link>
      </div>
    </div>
  );
}
