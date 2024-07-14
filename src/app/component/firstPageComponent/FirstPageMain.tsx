"use client";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar } from "@/app/store/uiSlice";
import { RootState } from "@/app/store/store";
import Sidebar from "./Sidebar";
import ChatRoomList from "./ChatRoomList";

const FirstPageMain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);

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
