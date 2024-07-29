// components/PageTransition.tsx
"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const variants = {
  initial: { opacity: 0, y: -300 }, // 초기 상태: 요소가 보이지 않고 위쪽에 위치
  enter: { opacity: 1, y: 0 }, // 애니메이션 상태: 요소가 보이고 원래 위치로 이동
  exit: { opacity: 0, y: 300 }, // 애니메이션 종료 상태: 요소가 보이지 않고 아래쪽으로 이동
};

const transition = {
  duration: 0.5, // 애니메이션 지속 시간 (초 단위)
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={transition}
        style={{ height: "100%", width: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
