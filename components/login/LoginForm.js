"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/app/login/page.module.css";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/utils/auth/authContext";
import toast from "react-hot-toast";
import LoginInput from "./LoginInput";
import LoginButton from "./LoginButton";
import LoginFooter from "./LoginFooter";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [strategy, setStrategy] = useState("sliding");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = password => password.length >= 8;

  const handleLogin = async () => {
    if (submitting) return;
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
      setSubmitting(true);
      await login({ email, password, strategy });
      toast.success("로그인 성공!", {
        style: {
          fontFamily: "BR-B",
          background: "var(--black)",
          border: "1px solid var(--main)",
          padding: "16px 20px",
          color: "var(--white)",
          fontSize: "20px",
        },
        iconTheme: { primary: "var(--main)", secondary: "var(--black)" },
        duration: 1000,
      });
      router.push("/marketPlace");
    } catch (error) {
      const msg =
        error?.response?.data?.message || "로그인 중 오류가 발생했습니다.";
      toast.error(`${msg}`, {
        style: {
          fontFamily: "BR-B",
          background: "var(--black)",
          border: "1px solid var(--red)",
          padding: "16px 20px",
          color: "var(--white)",
          fontSize: "20px",
        },
        duration: 1000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

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
        onChange={e => setEmail(e.target.value)}
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
        onChange={e => setPassword(e.target.value)}
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
        onKeyDown={e => {
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

        <LoginButton
          className={`${styles.button} ${styles.googlebtn}`}
          onClick={() => {
            window.location.href = `${API_URL}/auth/google?strategy=${strategy}`;
          }}
        >
          <Image
            src="/icons/google.svg"
            alt="Google 아이콘"
            width={22}
            height={22}
          />
          <span className={styles.googlebtnText}>Google로 시작하기</span>
        </LoginButton>
        <LoginButton
          className={`${styles.button} ${styles.kakaobtn}`}
          onClick={() => {
            window.location.href = `${API_URL}/auth/kakao?strategy=${strategy}`;
          }}
        >
          <div className={styles.kakaoColor}>
            <Image
              src="/icons/kakao.svg"
              alt="Google 아이콘"
              width={18}
              height={18}
            />
          </div>
          <span className={styles.googlebtnText}>Kakao로 시작하기</span>
        </LoginButton>
      </div>

      <LoginFooter />
    </div>
  );
}
