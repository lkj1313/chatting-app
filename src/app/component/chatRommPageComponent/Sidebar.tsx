import React from "react";

interface SidebarProps {
  sidebarOpen: boolean;
}
const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
  return (
    <div>
      {" "}
      {sidebarOpen && ( //sidebar열릴시 배경 overlay
        <div
          className={`sidebarOverlay ${sidebarOpen ? "overlayShow" : ""}`}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
