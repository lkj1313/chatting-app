"use client";
import React from "react";
import { Container } from "react-bootstrap";

import FirstPageHeader from "./component/firstPageComponent/FirstPageHeader";
import FirstPageMain from "./component/firstPageComponent/FirstPageMain";
import FirstPageFooter from "./component/firstPageComponent/FirstPageFooter";
import Sidebar from "./component/firstPageComponent/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar } from "@/app/store/uiSlice";
import { RootState } from "@/app/store/store";

const LayoutComponent: React.FC = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
  return (
    <Container
      style={{
        margin: "0",
        padding: "0",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <FirstPageHeader />
      <FirstPageMain />
      <FirstPageFooter />
    </Container>
  );
};

export default LayoutComponent;
