"use client";
import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setContainerWidth,
  setLeftWidth,
  setHeaderHeight,
} from "@/app/store/containerSlice";
import LeftComponent from "./LeftComponent";
import RightComponent from "./RightComponent";

import { setSidebarOpen } from "@/app/store/containerSlice";
import { RootState } from "@/app/store/store";

import HeaderComponent from "../HeaderComponent";

const LayoutContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [fadeIn, setFadeIn] = useState(false); // 추가된 상태
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(
    (state: RootState) => state.container.sidebarOpen
  );
  const leftWidth = useSelector(
    (state: RootState) => state.container.leftWidth
  );
  const headerHeight = useSelector(
    //내비게이션바 높이
    (state: RootState) => state.container.headerHeight
  );

  useLayoutEffect(() => {
    if (containerRef.current) {
      const currentWidth = containerRef.current.offsetWidth;
      dispatch(setContainerWidth(currentWidth));
      dispatch(setLeftWidth(currentWidth * 0.08)); // 초기 너비를 0.8%로 설정
    }
  }, [dispatch]);

  useLayoutEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const newHeaderHeight = headerRef.current.offsetHeight;
        dispatch(setHeaderHeight(newHeaderHeight));
      }
    };

    // 초기 로드 시 헤더 높이 설정
    updateHeaderHeight();

    // 윈도우 리사이즈 시 헤더 높이 업데이트
    window.addEventListener("resize", updateHeaderHeight);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, [dispatch]);

  // leftWidth가 0인 경우 로딩 상태로 렌더링
  useEffect(() => {
    setFadeIn(true);
  }, []);

  if (leftWidth === 0) {
    return <div ref={containerRef} style={{ height: "100vh" }} />;
  }
  return (
    <div
      ref={containerRef}
      className={`container ${fadeIn ? "fade-in" : ""}`} // 수정된 JSX 클래스 추가
      style={{
        height: "100%",
        position: "relative",
        border: "1px solid gray",
        padding: "0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HeaderComponent />

      <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
        {sidebarOpen && (
          <div
            className="overlay show"
            onClick={() => dispatch(setSidebarOpen(false))}
          />
        )}

        <LeftComponent />
        <RightComponent />
      </div>
    </div>
  );
};

export default LayoutContainer;
