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
  return (
    <div>
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
        style={{
          color: value === "" ? "var(--gray-400)" : "var(--white)",
        }}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            style={{ color: "var(--white)" }}
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
