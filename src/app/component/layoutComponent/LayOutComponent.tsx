"use client";
import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { closeSidebar } from "@/app/store/uiSlice";
import { RootState } from "@/app/store/store";
import Sidebar from "@/app/component/layoutComponent/components/SidebarComponent";
import HeaderComponent from "../HeaderComponent";
import ChatRoomList from "@/app/component/layoutComponent/components/ChatRoomList";

const LayoutComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [fadeIn, setFadeIn] = useState(false); // 추가된 상태
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
  const showModal = useSelector((state: RootState) => state.ui.showModal);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div className="container">
      <HeaderComponent />
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
        {" "}
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
    </div>
  );
};

export default LayoutComponent;
