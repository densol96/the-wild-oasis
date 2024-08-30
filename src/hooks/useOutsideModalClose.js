import { useEffect, useRef } from "react";

function useOutsideModalClose(close) {
  const ref = useRef(); // modalWinndow
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }, []);

  return ref;
}

export default useOutsideModalClose;
