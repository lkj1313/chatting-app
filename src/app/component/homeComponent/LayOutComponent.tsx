"use client";
import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setContainerWidth, setLeftWidth } from "@/app/store/containerSlice";
import LeftComponent from "./LeftComponent";
import RightComponent from "./RightComponent";
import Sidebar from "./SliderComponent";
import { setSidebarOpen } from "@/app/store/containerSlice";
import { RootState } from "@/app/store/store";
import { useRouter } from "next/navigation";

const LayoutContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false); // 추가된 상태
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(
    (state: RootState) => state.container.sidebarOpen
  );
  const leftWidth = useSelector(
    (state: RootState) => state.container.leftWidth
  );

  useLayoutEffect(() => {
    if (containerRef.current) {
      const currentWidth = containerRef.current.offsetWidth;
      dispatch(setContainerWidth(currentWidth));
      dispatch(setLeftWidth(currentWidth * 0.08)); // 초기 너비를 10%로 설정
    }
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
        height: "100vh",
        position: "relative",
        border: "1px solid gray",
        padding: "0",
      }}
    >
      {sidebarOpen && (
        <div
          className="overlay show"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}
      <Sidebar />
      <div
        className="row"
        style={{ height: "100%", display: "flex", flexDirection: "row" }}
      >
        <LeftComponent />
        <RightComponent />
      </div>
    </div>
  );
};

export default LayoutContainer;
