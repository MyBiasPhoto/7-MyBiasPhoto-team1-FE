"use client";

export default function LoginButton({
  type = "button",
  onClick,
  className = "",
  children,
  ...props
}) {
  return (
    <button type={type} onClick={onClick} className={className} {...props}>
      {children}
    </button>
  );
}
