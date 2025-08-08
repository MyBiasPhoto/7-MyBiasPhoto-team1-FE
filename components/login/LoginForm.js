"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/app/login/page.module.css";
import Image from "next/image";
import Link from "next/link";
import { login as loginRequest } from "@/utils/auth/login";
import { useAuth } from "@/utils/auth/authContext";

import LoginInput from "./LoginInput";
import LoginButton from "./LoginButton";
import LoginFooter from "./LoginFooter";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const handleLogin = async () => {
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
    if (!valid) return;

    try {
      const user = await loginRequest({ email, password });
      alert("로그인 성공!");
      login(user);
      router.push("/");
    } catch (error) {
      alert("로그인 실패!");
      if (error.response && error.response.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        <Image src="/assets/logo.svg" alt="로고" width={330} height={60} />
      </Link>

      <LoginInput
        id="email"
        label="이메일"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={emailError}
        placeholder="이메일을 입력해 주세요"
        className={styles.email}
        inputClass={styles.emailInput}
        labelClass={styles.emailText}
      />

      <LoginInput
        id="password"
        label="비밀번호"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={passwordError}
        placeholder="비밀번호를 입력해 주세요"
        className={styles.password}
        inputClass={styles.passwordInput}
        labelClass={styles.passwordText}
        showPassword={showPassword}
        onTogglePassword={togglePasswordVisibility}
        icon={
          <Image
            src={
              showPassword ? "/icons/ic_visible.svg" : "/icons/ic_invisible.svg"
            }
            alt="비밀번호 보기 아이콘"
            width={24}
            height={24}
            className={styles.visibleIcon}
            onClick={togglePasswordVisibility}
            style={{ cursor: "pointer" }}
          />
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") handleLogin();
        }}
      />

      <div className={styles.btn}>
        <LoginButton
          onClick={handleLogin}
          className={`${styles.button} ${styles.loginbtn}`}
        >
          <span className={styles.loginbtnText}>로그인</span>
        </LoginButton>

        <LoginButton className={`${styles.button} ${styles.googlebtn}`}>
          <Image
            src="/icons/google.svg"
            alt="Google 아이콘"
            width={22}
            height={22}
          />
          <span className={styles.googlebtnText}>Google로 시작하기</span>
        </LoginButton>
      </div>

      <LoginFooter />
    </div>
  );
}
