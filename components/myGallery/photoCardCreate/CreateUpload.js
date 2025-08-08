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
}) {
  return (
    <div>
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
        />
        <input
          type="file"
          id={fileInputId}
          accept="image/*"
          style={{ display: "none" }}
          onChange={onFileChange}
        />
        <label htmlFor={fileInputId} className={styles.fileSelectBtn}>
          파일 선택
        </label>
      </div>
    </div>
  );
}
