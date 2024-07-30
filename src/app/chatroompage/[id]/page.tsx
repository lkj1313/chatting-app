"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatRoomById } from "@/app/store/chatRoomSlice";
import {
  fetchMessagesByChatRoomId,
  setMessages,
} from "@/app/store/chatRoomMessagesSlice";
import { RootState, AppDispatch } from "@/app/store/store";
import { db, auth } from "../../../../firebase";
import { useRouter, useParams } from "next/navigation";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  arrayUnion,
  writeBatch,
  addDoc,
} from "firebase/firestore";
import { participantModalOpen } from "@/app/store/uiSlice";

import { Message } from "@/app/chatroompage/[id]/component/type";
import ChatRoomPageHeader from "@/app/chatroompage/[id]/component/ChatRoomPageHeader";
import ChatRoomPageFooter from "@/app/chatroompage/[id]/component/ChatRoomPageFooter";
import ChatRoomPageMain from "@/app/chatroompage/[id]/component/ChatRoomPageMain";

import ImageModal from "@/app/chatroompage/[id]/component/ImageModal";
import { onAuthStateChanged } from "firebase/auth";
import ChatRoomInfoModal from "@/app/chatroompage/[id]/component/ChatRoomInfoModal";
import Sidebar from "./component/Sidebar";
import useViewportHeight from "@/app/component/useViewportHeight";

const ChatRoomPage = () => {
  const router = useRouter();
  const { id } = useParams(); // URL 파라미터에서 채팅방 ID 가져오기
  const chatRoomId = Array.isArray(id) ? id[0] : id; // id가 배열일 경우 첫 번째 요소 사용
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user); // Redux에서 사용자 정보 가져오기
  const userProfileImg = user.profileImgURL;
  const chatRoomInformation = useSelector((state: RootState) => state.chatRoom);
  const { messages, status, error } = useSelector(
    (state: RootState) => state.chatRoomMessages
  ); // Redux에서 메시지 목록 가져오기
  const [modalImage, setModalImage] = useState<string | null>(null); // 이미지 모달 상태
  const [showImageChattingModal, setImageChattingShowModal] = useState(false); // 이미지 모달 표시 여부

  const handleSendMessage = useCallback(
    async (text: string, imageUrl = "") => {
      if ((text.trim() || imageUrl) && user.uid) {
        const newMessage = {
          text,
          time: new Date().toISOString(),
          userId: user.uid,
          userName: user.nickname || "Anonymous",
          profileImg: userProfileImg,
          imageUrl,
          readBy: [], // 읽은 사용자 목록 초기화
        };
        await addDoc(
          collection(db, "chatRooms", chatRoomId!, "messages"),
          newMessage
        );
      }
    },
    [user.uid, user.nickname, userProfileImg, chatRoomId]
  );

  useEffect(() => {
    if (chatRoomId) {
      dispatch(fetchChatRoomById(chatRoomId)); // 채팅방 정보
      dispatch(fetchMessagesByChatRoomId(chatRoomId)); // 실시간채팅정보

      const messagesRef = collection(db, "chatRooms", chatRoomId, "messages");
      const q = query(messagesRef, orderBy("time"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        // Firestore에서 채팅방의 메시지를 실시간으로 구독
        const msgs: Message[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          msgs.push({
            id: doc.id,
            text: data.text,
            time: data.time,
            userId: data.userId,
            userName: data.userName,
            profileImg: userProfileImg || "",
            imageUrl: data.imageUrl || "",
            readBy: data.readBy || [], // Ensure readBy is initialized
          });
        });
        dispatch(setMessages(msgs));
      });

      return () => unsubscribe();
    }
  }, [chatRoomId, dispatch, userProfileImg]);

  useEffect(() => {
    // 로그아웃 감지시 /loginpage 이동
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/loginpage");
      }
    });
  });

  // 읽지 않은 메시지 업데이트
  useEffect(() => {
    if (messages.length > 0 && user.uid) {
      const unreadMessages = messages.filter(
        (msg) => !msg.readBy.includes(user.uid!)
      );

      const batch = writeBatch(db);

      unreadMessages.forEach((msg) => {
        const msgRef = doc(db, "chatRooms", chatRoomId!, "messages", msg.id);
        batch.update(msgRef, {
          readBy: arrayUnion(user.uid!),
        });
      });

      batch.commit();
    }
  }, [messages, user.uid, chatRoomId]);

  // 이미지 클릭 시 모달 열기
  const handleImageClick = (url: string) => {
    setModalImage(url);
    setImageChattingShowModal(true);
  };

  // 이미지 모달 닫기
  const closeImgeModal = () => {
    setImageChattingShowModal(false);
    setModalImage(null);
  };
  useViewportHeight();
  return (
    <>
      <div
        className="chat_wrap"
        style={{
          position: "relative",
          width: "100%",
          height: "calc(var(--vh) * 100)",
          overflow: "auto",
        }}
      >
        <ChatRoomPageHeader />
        <ChatRoomPageMain
          messages={messages}
          userId={user.uid!}
          handleImageClick={handleImageClick}
          totalParticipants={chatRoomInformation.participants.length}
        />
        <ChatRoomPageFooter
          handleSendMessage={handleSendMessage}
          chatRoomParticipants={chatRoomInformation.participants}
        />{" "}
        <Sidebar />
      </div>

      <ImageModal
        show={showImageChattingModal}
        imageUrl={modalImage}
        onClose={closeImgeModal}
      />
      <ChatRoomInfoModal
        chatRoom={chatRoomInformation}
        participantProfileImg={null}
        participantNickname={null}
      />
    </>
  );
};

export default React.memo(ChatRoomPage);
