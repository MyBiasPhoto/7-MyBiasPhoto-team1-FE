"use client";

import styles from "@/app/login/page.module.css";

export default function LoginInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  className = "",
  inputClass = "",
  labelClass = "",
  showPassword,
  onTogglePassword,
  icon,
  onKeyDown,
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {id === "password" ? (
        <div className={styles.passwordInputWrapper}>
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={inputClass}
            required
            onKeyDown={onKeyDown}
          />
          {icon}
        </div>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClass}
          required
          onKeyDown={onKeyDown}
        />
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
