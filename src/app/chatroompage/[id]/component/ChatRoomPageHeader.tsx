"use client";

import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { chatRoomSidebarOpen } from "@/app/store/uiSlice";
import Sidebar from "./Sidebar";
import ParticipantModal from "./ParticipantModal";

import { RootState } from "@/app/store/store";
import { chatRoomInfoModalOpen } from "@/app/store/uiSlice";
import React from "react";

interface ChatRoomPageHeaderProps {
  participantProfileImg?: string;
  participantNickname?: string;
}

interface ParticipantInfo {
  uid: string;
  nickname: string;
  profileImg: string;
  additionalInfo?: string;
}

const ChatRoomPageHeader: React.FC<ChatRoomPageHeaderProps> = ({}) => {
  const chatRoomInformation = useSelector((state: RootState) => state.chatRoom);
  const router = useRouter(); // 라우터 훅
  const pathname = usePathname(); // 현재 경로
  const dispatch = useDispatch(); // Redux 디스패치 훅

  // 선택된 참가자 정보
  const selectedParticipant = useSelector(
    (state: RootState) => state.participantModal.participantInfo
  );

  const openInfoModal = () => {
    dispatch(chatRoomInfoModalOpen());
  };
  console.log(selectedParticipant);

  const handleBack = (): void => {
    // 뒤로가기
    router.back();
  };

  const handleInfoClick = (): void => {
    // 정보 버튼 클릭 핸들러
    openInfoModal();
  };

  const openSidebar = () => {
    // 사이드바 열기 함수
    dispatch(chatRoomSidebarOpen());
  };

  return (
    <header
      className="chatRoomHeader"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {pathname.startsWith("/chatroompage") && chatRoomInformation ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="backButton" onClick={handleBack} role="button">
            <img
              style={{
                width: "30px",
                height: "30px",
              }}
              src="/backIcon.png"
              alt="backIcon"
            />
          </div>

          <div
            onClick={handleInfoClick}
            style={{ display: "flex", alignItems: "center", flexGrow: "1" }}
          >
            {chatRoomInformation.chatRoomImg ? (
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "25px",
                  marginRight: "20px",
                }}
                src={chatRoomInformation.chatRoomImg}
                alt="Chat Room Image"
              />
            ) : (
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "25px",
                  backgroundColor: "#ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "12px",
                  textAlign: "center",
                  marginRight: "20px",
                }}
              >
                {chatRoomInformation?.channelName?.[0] || "N/A"}
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",

                justifyContent: "center",
              }}
            >
              <p
                style={{
                  margin: "0",
                  fontSize: "18px",
                  userSelect: "none",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}
              >
                {chatRoomInformation?.channelName}
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "10px",
                  userSelect: "none",
                }}
              >
                구독자수 : {chatRoomInformation?.participants?.length}명
              </p>
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              className="barButton"
              style={{
                backgroundColor: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
                marginLeft: "10px",
              }}
              onClick={openSidebar}
              role="button"
            >
              <img
                style={{
                  width: "30px",
                  height: "30px",
                }}
                src="/Hamburger_icon.png"
                alt="barIcon"
              />
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </header>
  );
};

export default React.memo(ChatRoomPageHeader);
