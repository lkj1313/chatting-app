"use client";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";

import FirstPageHeader from "./firstPageComponent/FirstPageHeader";
import FirstPageMain from "./firstPageComponent/FirstPageMain";
import FirstPageFooter from "./firstPageComponent/FirstPageFooter";

import { closeSidebar } from "./store/uiSlice"; // closeSidebar 액션 임포트
import Sidebar from "./firstPageComponent/Sidebar";

const FirstPage: React.FC = () => {
  const dispatch = useDispatch();

  // "/"가 아니면 홈 사이드바 닫음
  useEffect(() => {
    const handleLocationChange = () => {
      const currentPath = window.location.pathname; // 현재 url경로
      const targetPath = "/"; // 사이드바를 열어야 하는 특정 경로

      if (currentPath !== targetPath) {
        dispatch(closeSidebar());
      }
    };

    // 로드 시 경로 확인
    handleLocationChange();

    // popstate 이벤트를 사용하여 브라우저 탐색 감지
    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, [dispatch]);
  return (
    <Container
      style={{
        margin: "0",
        padding: "0",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FirstPageHeader />
      <FirstPageMain />
      <FirstPageFooter />
      <Sidebar /> {/* 사이드바 컴포넌트 렌더링 */}
    </Container>
  );
};

export default FirstPage;
