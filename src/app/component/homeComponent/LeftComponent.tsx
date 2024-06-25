"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { setSidebarOpen } from "@/app/store/containerSlice";
import Sidebar from "@/app/component/homeComponent/sidebarComponent/SidebarComponent";

const LeftComponent: React.FC = () => {
  const [width, setWidth] = useState("8%"); // 초기 너비를 8%로 설정
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dispatch = useDispatch();

  const toggleWidth = () => {
    if (windowWidth > 761) {
      // 761px 이상일 때만 토글 기능 활성화
      setWidth((prevWidth) => (prevWidth === "8%" ? "15%" : "8%"));
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 330) {
        setWidth("35%"); // 330px 미만일 때 너비를 40%로 설정
      } else if (330 <= window.innerWidth && window.innerWidth <= 460) {
        setWidth("30%"); // 330px 이상 390px 이하일 때 너비를 30%로 설정
      } else if (window.innerWidth <= 761) {
        setWidth("25%"); // 761px 이하일 때 너비를 15%로 설정
      } else {
        setWidth("8%"); // 기본 너비 설정
      }
    };

    window.addEventListener("resize", handleResize);

    // 초기 로드 시에도 너비를 설정
    handleResize();

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: width,
        transition: "width 0.3s ease",
        borderRight: "1px solid #ccc",
        boxSizing: "border-box",
        padding: "0",
        position: "relative",
      }}
    >
      <Sidebar />
      <div
        style={{
          marginTop: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <button
          className="hamburger"
          onClick={() => dispatch(setSidebarOpen(true))}
        >
          <img style={{ width: "40px" }} src="/Hamburger_icon.png" />
        </button>
      </div>
      <div
        className="resizable-handle"
        onClick={toggleWidth}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "7px",
          cursor: "pointer",
          backgroundColor: "#007bff",
        }}
      />
    </div>
  );
};

export default LeftComponent;
