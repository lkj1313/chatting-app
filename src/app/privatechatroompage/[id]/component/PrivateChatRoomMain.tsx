"use client";
import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessagesByChatRoomId,
  clearMessages,
} from "@/app/store/privateChatRoomMessagesSlice";
import { participantInfo } from "@/app/store/participantModalSlice";
import { RootState, AppDispatch } from "@/app/store/store";
import { usePathname } from "next/navigation";
import { Message } from "./type";
import ImageModal from "@/app/chatroompage/[id]/component/ImageModal";

const PrivateChatRoomPageMain: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const innerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // URL 경로에서 채팅방 ID 추출
  const chatRoomId = pathname.split("/")[2];

  const userId = useSelector((state: RootState) => state.auth.user?.uid);
  const messages = useSelector(
    (state: RootState) => state.privateChatRoomMessages.messages
  );
  const totalParticipants = useSelector(
    (state: RootState) => state.privateChatRoom.participants.length
  );

  // 메시지가 변경될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.scrollTop = innerRef.current.scrollHeight;
    }
  }, [messages]);

  // 채팅방 ID가 변경될 때 메시지 가져오기 및 클리어
  useEffect(() => {
    if (chatRoomId) {
      // 채팅방 ID로 메시지 가져오기
      dispatch(fetchMessagesByChatRoomId(chatRoomId));
    }
  }, [chatRoomId, dispatch]);

  // 프로필 클릭 핸들러
  const handleProfileClick = (msg: Message) => {
    dispatch(
      participantInfo({
        uid: msg.userId,
        nickname: msg.userName,
        profileImg: msg.profileImg,
      })
    );
  };

  // 이미지 클릭 핸들러
  const handleImageClick = (url: string) => {
    setSelectedImage(url);
    setShowImageModal(true);
  };

  // 이미지 모달 닫기 핸들러
  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  return (
    <div className="inner" ref={innerRef}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message-container ${
            msg.userId === userId ? "mymsg" : ""
          }`}
        >
          {/* 본인의 메시지가 아닌 경우 프로필 이미지를 표시 */}
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
            {/* 본인의 메시지가 아닌 경우 사용자 이름 표시 */}
            {msg.userId !== userId && (
              <div className="user">{msg.userName}</div>
            )}
            <div className="text">
              {/* 텍스트 메시지 표시 */}
              {msg.text}
              {/* 이미지가 있는 경우 이미지 표시 */}
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
              {/* 메시지의 시간 표시 */}
              {new Date(msg.time).toLocaleTimeString()}
            </div>
            <div
              className={`read-by ${
                msg.userId === userId ? "my-read" : "their-read"
              }`}
            >
              {/* 읽지 않은 메시지 수 표시 */}
              {msg.readBy.length < totalParticipants && (
                <div className="unread-count">
                  <span>
                    {totalParticipants - 1 - msg.readBy.length} unread
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {showImageModal && (
        <ImageModal
          show={showImageModal}
          imageUrl={selectedImage}
          onClose={handleCloseImageModal}
        />
      )}
    </div>
  );
};

export default React.memo(PrivateChatRoomPageMain);
