"use client";

import PrivateChatRoomHeader from "./component/PrivateChatRoomHeader";
import PrivateChatRoomPageMain from "./component/PrivateChatRoomMain";
import PrivateChatRoomPageFooter from "./component/PrivateChatRoomFooter";
import Sidebar from "./component/Sidebar";
import useViewportHeight from "@/app/component/useViewportHeight";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMessagesByChatRoomId } from "@/app/store/chatRoomMessagesSlice";
import { usePathname } from "next/navigation";
import { Dispatch } from "redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { useSelector } from "react-redux";
import { Message } from "./component/type";

const PrivateChatRoomPage = () => {
  const pathName = usePathname();
  const chatRoomId = pathName.split("/")[2];
  console.log("chatroomid", chatRoomId);
  const dispatch: AppDispatch = useDispatch();
  const chatRoomMessagesState = useSelector(
    (state: RootState) => state.privateChatRoomMessages
  );

  const userId = useSelector((state: RootState) => state.auth.user.uid); // 실제 사용자 ID 가져오기
  const totalParticipants = useSelector(
    (state: RootState) => state.privateChatRoom.participants.length
  );

  useEffect(() => {
    if (chatRoomId) {
      dispatch(fetchMessagesByChatRoomId(chatRoomId));
    }
  }, [chatRoomId, dispatch]);
  useViewportHeight();

  return (
    <div
      className="chat_wrap"
      style={{ position: "relative", height: "calc(var(--vh) * 100)" }}
    >
      <PrivateChatRoomHeader />
      <PrivateChatRoomPageMain
        chatRoomMessagesState={chatRoomMessagesState}
        userId={userId} // 실제 userId로 변경
        totalParticipants={totalParticipants} // 실제 참가자 수로 변경
      />
      <PrivateChatRoomPageFooter />
      <Sidebar />
    </div>
  );
};

export default PrivateChatRoomPage;
