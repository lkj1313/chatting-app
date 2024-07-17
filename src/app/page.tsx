"use client";
import React from "react";
import { Container } from "react-bootstrap";

import FirstPageHeader from "./component/firstPageComponent/FirstPageHeader";
import FirstPageMain from "./component/firstPageComponent/FirstPageMain";
import FirstPageFooter from "./component/firstPageComponent/FirstPageFooter";

const LayoutComponent: React.FC = () => {
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
    </Container>
  );
};

export default LayoutComponent;
