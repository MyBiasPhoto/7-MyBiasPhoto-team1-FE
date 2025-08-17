"use client";
import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 743) {
  const [isMobile, setIsMobile] = useState(null);
  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth <= breakpoint);
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, [breakpoint]);
  return isMobile;
}
