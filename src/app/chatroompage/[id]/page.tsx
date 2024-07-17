"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatRoomById } from "@/app/store/chatRoomSlice";
import {
  fetchMessagesByChatRoomId,
  setMessages,
} from "@/app/store/messagesSlice";
import { RootState, AppDispatch } from "@/app/store/store";
import { db, storage } from "../../../../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Message } from "@/app/component/chatRommPageComponent/type";
import ChatRoomPageHeader from "@/app/component/chatRommPageComponent/ChatRoomPageHeader";
import ChatRoomPageFooter from "@/app/component/chatRommPageComponent/ChatRoomPageFooter";
import ChatRoomPageMain from "@/app/component/chatRommPageComponent/ChatRoomPageMain";
import ChatRoomInfoModal from "@/app/component/chatRommPageComponent/InfoModal";
import ImageModal from "@/app/component/chatRommPageComponent/ImageModal";
import { useParams } from "next/navigation";

const ChatRoomPage = () => {
  const { id } = useParams(); // URL 파라미터에서 채팅방 ID 가져오기
  const chatRoomId = Array.isArray(id) ? id[0] : id; // id가 배열일 경우 첫 번째 요소 사용
  const dispatch = useDispatch<AppDispatch>();
  const [chatRoom, setChatRoom] = useState<any>(null); // 채팅방 정보 상태
  const [isParticipant, setIsParticipant] = useState<boolean>(false); // 사용자가 채팅방 참가자인지 여부
  const [hasEntered, setHasEntered] = useState<boolean>(false); // 사용자가 채팅방에 들어왔는지 여부
  const user = useSelector((state: RootState) => state.auth.user); // Redux에서 사용자 정보 가져오기
  const userProfileImg = user.profileImgURL;
  const { messages, status, error } = useSelector(
    (state: RootState) => state.messages
  ); // Redux에서 메시지 목록 가져오기
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [modalImage, setModalImage] = useState<string | null>(null); // 이미지 모달 상태
  const [showImageChattingModal, setImageChattingShowModal] = useState(false); // 이미지 모달 표시 여부
  const [showInfoModal, setShowInfoModal] = useState(false); // 정보 모달 표시 여부

  // 채팅방 정보 가져오기
  useEffect(() => {
    if (chatRoomId && user.uid) {
      const chatRoomRef = doc(db, "chatRooms", chatRoomId);
      getDoc(chatRoomRef)
        .then((doc) => {
          if (doc.exists()) {
            setChatRoom(doc.data());
            if (doc.data().participants.includes(user.uid)) {
              setIsParticipant(true);
            } else {
              setIsParticipant(false);
            }
          } else {
            console.error("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    }
  }, [chatRoomId, user.uid]);

  // 메시지 목록 가져오기 및 실시간 업데이트
  useEffect(() => {
    if (chatRoomId) {
      dispatch(fetchChatRoomById(chatRoomId)); // 채팅방 정보
      dispatch(fetchMessagesByChatRoomId(chatRoomId)); // 챗방정보

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

  // 메시지 전송 함수
  const handleSendMessage = async (text: string, imageUrl = "") => {
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
  };

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

  // 이미지 업로드 함수
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        const storageRef = ref(storage, `chatImages/${file.name}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
        handleSendMessage("", imageUrl);
      } catch (error) {
        console.error("Error uploading image: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

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

  // 정보 모달 열기
  const openInfoModal = () => setShowInfoModal(true);

  // 정보 모달 닫기
  const closeInfoModal = () => setShowInfoModal(false);

  // 채팅방 참가 함수
  const enterChatRoom = async () => {
    try {
      const chatRoomRef = doc(db, "chatRooms", chatRoomId);
      await updateDoc(chatRoomRef, {
        participants: arrayUnion(user.uid),
      });
      setIsParticipant(true);
      setHasEntered(true);
    } catch (error) {
      console.error("Error adding user to participants: ", error);
    }
  };

  useEffect(() => {
    if (user.uid && !isParticipant) {
      enterChatRoom(); // 사용자 자동 참가
    }
  }, [user.uid, isParticipant]);

  return (
    <div className="chat_wrap">
      <ChatRoomPageHeader chatRoom={chatRoom} openInfoModal={openInfoModal} />

      <ChatRoomPageMain
        messages={messages}
        userId={user.uid!}
        handleImageClick={handleImageClick}
        totalParticipants={chatRoom?.participants.length || 0} // 구독자 수 전달
      />

      <ChatRoomPageFooter
        handleSendMessage={handleSendMessage}
        handleImageUpload={handleImageUpload}
        loading={loading}
        isParticipant={isParticipant}
        enterChatRoom={enterChatRoom}
      />

      <ImageModal
        show={showImageChattingModal}
        imageUrl={modalImage}
        onClose={closeImgeModal}
      />

      <ChatRoomInfoModal
        show={showInfoModal}
        chatRoom={chatRoom}
        onClose={closeInfoModal}
      />
    </div>
  );
};

export default ChatRoomPage;
