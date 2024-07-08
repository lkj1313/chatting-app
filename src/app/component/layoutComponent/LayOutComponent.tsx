"use client";
import HeaderComponent from "./HeaderComponent";
import MainComponent from "./MainComponent";
import Sidebar from "./SidebarComponent";

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
