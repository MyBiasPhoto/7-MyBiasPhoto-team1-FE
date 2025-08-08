"use client";

import styles from "@/app/myGallery/create/page.module.css";

export default function CreateInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  required = false,
  className = "",
  labelClass = "",
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`${styles.photoCardLabelText} ${labelClass}`}
      >
        등급
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.photoCardNameInput} ${
          error ? styles.errorInput : ""
        } ${className}`}
        required={required}
      />
      {error && <div className={styles.errorMsg}>{error}</div>}
    </div>
  );
}
