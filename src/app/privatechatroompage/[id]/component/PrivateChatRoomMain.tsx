"use client";
import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessagesByChatRoomId } from "@/app/store/privateChatRoomMessagesSlice";
import { participantInfo } from "@/app/store/participantModalSlice";
import { RootState, AppDispatch } from "@/app/store/store";
import { usePathname } from "next/navigation";
import { Message } from "./type";
import ImageModal from "@/app/chatroompage/[id]/component/ImageModal";
import MessageComponent from "./MessageComponent"; // MessageComponent를 import합니다.

const PrivateChatRoomPageMain: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const innerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const chatRoomId = pathname.split("/")[2];
  const userId = useSelector((state: RootState) => state.auth.user?.uid);
  const messages = useSelector(
    (state: RootState) => state.privateChatRoomMessages.messages
  );
  const totalParticipants = useSelector(
    (state: RootState) => state.privateChatRoom.participants.length
  );

  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.scrollTop = innerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (chatRoomId) {
      dispatch(fetchMessagesByChatRoomId(chatRoomId));
    }
  }, [chatRoomId, dispatch]);

  const handleProfileClick = (msg: Message) => {
    dispatch(
      participantInfo({
        uid: msg.userId,
        nickname: msg.userName,
        profileImg: msg.profileImg,
      })
    );
  };

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
    setShowImageModal(true);
  };

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

export default React.memo(PrivateChatRoomPageMain);
