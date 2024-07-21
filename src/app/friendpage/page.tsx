"use client";
import React from "react";
import { Container } from "react-bootstrap";
import FirstPageHeader from "../component/firstPageComponent/FirstPageHeader";
import FirstPageFooter from "../component/firstPageComponent/FirstPageFooter";

import FriendList from "./component/FriendList";
import ParticipantModal from "../component/chatRommPageComponent/ParticipantModal";

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
      <FriendList />
      <FirstPageFooter />
      <ParticipantModal />
    </Container>
  );
};

export default FriendPage;
