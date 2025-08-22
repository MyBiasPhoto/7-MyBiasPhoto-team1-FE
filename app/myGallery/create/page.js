"use client";

import api from "@/lib/axiosAuth";
import axios from "axios";
import { useState, useEffect } from "react";
import MakePhotoModal from "@/components/modals/makePhotoModal";
import styles from "./page.module.css";
import { useAuth } from "@/utils/auth/authContext";
import CreateInput from "@/components/myGallery/photoCardCreate/CreateInput";
import CreateSelect from "@/components/myGallery/photoCardCreate/CreateSelect";
import CreateUpload from "@/components/myGallery/photoCardCreate/CreateUpload";
import CreateTextarea from "@/components/myGallery/photoCardCreate/CreateTextarea";
import toast from "react-hot-toast";

async function uploadToS3(file, userId) {
  if (!file?.type?.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드 가능합니다.");
  }

  let hashHex;
  try {
    const buf = await file.arrayBuffer();
    const hash = await crypto.subtle.digest("SHA-256", buf);
    hashHex = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    hashHex = undefined;
  }

  const params = new URLSearchParams({
    contentType: file.type,
    size: String(file.size),
    userId: String(userId),
  });
  if (hashHex) params.set("sha256", hashHex);

  const presign = await api.get("/api/photoCard/upload/s3-url", {
    params: {
      contentType: file.type,
      size: String(file.size),
      userId: String(userId),
      ...(hashHex ? { sha256: hashHex } : {}),
    },
    _auth: true,
  });
  const data = presign.data;

  // 같은 파일이면 업로드 생략
  if (data.alreadyExists) {
    return { url: data.publicUrl, key: data.key, alreadyExists: true };
  }

  // S3에 직접 업로드
  await axios.put(data.uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    withCredentials: false,
  });

  return { url: data.publicUrl, key: data.key, alreadyExists: false };
}

