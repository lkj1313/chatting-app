"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Container } from "react-bootstrap";

import FirstPageHeader from "./firstPageComponent/FirstPageHeader";
import FirstPageMain from "./firstPageComponent/FirstPageMain";
import FirstPageFooter from "./firstPageComponent/FirstPageFooter";
import FriendList from "./firstPageComponent/FriendList";
import { closeSidebar } from "./store/uiSlice";
import Sidebar from "./firstPageComponent/Sidebar";
import ParticipantModal from "./chatroompage/[id]/component/ParticipantModal";

const FirstPage: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState("main");
  const [isReadingMode, setIsReadingMode] = useState(true);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string>("");
  console.log("selectedChatRoomId", selectedChatRoomId);
  const onClickReadingButton = () => {
    setIsReadingMode(false);
  };

  const onClickBackButton = () => {
    setIsReadingMode(true);
  };
  const onSelectChatRoom = (id: string) => {
    setSelectedChatRoomId(id);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const handleLocationChange = () => {
      const currentPath = window.location.pathname;
      const targetPath = "/";

      if (currentPath !== targetPath) {
        dispatch(closeSidebar());
      }
    };

    handleLocationChange();

    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, [dispatch]);

  return (
    <>
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
        <FirstPageHeader
          isReadingMode={isReadingMode}
          onClickReadingButton={onClickReadingButton}
          onClickBackButton={onClickBackButton}
          onSelectChatRoom={onSelectChatRoom}
          activeComponent={activeComponent}
        />
        {activeComponent === "main" ? (
          <FirstPageMain selectedChatRoomId={selectedChatRoomId} />
        ) : (
          <FriendList />
        )}
        <FirstPageFooter
          setActiveComponent={setActiveComponent}
          activeComponent={activeComponent}
        />
      </Container>
      <Sidebar />
      <ParticipantModal />
    </>
  );
};

export default FirstPage;
