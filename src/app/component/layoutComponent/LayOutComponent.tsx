"use client";
import Sidebar from "@/app/component/layoutComponent/components/SidebarComponent";
import HeaderComponent from "../HeaderComponent";

import MainComponent from "./components/MainComponent";

const LayoutComponent: React.FC = () => {
  return (
    <div className="container">
      <HeaderComponent />
      <MainComponent />
      <Sidebar />
    </div>
  );
};

export default LayoutComponent;
