"use client";
import React, { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { participantInfo } from "@/app/store/participantModalSlice";
import { AppDispatch } from "@/app/store/store";
import { Message } from "./type";
import ImageModal from "@/app/chatroompage/[id]/component/ImageModal";
import MessageComponent from "./MessageComponent"; // MessageComponent를 import합니다.

interface PrivateChatRoomMainProps {
  chatRoomMessagesState: {
    messages: Message[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };
  userId: string | null;
  totalParticipants: number;
}

// PrivateChatRoomPageMain 컴포넌트 정의
const PrivateChatRoomPageMain: React.FC<PrivateChatRoomMainProps> = ({
  chatRoomMessagesState,
  userId,
  totalParticipants,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const innerRef = useRef<HTMLDivElement>(null); // 채팅 스크롤을 제어하기 위한 ref

  const [selectedImage, setSelectedImage] = useState<string | null>(null); // 선택된 이미지를 관리하는 상태
  const [showImageModal, setShowImageModal] = useState(false); // 이미지 모달의 표시 여부를 관리하는 상태
  const messages = chatRoomMessagesState.messages; // 메시지 상태에서 메시지 목록 추출

  // 메시지 목록이 업데이트될 때마다 스크롤을 아래로 이동시키는 효과
  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.scrollTop = innerRef.current.scrollHeight;
    }
  }, [messages]);

  // 프로필 클릭 핸들러: 클릭된 메시지의 사용자 정보를 디스패치
  const handleProfileClick = (msg: Message) => {
    dispatch(
      participantInfo({
        uid: msg.userId,
        nickname: msg.userName,
        profileImg: msg.profileImg,
      })
    );
  };

  // 이미지 클릭 핸들러: 선택된 이미지를 상태로 설정하고 모달을 표시
  const handleImageClick = (url: string) => {
    setSelectedImage(url);
    setShowImageModal(true);
  };

  // 이미지 모달 닫기 핸들러: 모달을 숨기고 선택된 이미지를 초기화
  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  return (
    <div className="inner" ref={innerRef}>
      {messages.map((msg) => (
        <MessageComponent
          key={msg.id}
          msg={msg}
          userId={userId}
          totalParticipants={totalParticipants}
          handleProfileClick={handleProfileClick}
          handleImageClick={handleImageClick}
        />
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

// React.memo를 사용하여 불필요한 리렌더링 방지
export default React.memo(PrivateChatRoomPageMain);
