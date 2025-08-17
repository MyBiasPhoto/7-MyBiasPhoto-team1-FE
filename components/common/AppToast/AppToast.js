"use client";
import { Toaster } from "react-hot-toast";
import styles from "./AppToast.module.css";

export default function AppToaster() {
  return <Toaster containerClassName={styles.container} reverseOrder={false} />;
}
