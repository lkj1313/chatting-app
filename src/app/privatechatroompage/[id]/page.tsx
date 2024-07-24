"use client";

import PrivateChatRoomHeader from "./component/PrivateChatRoomHeader";
import PrivateChatRoomPageMain from "./component/PrivateChatRoomMain";
import PrivateChatRoomPageFooter from "./component/PrivateChatRoomFooter";
import Sidebar from "./component/Sidebar";
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
