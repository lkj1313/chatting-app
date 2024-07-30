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
      {activeComponent === "main" ? <FirstPageMain /> : <FriendList />}
      <FirstPageFooter setActiveComponent={setActiveComponent} />
      <Sidebar />
    </Container>
  );
};

export default FirstPage;
