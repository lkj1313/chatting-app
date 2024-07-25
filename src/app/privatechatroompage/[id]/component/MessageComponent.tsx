import React from "react";
import { Message } from "./type";

interface MessageComponentProps {
  msg: Message;
  userId: string | null;
  totalParticipants: number;
  handleProfileClick: (msg: Message) => void;
  handleImageClick: (url: string) => void;
}

const MessageComponent: React.FC<MessageComponentProps> = React.memo(
  ({
    msg,
    userId,
    totalParticipants,
    handleProfileClick,
    handleImageClick,
  }) => {
    return (
      <div
        key={msg.id}
        className={`message-container ${msg.userId === userId ? "mymsg" : ""}`}
      >
        {msg.userId !== userId && (
          <img
            style={{ cursor: "pointer" }}
            src={msg.profileImg}
            alt={msg.userName}
            className="profile-image"
            onClick={() => handleProfileClick(msg)}
          />
        )}
        <div className={`message-box ${msg.userId === userId ? "mymsg" : ""}`}>
          {msg.userId !== userId && <div className="user">{msg.userName}</div>}
          <div className="text">
            {msg.text}
            {msg.imageUrl && (
              <img
                src={msg.imageUrl}
                alt="Uploaded"
                style={{ maxWidth: "100%", marginTop: "0", cursor: "pointer" }}
                onClick={() => handleImageClick(msg.imageUrl!)}
              />
            )}
          </div>
          <div
            className={`time ${
              msg.userId === userId ? "my-time" : "their-time"
            }`}
          >
            {new Date(msg.time).toLocaleTimeString()}
          </div>
          <div
            className={`read-by ${
              msg.userId === userId ? "my-read" : "their-read"
            }`}
          >
            {msg.readBy.length < totalParticipants && (
              <div className="unread-count">
                <span>{totalParticipants - 1 - msg.readBy.length} unread</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default MessageComponent;
