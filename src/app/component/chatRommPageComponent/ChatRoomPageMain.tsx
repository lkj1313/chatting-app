"use client";
import React, { useRef, useEffect } from "react";
import { Message } from "./type";
import { useDispatch } from "react-redux";
import {
  openParticipantModal,
  closeParticipantModal,
} from "@/app/store/participantModalSlice";

interface MessageListProps {
  messages: Message[];
  userId: string;
  handleImageClick: (url: string) => void;
  totalParticipants: number; // 총 구독자 수 추가
}

const ChatRoomPageMain: React.FC<MessageListProps> = ({
  messages,
  userId,
  handleImageClick,
  totalParticipants,
}) => {
  const dispatch = useDispatch();
  const innerRef = useRef<HTMLDivElement>(null);

  // 메시지가 변경될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.scrollTop = innerRef.current.scrollHeight;
    }
  }, [messages]);
  const handleProfileClick = (msg: Message) => {
    dispatch(
      openParticipantModal({
        uid: msg.userId,
        nickname: msg.userName,
        profileImg: msg.profileImg,
      })
    );
  };

  return (
    <div className="inner " ref={innerRef}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message-container ${
            msg.userId === userId ? "mymsg" : ""
          }`}
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
                  <span>{totalParticipants - msg.readBy.length} unread</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatRoomPageMain;
