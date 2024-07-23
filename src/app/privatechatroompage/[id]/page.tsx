"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { db, storage } from "../../../../firebase";
import { auth } from "../../../../firebase";
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
import { Message } from "@/app/chatroompage/[id]/component/type";
import ChatRoomPageHeader from "@/app/chatroompage/[id]/component/ChatRoomPageHeader";
import ChatRoomPageFooter from "@/app/chatroompage/[id]/component/ChatRoomPageFooter";
import ChatRoomPageMain from "@/app/chatroompage/[id]/component/ChatRoomPageMain";
import ChatRoomInfoModal from "@/app/chatroompage/[id]/component/ChatRoomInfoModal";
import ImageModal from "@/app/chatroompage/[id]/component/ImageModal";
import { useParams } from "next/navigation";
import {
  clearMessages,
  fetchMessagesByChatRoomId,
} from "@/app/store/privateChatRoomMessagesSlice";
import { participantModalClose } from "@/app/store/uiSlice";
import PrivateChatRoomHeader from "./component/PrivateChatRoomHeader";
import Sidebar from "./component/Sidebar";
import PrivateChatRoomPageMin from "./component/PrivateChatRoomMain";
import PrivateChatRoomPageMain from "./component/PrivateChatRoomMain";
import PrivateChatRoomPageFooter from "./component/PrivateChatRoomFooter";

const PrivateChatRoomPage = () => {
  return (
    <div className="chat_wrap" style={{ position: "relative" }}>
      <PrivateChatRoomHeader />
      <PrivateChatRoomPageMain />
      <PrivateChatRoomPageFooter />
      <Sidebar />
    </div>
  );
};

export default PrivateChatRoomPage;
