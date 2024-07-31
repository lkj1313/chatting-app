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

const FirstPage: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState("main");
  const [isReadingMode, setIsReadingMode] = useState(true);
  const [selectedChatRoomName, setSelectedChatRoomName] = useState<string>("");

  const onClickReadingButton = () => {
    setIsReadingMode(false);
  };

  const onClickBackButton = () => {
    setIsReadingMode(true);
  };
  const onSelectChatRoom = (channelName: string) => {
    setSelectedChatRoomName(channelName);
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
          onSelectChatRoom={onSelectChatRoom} // 이 부분 추가
        />
        {activeComponent === "main" ? <FirstPageMain /> : <FriendList />}
        <FirstPageFooter
          setActiveComponent={setActiveComponent}
          activeComponent={activeComponent}
        />
      </Container>
      <Sidebar />
    </>
  );
};

export default FirstPage;
