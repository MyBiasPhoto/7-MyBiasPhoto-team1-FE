"use client";

import styles from "@/app/myGallery/create/page.module.css";

export default function CreateUpload({
  value,
  onChange,
  imageFile,
  onFileChange,
  label = "사진 업로드",
  inputId = "imageurl",
  fileInputId = "fileInput",
  required = false,
  disabled = false,
  disabledMsg = "이번 달 생성 한도를 초과했습니다.",
}) {
  return (
    <div className={styles.photoCardUpload} aria-disabled={disabled}>
      <label htmlFor={inputId} className={styles.photoCardUploadText}>
        {label}
      </label>
      <div className={styles.upload}>
        <input
          id={inputId}
          value={value}
          readOnly
          onChange={onChange}
          placeholder="사진 업로드"
          className={styles.photoCardUploadInput}
          required={required}
          disabled={disabled}
        />
        <input
          type="file"
          id={fileInputId}
          accept="image/*"
          style={{ display: "none" }}
          onChange={onFileChange}
          disabled={disabled}
        />
        <label
          htmlFor={disabled ? undefined : fileInputId}
          className={styles.fileSelectBtn}
          onClick={(e) => {
            if (disabled) {
              e.preventDefault();
              alert(disabledMsg);
            }
          }}
        >
          파일 선택
        </label>
      </div>
      {disabled && (
        <p style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
          {disabledMsg}
        </p>
      )}
    </div>
  );
}
