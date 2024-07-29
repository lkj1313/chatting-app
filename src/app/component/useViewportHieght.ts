// hooks/useViewportHeight.ts
import { useEffect } from "react";

const useViewportHeight = () => {
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01; // 뷰포트 높이를 1% 단위로 계산
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // 뷰포트 높이 변경 시 실행할 이벤트 리스너 추가
    window.addEventListener("resize", setViewportHeight);
    window.addEventListener("orientationchange", setViewportHeight);

    // 초기 설정
    setViewportHeight();

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", setViewportHeight);
      window.removeEventListener("orientationchange", setViewportHeight);
    };
  }, []);
};

export default useViewportHeight;
