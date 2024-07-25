"use client";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  participantModalOpen,
  privateChatRoomSidebarOpen,
} from "@/app/store/uiSlice";
import { AppDispatch, RootState } from "@/app/store/store";
import ParticipantModal from "@/app/chatroompage/[id]/component/ParticipantModal";
import React, { useEffect, useState } from "react";
import { fetchChatRoomData } from "@/app/store/privateChatRoomSlice";

const PrivateChatRoomHeader: React.FC = ({}) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch: AppDispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  // 선택된 참가자 정보
  const selectedParticipant = useSelector(
    (state: RootState) => state.participantModal.participantInfo
  );

  const chatRoomId = pathname.split("/")[2]; // 경로에서 chatRoomId 추출

  useEffect(() => {
    if (chatRoomId) {
      dispatch(fetchChatRoomData(chatRoomId)).then(() => setLoading(false));
    }
  }, [chatRoomId, dispatch]);

  useEffect(() => {
    if (selectedParticipant) {
      setLoading(false);
    }
  }, [selectedParticipant]);

  const handleBack = (): void => {
    router.back();
  };

  const openSidebar = () => {
    dispatch(privateChatRoomSidebarOpen());
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <header
      className="chatRoomHeader"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <ParticipantModal />

      {pathname.startsWith("/privatechatroompage") && (
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
            onClick={() => {
              dispatch(participantModalOpen());
            }}
            style={{ display: "flex", alignItems: "center", flexGrow: "1" }}
          >
            {selectedParticipant?.profileImg ? (
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "25px",
                  marginRight: "20px",
                }}
                src={selectedParticipant.profileImg}
                alt="selectedparticipantProfileImg"
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
                {selectedParticipant?.nickname?.[0] || "N/A"}
              </div>
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
                {selectedParticipant?.nickname}
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
      )}
    </header>
  );
};

export default React.memo(PrivateChatRoomHeader);
