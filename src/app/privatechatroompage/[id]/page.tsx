"use client";

import PrivateChatRoomHeader from "./component/PrivateChatRoomHeader";
import PrivateChatRoomPageMain from "./component/PrivateChatRoomMain";
import PrivateChatRoomPageFooter from "./component/PrivateChatRoomFooter";
import Sidebar from "./component/Sidebar";
import useViewportHeight from "@/app/component/useViewportHeight";
const PrivateChatRoomPage = () => {
  useViewportHeight();
  return (
    <div
      className="chat_wrap"
      style={{ position: "relative", height: "calc(var(--vh) * 100)" }}
    >
      <PrivateChatRoomHeader />
      <PrivateChatRoomPageMain />
      <PrivateChatRoomPageFooter />
      <Sidebar />
    </div>
  );
};

export default PrivateChatRoomPage;