export default function CreatePhotoCardPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [grade, setGrade] = useState("");
  const [genre, setGenre] = useState("");

  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();

  const [priceError, setPriceError] = useState("");
  const [quantityError, setQuantityError] = useState("");

  // 모달 테스트 임시용
  const [userCardCount, setUserCardCount] = useState(0);
  const [currentCardTotal, setCurrentCardTotal] = useState(0);
  const [createdGrade, setCreatedGrade] = useState("");
  const [createdName, setCreatedName] = useState("");

  const [uploadedKey, setUploadedKey] = useState(null);
  const [alreadyExists, setAlreadyExists] = useState(false);

  const [monthly, setMonthly] = useState(null);
  const canCreateThisMonth = (monthly?.remaining ?? 1) > 0;

  // ai 이미지 생성
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiPreviewUrl, setAiPreviewUrl] = useState("");

  function dataURLtoBlob(dataURL) {
    const [head, b64] = dataURL.split(",");
    const mime = head.match(/data:(.*);base64/)[1] || "image/png";
    const bin = atob(b64);
    const len = bin.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  const openAiModal = () => {
    setAiOpen(true);
    setAiPrompt("");
    setAiError("");
    setAiPreviewUrl("");
  };
  const closeAiModal = () => {
    if (!aiLoading) {
      setAiOpen(false);
      setAiError("");
    }
  };

  // 생성 호출
  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      setAiError("프롬프트를 입력해 주세요.");
      return;
    }
    setAiError("");
    setAiLoading(true);
    try {
      const res = await fetch("/api/aiImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "이미지 생성 실패");
      setAiPreviewUrl(data.url);
    } catch (e) {
      setAiError(e.message || "이미지 생성 실패");
    } finally {
      setAiLoading(false);
    }
  };

  // 미리보기 확인 → S3 업로드 → imageUrl 주입
  const handleConfirmAI = async () => {
    if (!aiPreviewUrl) return;
    setAiLoading(true);
    try {
      const blob = dataURLtoBlob(aiPreviewUrl);
      const file = new File([blob], `ai_${Date.now()}.png`, {
        type: blob.type || "image/png",
      });

      const { url, key, alreadyExists } = await uploadToS3(file, user.id);

      setImageFile(file);
      setImageUrl(url);
      setUploadedKey(key);
      setAlreadyExists(alreadyExists);

      setAiOpen(false);
    } catch (e) {
      setAiError(e.message || "S3 업로드 실패");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    const fetchQuota = async () => {
      if (!user?.id) return;
      try {
        const r = await api.get("/api/photoCard/upload/quota", {
          params: { userId: user.id },
          _auth: true,
        });
        setMonthly(r.data.monthly);
      } catch (e) {
        console.warn("quota 조회 실패:", e);
      }
    };
    fetchQuota();
  }, [user?.id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isValid()) return;

    try {
      const payload = {
        name,
        description,
        imageUrl,
        grade,
        genre,
        initialPrice: Number(price),
        totalQuantity: Number(quantity),
        creatorId: user.id,
      };

      console.log("payload", payload);

      const res = await api.post("/api/photoCard", payload, { _auth: true });

      const m = res.data?.monthly;
      if (m) {
        setMonthly(m);
      }

      setUserCardCount(res.data.userCardCount ?? 0);
      setCurrentCardTotal(res.data.currentCardTotal ?? 0);
      setCreatedGrade(grade);
      setCreatedName(name);

      setUploadedKey(null);
      setAlreadyExists(false);

      setShowModal(true);
    } catch (err) {
      // 월 한도 초과(409)
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        try {
          if (uploadedKey && !alreadyExists) {
            await api.delete("/api/photoCard/upload/object", {
              params: { key: uploadedKey },
              _auth: true,
            });
          }
        } catch (e) {
          console.warn("S3 정리 실패:", e);
        }

        const { message, monthly } = err.response.data || {};
        if (monthly) setMonthly(monthly);
        toast.error(message || "이번 달 생성 한도를 초과했습니다.", {
          style: {
            fontFamily: "BR-B",
            background: "var(--black)",
            border: "1px solid var(--main)",
            padding: "16px 20px",
            color: "var(--white)",
            fontSize: "20px",
          },
          duration: 800,
        });
        return;
      }
      setUserCardCount(999);
      setCurrentCardTotal(999);
      setCreatedGrade(grade);
      setCreatedName(name);
      setShowModal(true);
    }
  };

  const handleFileChange = async (e) => {
    if (!canCreateThisMonth) {
      toast.error("이번 달 생성 한도를 초과했습니다.", {
        style: {
          fontFamily: "BR-B",
          background: "var(--black)",
          border: "1px solid var(--main)",
          padding: "16px 20px",
          color: "var(--white)",
          fontSize: "20px",
        },
        duration: 800,
      });
      e.target.value = "";
      return;
    }

    const file = e.target.files?.[0];
    setImageFile(file || null);

    if (!file) {
      setImageUrl("");
      setUploadedKey(null);
      setAlreadyExists(false);
      return;
    }

    try {
      const { url, key, alreadyExists } = await uploadToS3(file, user.id);
      setImageUrl(url);
      setUploadedKey(key);
      setAlreadyExists(alreadyExists);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "이미지 업로드 실패", {
        style: {
          fontFamily: "BR-B",
          background: "var(--black)",
          border: "1px solid var(--main)",
          padding: "16px 20px",
          color: "var(--white)",
          fontSize: "20px",
        },
        duration: 800,
      });
      setImageUrl("");
      setUploadedKey(null);
      setAlreadyExists(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setQuantity(value);

    if (Number(value) > 10) {
      setQuantityError("총 발행량은 10장 이하로 선택 가능합니다.");
    } else if (value === "" || isNaN(Number(value)) || Number(value) < 1) {
      setQuantityError("총 발행량은 1장 이상 입력해 주세요.");
    } else {
      setQuantityError("");
    }
  };

  function isValid() {
    if (
      !name.trim() ||
      !grade ||
      !genre ||
      !price.trim() ||
      !quantity.trim() ||
      !description.trim() ||
      !imageUrl.trim()
    )
      return false;

    if (
      isNaN(Number(price)) ||
      Number(price) < 0 ||
      isNaN(Number(quantity)) ||
      Number(quantity) < 1
    )
      return false;

    if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(imageUrl.trim())) return false;

    return true;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title_Box}>
        <p className={styles.title_Text}>포토카드 생성</p>
        {monthly && (
          <div className={styles.monthlyBadge} role="status">
            <strong>이번 달 남은 생성 수</strong>:{" "}
            {Math.max(0, monthly.remaining)}/{monthly.limit}
          </div>
        )}
      </div>

      <CreateInput
        id="photocardname"
        label="포토카드 이름"
        placeholder="포토카드 이름을 입력해 주세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <CreateSelect
        id="grade"
        label="등급"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        required
        options={[
          { value: "COMMON", label: "COMMON" },
          { value: "RARE", label: "RARE" },
          { value: "SUPER_RARE", label: "SUPER RARE" },
          { value: "LEGENDARY", label: "LEGENDARY" },
        ]}
        placeholder="등급을 선택해 주세요"
      />

      <CreateSelect
        id="genre"
        label="장르"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        required
        options={[
          { value: "ALBUM", label: "앨범" },
          { value: "SPECIAL", label: "특전" },
          { value: "FANSIGN", label: "팬싸" },
          { value: "SEASON_GREETING", label: "시즌그리팅" },
          { value: "FANMEETING", label: "팬미팅" },
          { value: "CONCERT", label: "콘서트" },
          { value: "MD", label: "MD" },
          { value: "COLLAB", label: "콜라보" },
          { value: "FANCLUB", label: "팬클럽" },
          { value: "ETC", label: "기타" },
        ]}
        placeholder="장르를 선택해 주세요"
      />

      <div className={styles.photoCardPrice}>
        <label htmlFor="price" className={styles.photoCardPriceText}>
          가격
        </label>
        <input
          id="price"
          type="text"
          value={price}
          onChange={(e) => {
            const value = e.target.value;
            setPrice(value);

            if (value === "" || isNaN(Number(value)) || Number(value) < 0) {
              setPriceError("가격은 0원 이상 입력해 주세요.");
            } else {
              setPriceError("");
            }
          }}
          placeholder="가격을 입력해 주세요"
          className={`${styles.photoCardPriceInput} ${
            priceError ? styles.errorInput : ""
          }`}
          required
        />
        {priceError && <div className={styles.errorMsg}>{priceError}</div>}
      </div>

      <div className={styles.photoCardQuantity}>
        <label htmlFor="quantity" className={styles.photoCardQuantityText}>
          총 발행량
        </label>
        <input
          id="quantity"
          type="text"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder="총 발행량을 입력해 주세요"
          className={`${styles.photoCardQuantityInput} ${
            quantityError ? styles.errorInput : ""
          }`}
          required
        />
        {quantityError && (
          <div className={styles.errorMsg}>{quantityError}</div>
        )}
      </div>

      <CreateUpload
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        imageFile={imageFile}
        onFileChange={handleFileChange}
        disabled={!canCreateThisMonth}
      />
      <button
        type="button"
        onClick={openAiModal}
        disabled={!canCreateThisMonth}
        className={styles.aibtn}
      >
        AI 이미지 생성{" "}
      </button>

      <CreateTextarea
        id="description"
        label="포토카드 설명"
        placeholder="카드 설명을 입력해 주세요"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <button
        className={`${styles.create} ${isValid() ? styles.createActive : ""}`}
        disabled={!isValid()}
        onClick={handleCreate}
      >
        <div
          className={`${styles.createText} ${isValid() ? styles.active : ""}`}
        >
          생성하기
        </div>
      </button>
      {showModal && (
        <MakePhotoModal
          userCardCount={userCardCount}
          currentCardTotal={currentCardTotal}
          cardGrade={createdGrade}
          cardTitle={createdName}
          onClose={() => setShowModal(false)}
          monthlyInfo={monthly}
        />
      )}

      {aiOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99,
          }}
          className={styles.aiModalOverlay}
          onClick={closeAiModal}
        >
          <div
            style={{
              width: "min(560px, 92vw)",
              background: "#1b1b1b",
              color: "#fff",
              border: "1px solid #333",
              borderRadius: 8,
              padding: 20,
            }}
            className={styles.aiModal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3 style={{ margin: 0, marginBottom: 12 }}>AI 이미지 생성</h3>

            <label style={{ fontSize: 14, color: "#ccc" }}>프롬프트</label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="예) cute lesser panda (영어로 입력) "
              rows={4}
              style={{
                width: "100%",
                boxSizing: "border-box",
                marginTop: 8,
                marginBottom: 12,
                background: "#0f0f0f",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: 6,
                padding: "10px 12px",
                resize: "vertical",
              }}
            />

            {aiError && (
              <div style={{ color: "var(--red)", marginBottom: 8 }}>
                {aiError}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={aiLoading}
                style={{
                  padding: "10px 16px",
                  background: "var(--main)",
                  color: "#000",
                  border: 0,
                  borderRadius: 6,
                  cursor: aiLoading ? "wait" : "pointer",
                }}
              >
                {aiLoading ? "생성 중..." : "이미지 생성"}
              </button>
              <button
                type="button"
                onClick={closeAiModal}
                disabled={aiLoading}
                style={{
                  padding: "10px 16px",
                  background: "#333",
                  color: "#fff",
                  border: 0,
                  borderRadius: 6,
                  cursor: aiLoading ? "not-allowed" : "pointer",
                }}
              >
                닫기
              </button>
            </div>

            {aiPreviewUrl && (
              <>
                <div
                  style={{
                    border: "1px solid #333",
                    borderRadius: 6,
                    overflow: "hidden",
                    marginBottom: 12,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={aiPreviewUrl}
                    alt="AI Preview"
                    style={{ width: "100%", display: "block" }}
                  />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={handleConfirmAI}
                    disabled={aiLoading}
                    style={{
                      padding: "10px 16px",
                      background: "var(--main)",
                      color: "#000",
                      border: 0,
                      borderRadius: 6,
                      cursor: aiLoading ? "wait" : "pointer",
                    }}
                  >
                    이 이미지 사용하기
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPreviewUrl("")}
                    disabled={aiLoading}
                    style={{
                      padding: "10px 16px",
                      background: "#444",
                      color: "#fff",
                      border: 0,
                      borderRadius: 6,
                      cursor: aiLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    생성 취소
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
