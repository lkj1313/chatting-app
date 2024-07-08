"use client";
import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { closeSidebar } from "@/app/store/uiSlice";

import { RootState } from "@/app/store/store";
import Sidebar from "@/app/component/layoutComponent/components/SidebarComponent";
import HeaderComponent from "../HeaderComponent";
import ChatRoomList from "@/app/component/layoutComponent/components/ChatRoomList";
import MainComponent from "./components/MainComponent";

const LayoutComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [fadeIn, setFadeIn] = useState(false); // 추가된 상태
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
  const showModal = useSelector((state: RootState) => state.ui.showModal);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div className="container">
      <HeaderComponent />
      <MainComponent />
      <Sidebar />
    </div>
  );
};

export default LayoutComponent;
