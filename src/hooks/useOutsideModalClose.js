import { useEffect, useRef } from "react";

function useOutsideModalClose(close, additionalConditional) {
  const ref = useRef(); // modalWinndow
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        if (additionalConditional) {
          additionalConditional(e.target) && close();
        } else {
          close();
        }
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
