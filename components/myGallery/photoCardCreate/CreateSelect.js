"use client";

import styles from "@/app/myGallery/create/page.module.css";

export default function CreateSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  className = "",
  labelClass = "",
}) {
  const colorMap = {
    COMMON: "var(--main)",
    RARE: "var(--blue)",
    SUPER_RARE: "var(--purple)",
    LEGENDARY: "var(--pink)",
  };

  return (
    <div className={styles.photoCardGrade}>
      <label
        htmlFor={id}
        className={`${styles.photoCardLabelText} ${labelClass}`}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`${styles.photoCardSelect} ${className}`}
        required={required}
        style={{ color: colorMap[value] || "var(--white)" }}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map(opt => (
          <option
            key={opt.value}
            value={opt.value}
            style={{ color: "var(--white)", background: "var(--black)" }}
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
