"use client";

import axios from "axios";
import { useState } from "react";
import MakePhotoModal from "@/components/modals/makePhotoModal";
import styles from "./page.module.css";
import { useAuth } from "@/utils/auth/authContext";
import CreateInput from "@/components/myGallery/photoCardCreate/CreateInput";
import CreateSelect from "@/components/myGallery/photoCardCreate/CreateSelect";
import CreateUpload from "@/components/myGallery/photoCardCreate/CreateUpload";
import CreateTextarea from "@/components/myGallery/photoCardCreate/CreateTextarea";

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

  // 이것도 임시
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

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/photoCard`,
        payload
      );
      setUserCardCount(res.data.userCardCount ?? 0);
      setCurrentCardTotal(res.data.currentCardTotal ?? 0);
      setCreatedGrade(grade);
      setCreatedName(name);

      setShowModal(true);
    } catch (err) {
      setUserCardCount(999);
      setCurrentCardTotal(999);
      setCreatedGrade(grade);
      setCreatedName(name);
      setShowModal(true);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // 사진 업로드 테스트
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        setImageUrl(`${baseUrl}${res.data.url}`);
      } catch (err) {
        alert("이미지 업로드 실패");
        setImageUrl("");
      }
    } else {
      setImageUrl("");
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

    if (!/\.(jpg|jpeg|png|gif)$/i.test(imageUrl.trim())) return false;

    return true;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title_Box}>
        <p className={styles.title_Text}>포토카드 생성</p>
      </div>

      <div className={styles.photoCardName}>
        <CreateInput
          id="photocardname"
          label="포토카드 이름"
          placeholder="포토카드 이름을 입력해 주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className={styles.photoCardGrade}>
        <CreateSelect
          id="grade"
          label="등급"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          required
          options={[
            { value: "COMMON", label: "흔한" },
            { value: "RARE", label: "레어" },
            { value: "SUPER_RARE", label: "슈퍼레어" },
            { value: "LEGENDARY", label: "레전드리" },
          ]}
          placeholder="등급을 선택해 주세요"
        />
      </div>

      <div className={styles.photoCardGenre}>
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
      </div>

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

      <div className={styles.photoCardUpload}>
        <CreateUpload
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          imageFile={imageFile}
          onFileChange={handleFileChange}
        />
      </div>

      <div className={styles.photoCardDescription}>
        <CreateTextarea
          id="description"
          label="포토카드 설명"
          placeholder="카드 설명을 입력해 주세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <button
          className={styles.create}
          style={{
            background: isValid() ? "var(--main)" : "var(--gray-400)",
          }}
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
          />
        )}
      </div>
    </div>
  );
}
