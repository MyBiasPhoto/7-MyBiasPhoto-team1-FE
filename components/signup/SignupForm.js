"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/utils/auth/signup";
import styles from "@/app/signup/page.module.css";
import Image from "next/image";
import Link from "next/link";
import SignupInput from "./SignupInput";
import SignupButton from "./SignupButton";
import SignupFooter from "./SignupFooter";

export default function SignupForm() {
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
  const router = useRouter();

  // 검증 함수
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;
  const validateNickname = (nickname) => nickname.trim() !== "";

  // 비번 보기 토글
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const togglePasswordCheckVisibility = () =>
    setShowPasswordCheck((prev) => !prev);

  // 회원가입 핸들러
  const handleSignup = async () => {
    let valid = true;
    if (!validateEmail(email)) {
      setEmailError("잘못된 이메일 형식입니다.");
      valid = false;
    } else setEmailError("");
    if (!validatePassword(password)) {
      setPasswordError("비밀번호는 8자 이상 입력해 주세요.");
      valid = false;
    } else setPasswordError("");
    if (!validateNickname(nickname)) {
      setNicknameError("닉네임을 입력해 주세요.");
      valid = false;
    } else setNicknameError("");
    if (password !== passwordCheck) {
      setPasswordCheckError("비밀번호가 일치하지 않습니다.");
      valid = false;
    } else setPasswordCheckError("");

    if (valid) {
      try {
        await signup({
          email,
          password,
          confirmPassword: passwordCheck,
          nickname,
        });
        alert("회원가입 성공!");
        router.push("/login");
      } catch (error) {
        alert(error.response?.data?.message || "회원가입 실패");
      }
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        <Image src="/assets/logo.svg" alt="로고" width={330} height={60} />
      </Link>

      <SignupInput
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

      <SignupInput
        id="nickname"
        label="닉네임"
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        error={nicknameError}
        placeholder="닉네임을 입력해 주세요"
        className={styles.nickname}
        inputClass={styles.nicknameInput}
        labelClass={styles.nicknameText}
      />

      <SignupInput
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
      />

      <SignupInput
        id="passwordCheck"
        label="비밀번호 확인"
        type={showPasswordCheck ? "text" : "password"}
        value={passwordCheck}
        onChange={(e) => setPasswordCheck(e.target.value)}
        error={passwordCheckError}
        placeholder="비밀번호를 한번 더 입력해 주세요"
        className={styles.passwordCheck}
        inputClass={styles.passwordInput}
        labelClass={styles.passwordCheckText}
        showPassword={showPasswordCheck}
        onTogglePassword={togglePasswordCheckVisibility}
        icon={
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
            style={{ cursor: "pointer" }}
          />
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSignup();
        }}
      />

      <div className={styles.btn}>
        <SignupButton
          onClick={handleSignup}
          className={`${styles.button} ${styles.signupbtn}`}
        >
          <span className={styles.signupbtnText}>가입하기</span>
        </SignupButton>

        <SignupButton className={`${styles.button} ${styles.googlebtn}`}>
          <Image
            src="/icons/google.svg"
            alt="Google 아이콘"
            width={22}
            height={22}
          />
          <span className={styles.googlebtnText}>Google로 시작하기</span>
        </SignupButton>
      </div>

      <SignupFooter />
    </div>
  );
}
