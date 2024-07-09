"use client";

interface ChatRoomHeaderProps {
  chatRoom: any;
  openInfoModal: () => void;
}

const ChatRoomHeader: React.FC<ChatRoomHeaderProps> = ({
  chatRoom,
  openInfoModal,
}) => {
  return (
    <header className="chatRoomHeader" onClick={openInfoModal}>
      {chatRoom ? (
        <div style={{ display: "flex", alignItems: "center" }}>
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
          <div style={{ display: "flex" }}>
            <p
              style={{
                margin: "0",
                fontSize: "13px",
                userSelect: "none",
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              channelName : &nbsp;
            </p>
            <p
              style={{
                margin: "0",
                fontSize: "13px",
                userSelect: "none",
                flexGrow: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {chatRoom?.channelName || "N/A"}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </header>
  );
};

export default ChatRoomHeader;
