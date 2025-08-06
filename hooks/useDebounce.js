// hooks/useDebounce.js

import { useState, useEffect } from "react";

export default function useDebounce(value, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler); // cleanup
  }, [value, delay]);

  return debouncedValue;
}
