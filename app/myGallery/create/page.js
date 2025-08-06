"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function CreatePhotoCardPage() {
  const [grade, setGrade] = useState("");
  const [genre, setGenre] = useState("");
  return (
    <div className={styles.container}>
      <div className={styles.title_Box}>
        <p className={styles.title_Text}>포토카드 생성</p>
      </div>

      <div className={styles.photoCardName}>
        <label htmlFor="photocardname" className={styles.photoCardNameText}>
          포토카드 이름
        </label>
        <input
          id="photocardname"
          type="text"
          placeholder="포토카드 이름을 입력해 주세요"
          className={styles.photoCardNameInput}
          required
        />
      </div>

      <div className={styles.photoCardGrade}>
        <label htmlFor="grade" className={styles.photoCardLabelText}>
          등급
        </label>
        <select
          id="grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className={styles.photoCardSelect}
          required
          style={{
            color: grade === "" ? "var(--gray-400)" : "var(--white)",
          }}
        >
          <option value="" disabled hidden>
            등급을 선택해 주세요
          </option>
          <option value="COMMON" style={{ color: "var(--white)" }}>
            흔한
          </option>
          <option value="RARE" style={{ color: "var(--white)" }}>
            레어
          </option>
          <option value="SUPER_RARE" style={{ color: "var(--white)" }}>
            슈퍼레어
          </option>
          <option value="LEGENDARY" style={{ color: "var(--white)" }}>
            레전드리
          </option>
        </select>
      </div>

      <div className={styles.photoCardGenre}>
        <label htmlFor="genre" className={styles.photoCardLabelText}>
          장르
        </label>
        <select
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className={styles.photoCardSelect}
          required
          style={{
            color: genre === "" ? "var(--gray-400)" : "var(--white)",
          }}
        >
          <option value="" disabled hidden>
            장르를 선택해 주세요
          </option>
          <option value="ALBUM" style={{ color: "var(--white)" }}>
            앨범
          </option>
          <option value="SPECIAL" style={{ color: "var(--white)" }}>
            특전
          </option>
          <option value="FANSIGN" style={{ color: "var(--white)" }}>
            팬싸
          </option>
          <option value="SEASON_GREETING" style={{ color: "var(--white)" }}>
            시즌그리팅
          </option>
          <option value="FANMEETING" style={{ color: "var(--white)" }}>
            팬미팅
          </option>
          <option value="CONCERT" style={{ color: "var(--white)" }}>
            콘서트
          </option>
          <option value="MD" style={{ color: "var(--white)" }}>
            MD
          </option>
          <option value="COLLAB" style={{ color: "var(--white)" }}>
            콜라보
          </option>
          <option value="FANCLUB" style={{ color: "var(--white)" }}>
            팬클럽
          </option>
          <option value="ETC" style={{ color: "var(--white)" }}>
            기타
          </option>
        </select>
      </div>

      <div className={styles.photoCardGenre}>
        <label htmlFor="price" className={styles.photoCardNameText}>
          가격
        </label>
        <input
          id="price"
          type="text"
          placeholder="가격을 입력해 주세요"
          className={styles.photoCardNameInput}
          required
        />
      </div>

      <div className={styles.photoCardGenre}>
        <label htmlFor="amount" className={styles.photoCardNameText}>
          총 발행량
        </label>
        <input
          id="amount"
          type="text"
          placeholder="총 발행량을 입력해 주세요"
          className={styles.photoCardNameInput}
          required
        />
      </div>

      <div className={styles.photoCardGenre}>
        <label htmlFor="photocardname" className={styles.photoCardNameText}>
          사진 업로드
        </label>
        <input
          id="photocardname"
          placeholder="사진 업로드"
          className={styles.photoCardNameInput}
          required
        />
        <button type="file" accept="image/*">
          파일 선택
        </button>
      </div>

      <div className={styles.photoCardGenre}>
        <label htmlFor="photocardname" className={styles.photoCardNameText}>
          포토카드 설명
        </label>
        <input
          id="photocardname"
          type="text"
          placeholder="카드 설명을 입력해 주세요"
          className={styles.photoCardNameInput}
          required
        />
      </div>

      <button>생성하기</button>
    </div>
  );
}
