"use client";
import { Toaster } from "react-hot-toast";
import styles from "./AppToast.module.css";

export default function AppToaster() {
  return (
    <Toaster
      containerClassName={styles.container}
      toastOptions={{
        className: styles.toast,
        iconTheme: { primary: "var(--main)", secondary: "var(--black)" },
        duration: 1500,
      }}
      reverseOrder={false}
    />
  );
}
