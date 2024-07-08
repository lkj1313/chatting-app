// MainContainer.tsx
"use client";
import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar } from "@/app/store/uiSlice";
import { RootState } from "@/app/store/store";
import Sidebar from "./SidebarComponent";
import ChatRoomList from "./ChatRoomList";

const MainComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);

  return (
    <main
      ref={containerRef}
      className="container" // 수정된 JSX 클래스 추가
      style={{
        height: "calc(100vh - 50px)",
        position: "relative",
        border: "1px solid gray",
        width: "100%",
        padding: "0",
        margin: "0",
        display: "flex",
        flexDirection: "column",
        backgroundImage: "url('backgroundImg.jpg ')",
        backgroundSize: "cover", // 크기에 맞게 이미지 조정
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "calc(100% - 50px)",
        }}
      >
        {sidebarOpen && (
          <div
            className="overlay show"
            onClick={() => dispatch(closeSidebar())}
          />
        )}
        <Sidebar />
        <ChatRoomList />
      </div>
    </main>
  );
};

export default MainComponent;
