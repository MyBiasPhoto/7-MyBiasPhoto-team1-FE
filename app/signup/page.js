"use client";

import { useState } from "react";
import { signup } from "@/utils/auth/signup";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordCheckError, setPasswordCheckError] = useState("");
  const [nicknameError, setNicknameError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const togglePasswordCheckVisibility = () => {
    setShowPasswordCheck((prev) => !prev);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateNickname = (nickname) => {
    return nickname.trim() !== "";
  };

  const handleSignup = async () => {
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

    if (!validateNickname(nickname)) {
      setNicknameError("닉네임을 입력해 주세요.");
      valid = false;
    } else {
      setNicknameError("");
    }

    if (password !== passwordCheck) {
      setPasswordCheckError("비밀번호가 일치하지 않습니다.");
      valid = false;
    } else {
      setPasswordCheckError("");
    }

    if (valid) {
      try {
        await signup({
          email,
          password,
          confirmPassword: passwordCheck,
          nickname,
        });
        alert("회원가입 성공!");
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "회원가입 실패");
      }
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

      <div className={styles.nickname}>
        <label htmlFor="nickname" className={styles.nicknameText}>
          닉네임
        </label>
        <input
          id="ninkname"
          type="text"
          placeholder="닉네임을 입력해 주세요"
          onChange={(e) => setNickname(e.target.value)}
          className={styles.nicknameInput}
          required
        />
        {nicknameError && <p className={styles.error}>{nicknameError}</p>}
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

      <div className={styles.passwordCheck}>
        <label htmlFor="passwordCheck" className={styles.passwordCheckText}>
          비밀번호 확인
        </label>
        <div className={styles.passwordCheckInputWrapper}>
          <input
            id="passwordCheck"
            type={showPasswordCheck ? "text" : "password"}
            placeholder="비밀번호를 한번 더 입력해 주세요"
            onChange={(e) => setPasswordCheck(e.target.value)}
            className={styles.passwordInput}
            required
          />
          <Image
            src={
              showPasswordCheck
                ? "/icons/ic_visible.svg"
                : "/icons/ic_invisible.svg"
            }
            alt="비밀번호 보기 아이콘"
            width={24}
            height={24}
            className={styles.visibleIcon}
            onClick={togglePasswordCheckVisibility}
          />
        </div>
        {passwordCheckError && (
          <p className={styles.error}>{passwordCheckError}</p>
        )}
      </div>

      <div className={styles.btn}>
        <button
          onClick={handleSignup}
          className={`${styles.button} ${styles.signupbtn}`}
        >
          <span className={styles.signupbtnText}>가입하기</span>
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

      <div className={styles.login}>
        <span className={styles.loginText}>이미 최애의 포토 회원이신가요?</span>
        <Link href="/login" className={styles.loginLink}>
          로그인하기
        </Link>
      </div>
    </div>
  );
}
