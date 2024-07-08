"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatRoomById } from "@/app/store/chatRoomSlice";
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
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Message } from "@/app/chatroompage/components/type";
import ChatRoomHeader from "@/app/chatroompage/components/ChatRoomHeader";
import ChatInputComponent from "@/app/chatroompage/components/ChatInputComponent";
import MessageListComponent from "@/app/chatroompage/components/MessageListComponent";
import ChatRoomInfoModal from "@/app/chatroompage/components/InfoModal";
import ImageModal from "@/app/chatroompage/components/ImageModal";
import { useParams } from "next/navigation";

const ChatRoomPage = () => {
  const { id } = useParams();
  const chatRoomId = Array.isArray(id) ? id[0] : id; // id가 배열일 경우 첫 번째 요소 사용
  const dispatch = useDispatch<AppDispatch>();
  const [chatRoom, setChatRoom] = useState<any>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const userProfileImg = user.profileImgURL;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [showImageChattingModal, setImageChattingShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    if (chatRoomId) {
      dispatch(fetchChatRoomById(chatRoomId));

      const chatRoomRef = doc(db, "chatRooms", chatRoomId);
      getDoc(chatRoomRef)
        .then((doc) => {
          if (doc.exists()) {
            setChatRoom(doc.data());
          } else {
            console.error("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });

      const messagesRef = collection(db, "chatRooms", chatRoomId, "messages");
      const q = query(messagesRef, orderBy("time"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
          });
        });
        setMessages(msgs);
      });

      return () => unsubscribe();
    }
  }, [chatRoomId, dispatch]);

  const handleSendMessage = async (text: string, imageUrl = "") => {
    if ((text.trim() || imageUrl) && user.uid) {
      const newMessage = {
        text,
        time: new Date().toISOString(),
        userId: user.uid,
        userName: user.nickname || "Anonymous",
        profileImg: userProfileImg,
        imageUrl,
      };
      await addDoc(
        collection(db, "chatRooms", chatRoomId!, "messages"),
        newMessage
      );
    }
  };

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

  const handleImageClick = (url: string) => {
    setModalImage(url);
    setImageChattingShowModal(true);
  };

  const closeImgeModal = () => {
    setImageChattingShowModal(false);
    setModalImage(null);
  };

  const openInfoModal = () => setShowInfoModal(true);
  const closeInfoModal = () => setShowInfoModal(false);

  return (
    <div className="chat_wrap">
      <ChatRoomHeader chatRoom={chatRoom} openInfoModal={openInfoModal} />

      <MessageListComponent
        messages={messages}
        userId={user.uid!}
        handleImageClick={handleImageClick}
      />

      <ChatInputComponent
        handleSendMessage={handleSendMessage}
        handleImageUpload={handleImageUpload}
        loading={loading}
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
