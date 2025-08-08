"use client";
export default function SignupButton({
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
