"use client";
import React from "react";
import { Container } from "react-bootstrap";

import FirstPageHeader from "./component/firstPageComponent/FirstPageHeader";
import FirstPageMain from "./component/firstPageComponent/FirstPageMain";

const LayoutComponent: React.FC = () => {
  return (
    <Container style={{ margin: "0", padding: "0", height: "100vh" }}>
      <FirstPageHeader />
      <FirstPageMain />
    </Container>
  );
};

export default LayoutComponent;
