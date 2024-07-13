"use client";

import { useRouter } from "next/navigation";

interface ChatRoomPageHeaderProps {
  chatRoom: any;
  openInfoModal: () => void;
}

const ChatRoomPageHeader: React.FC<ChatRoomPageHeaderProps> = ({
  chatRoom,
  openInfoModal,
}) => {
  const router = useRouter();

  const handleBack = (): void => {
    // 뒤로가기
    router.push("/");
  };
  return (
    <header className="chatRoomHeader">
      {chatRoom ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <button className="backButton" onClick={handleBack}>
            <img
              style={{
                width: "30px",
                height: "30px",
              }}
              src="/backIcon.png"
              alt="backIcon"
            />
          </button>
          <div
            onClick={openInfoModal}
            style={{ display: "flex", alignItems: "center" }}
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
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </header>
  );
};

export default ChatRoomPageHeader;
