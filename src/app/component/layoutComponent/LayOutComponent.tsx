"use client";
import React from "react";
import { Container } from "react-bootstrap";
import HeaderComponent from "./HeaderComponent";
import MainComponent from "./MainComponent";

const LayoutComponent: React.FC = () => {
  return (
    <Container style={{ padding: "0" }}>
      <HeaderComponent />
      <MainComponent />
    </Container>
  );
};

export default LayoutComponent;
