"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Sidebar from "./Sidebar";

interface ChatRoomPageHeaderProps {
  chatRoom: any;
  openInfoModal: () => void;
}

const ChatRoomPageHeader: React.FC<ChatRoomPageHeaderProps> = ({
  chatRoom,
  openInfoModal,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleBack = (): void => {
    // 뒤로가기
    router.back();
  };

  const handleBarButtonClick = (): void => {
    setSidebarOpen(true);
  };

  return (
    <header
      className="chatRoomHeader"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {" "}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {chatRoom ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="backButton" onClick={handleBack} role="button">
            <img
              style={{
                width: "30px",
                height: "30px",
              }}
              src="/backIcon.png"
              alt="backIcon"
            />
          </div>

          <div
            onClick={openInfoModal}
            style={{ display: "flex", alignItems: "center", flexGrow: "1" }}
          >
            {chatRoom.chatRoomImg ? (
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "25px",
                  marginRight: "20px",
                }}
                src={chatRoom.chatRoomImg}
                alt="Chat Room Image"
              />
            ) : (
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "25px",
                  backgroundColor: "#ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "12px",
                  textAlign: "center",
                  marginRight: "20px",
                }}
              >
                {chatRoom?.channelName?.[0] || "N/A"}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p
                style={{
                  margin: "0",
                  fontSize: "18px",
                  userSelect: "none",
                }}
              >
                {chatRoom?.channelName}
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "13px",
                  userSelect: "none",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                구독자수 : {chatRoom?.participants?.length}명
              </p>
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              className="barButton"
              style={{
                backgroundColor: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
              }}
              onClick={handleBarButtonClick}
              role="button"
            >
              <img
                style={{
                  width: "30px",
                  height: "30px",
                }}
                src="/Hamburger_icon.png"
                alt="barIcon"
              />
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </header>
  );
};

export default ChatRoomPageHeader;
