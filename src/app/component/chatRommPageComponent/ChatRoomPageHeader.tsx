"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Sidebar from "./Sidebar";
import ParticipantModal from "./ParticipantModal";
import { useDispatch, useSelector } from "react-redux";
import { openParticipantModal } from "@/app/store/participantModalSlice";
import { RootState } from "@/app/store/store";

interface ChatRoomPageHeaderProps {
  chatRoom: any;
  openInfoModal: () => void;
  participantProfileImg?: string;
  participantNickname?: string;
}

interface ParticipantInfo {
  uid: string;
  nickname: string;
  profileImg: string;
  additionalInfo?: string;
}

const ChatRoomPageHeader: React.FC<ChatRoomPageHeaderProps> = ({
  chatRoom,
  openInfoModal,
  participantProfileImg,
  participantNickname,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const showModal = useSelector(
    (state: RootState) => state.participantModal.showModal
  );
  const selectedParticipant = useSelector(
    (state: RootState) => state.participantModal.selectedParticipant
  );
  const isPrivateChatRoom = pathname.startsWith("/privatechatroompage/");
  const isParticipantPage = pathname.startsWith("/participantpage/");

  const handleBack = (): void => {
    // 뒤로가기
    router.back();
  };

  const handleBarButtonClick = (): void => {
    setSidebarOpen(true);
  };

  const handleParticipantClick = () => {
    const participant: ParticipantInfo = {
      uid: "example-uid", // 실제로는 적절한 UID를 사용해야 합니다
      nickname: participantNickname || "Unknown",
      profileImg: participantProfileImg || "/default-profile.png",
      additionalInfo: "Some additional info",
    };
    dispatch(openParticipantModal(participant));
  };

  const handleInfoClick = (): void => {
    if (isPrivateChatRoom) {
      handleParticipantClick();
    } else {
      openInfoModal();
    }
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
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {chatRoom ? (
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
            {pathname.startsWith("/chatroompage") ? (
              chatRoom.chatRoomImg ? (
                <img
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "25px",
                    marginRight: "20px",
                  }}
                  src={chatRoom.chatRoomImg}
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
                  {chatRoom?.channelName?.[0] || "N/A"}
                </div>
              )
            ) : participantProfileImg ? (
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "25px",
                  marginRight: "20px",
                }}
                src={participantProfileImg}
                alt="Participant Profile Image"
              />
            ) : (
              <>
                <ParticipantModal />
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
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {participantNickname?.[0] || "N/A"}
                </div>
              </>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
                }}
              >
                {pathname.startsWith("/chatroompage")
                  ? chatRoom?.channelName
                  : participantNickname}
              </p>

              {!isPrivateChatRoom && (
                <p
                  style={{
                    margin: "0",
                    fontSize: "10px",
                    userSelect: "none",
                  }}
                >
                  구독자수 : {chatRoom?.participants?.length}명
                </p>
              )}
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
              onClick={handleBarButtonClick}
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

export default ChatRoomPageHeader;
