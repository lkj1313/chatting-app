"use client";

import React, { useRef, useEffect } from "react";
import { Message } from "./type";

interface MessageListProps {
  messages: Message[];
  userId: string;
  handleImageClick: (url: string) => void;
}

const MessageListComponent: React.FC<MessageListProps> = ({
  messages,
  userId,
  handleImageClick,
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="inner">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message-container ${
            msg.userId === userId ? "mymsg" : ""
          }`}
        >
          {msg.userId !== userId && (
            <img
              src={msg.profileImg}
              alt={msg.userName}
              className="profile-image"
            />
          )}
          <div
            className={`message-box ${msg.userId === userId ? "mymsg" : ""}`}
          >
            {msg.userId !== userId && (
              <div className="user">{msg.userName}</div>
            )}
            <div className="text">
              {msg.text}
              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="Uploaded"
                  style={{
                    maxWidth: "100%",
                    marginTop: "0",
                    cursor: "pointer",
                  }}
                  onClick={() => handleImageClick(msg.imageUrl!)}
                />
              )}
            </div>
            <div className="time">
              {new Date(msg.time).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
      <div ref={messageEndRef}></div>
    </div>
  );
};

export default MessageListComponent;
