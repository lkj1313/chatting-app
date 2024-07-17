"use client";
import React, { useRef } from "react";

import ChatRoomList from "./ChatRoomList";

const FirstPageMain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <main
      ref={containerRef}
      className="firstPageMaincontainer" // 수정된 JSX 클래스 추가
    >
      <ChatRoomList />
    </main>
  );
};

export default FirstPageMain;
