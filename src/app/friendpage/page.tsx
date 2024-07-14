"use client";
import React from "react";
import { Container } from "react-bootstrap";
import FirstPageHeader from "../component/firstPageComponent/FirstPageHeader";
import FirstPageFooter from "../component/firstPageComponent/FirstPageFooter";
import FirstPageMain from "../component/firstPageComponent/FirstPageMain";

const FriendPage = () => {
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

export default FriendPage;
