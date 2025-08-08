"use client";

import styles from "@/app/myGallery/create/page.module.css";

export default function CreateTextarea({
  id,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error = "",
  className = "",
  labelClass = "",
  ...props
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`${styles.photoCardDescriptionText} ${labelClass}`}
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.photoCardDescriptionInput} ${
          error ? styles.errorInput : ""
        } ${className}`}
        required={required}
        {...props}
      />
      {error && <div className={styles.errorMsg}>{error}</div>}
    </div>
  );
}
