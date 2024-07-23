"use client";
import React from "react";
import { Container } from "react-bootstrap";
import FirstPageHeader from "../firstPageComponent/FirstPageHeader";
import FirstPageFooter from "../firstPageComponent/FirstPageFooter";

import FriendList from "./component/FriendList";
import ParticipantModal from "../chatroompage/[id]/component/ParticipantModal";
import Sidebar from "../firstPageComponent/Sidebar";

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
      <Sidebar />
    </Container>
  );
};

export default FriendPage;
