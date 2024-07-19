"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import ImageModal from "./ImageModal";
import ParticipantModal from "./ParticipantModal"; // 추가된 import
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Message } from "./type";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (close: boolean) => void;
}

interface chatRoomParticipantInfo {
  channelName: "";
  chatRoomId: null;
  chatRoomImg: null;
  description: "";
  participants: [];
  userId: null;
  userName: null;
  status: "idle";
  error: null;
}

interface PrivateChatRoomParticipantInfo {
  chatRoomId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  participants: string[]; // participants 속성 추가
}
interface ParticipantInfo {
  id: string;
  nickname: string;
  profileImg: string;
  additionalInfo?: string;
}

const fetchParticipantInfo = async (
  participantId: string
): Promise<ParticipantInfo | null> => {
  try {
    const participantRef = doc(db, "users", participantId);
    const participantSnap = await getDoc(participantRef);

    if (participantSnap.exists()) {
      const data = participantSnap.data();
      return {
        id: participantId,
        nickname: data.nickname,
        profileImg: data.profileImg || "default_image_url",
        additionalInfo: data.additionalInfo,
      };
    } else {
      console.error("No such participant!");
      return null;
    }
  } catch (error) {
    console.error("Error getting participant info:", error);
    return null;
  }
};
const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [participantInfos, setParticipantInfos] = useState<ParticipantInfo[]>(
    []
  );
  const [selectedParticipant, setSelectedParticipant] =
    useState<ParticipantInfo | null>(null);
  const [haveImageUrLMessages, setHaveImageUrLMessages] = useState<Message[]>(
    []
  );
  const sidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleImageClick = (imageUrl: string | undefined) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setShowImageModal(true);
    }
  };

  const handleParticipantClick = (participant: ParticipantInfo) => {
    setSelectedParticipant(participant);
    setShowParticipantModal(true);
  };
  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const handleCloseParticipantModal = () => {
    setShowParticipantModal(false);
    setSelectedParticipant(null);
  };

  const chatRoomMessages = useSelector(
    (state: RootState) => state.chatRoomMessages.messages
  );
  const privateChatRoomMessages = useSelector(
    (state: RootState) => state.privateChatRoomMessages.messages
  );

  const chatRoomParticipants = useSelector(
    // 일반채팅창 정보
    (state: RootState) => state.chatRoom
  );
  const privateChatParticipants = useSelector(
    // 개인채팅창 정보
    (state: RootState) => state.privateChatRoom // privateChatRoom을 privateChat으로 변경
  );

  useEffect(() => {
    if (location.pathname.startsWith("/chatroompage")) {
      setHaveImageUrLMessages(
        chatRoomMessages.filter((i) => i.imageUrl !== "")
      );
    } else if (location.pathname.startsWith("/privatechatroompage")) {
      setHaveImageUrLMessages(
        privateChatRoomMessages.filter((i) => i.imageUrl !== "")
      );
    }
  }, [chatRoomMessages, privateChatRoomMessages]);
  useEffect(() => {
    const fetchParticipants = async () => {
      let participants: any = [];
      if (location.pathname.startsWith("/chatroompage")) {
        participants = chatRoomParticipants.participants;
      } else if (location.pathname.startsWith("/privatechatroompage")) {
        participants = privateChatParticipants.participants;
      }

      const profiles = await Promise.all(
        participants.map((id: string) => fetchParticipantInfo(id))
      );
      setParticipantInfos(
        profiles.filter((info) => info !== null) as ParticipantInfo[]
      );
    };

    fetchParticipants();
  }, [chatRoomParticipants.participants, privateChatParticipants.participants]);

  return (
    <>
      {sidebarOpen && (
        <div
          className={`sidebarOverlay ${sidebarOpen ? "overlayShow" : ""}`}
          onClick={sidebarClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: sidebarOpen ? "block" : "none",
          }}
        ></div>
      )}
      <div
        className={`headerSidebar ${sidebarOpen ? "headerSidebarShow" : ""}`}
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          padding: "20px",
          position: "absolute",
          height: "100vh",
          width: "300px",
          right: sidebarOpen ? "0" : "-300px",
          top: "0px",
          zIndex: 1010,
          opacity: sidebarOpen ? 1 : 0,
          transition: "right 1s ease, opacity 1s ease",
          cursor: "default",
        }}
      >
        <strong
          style={{ borderBottom: "1px solid gray", paddingBottom: "10px" }}
        >
          채팅방 서랍
        </strong>
        <>
          <span style={{ marginTop: "20px", marginBottom: "10px" }}>사진</span>
          <div
            className="imageGrid"
            style={{
              display: "flex",
              flexWrap: "wrap",
              margin: 0,
              borderBottom: "1px solid gray",
            }}
          >
            {haveImageUrLMessages.map((image, index) => (
              <div
                key={index}
                className="imageBox"
                style={{
                  margin: 0,
                  padding: "0px",
                  width: "25%",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "start",
                  marginBottom: "20px",
                }}
              >
                {image.imageUrl && (
                  <img
                    style={{
                      width: "50px",
                      height: "50px",
                      cursor: "pointer",
                    }}
                    src={image.imageUrl}
                    alt={`img-${index}`}
                    onClick={() => handleImageClick(image.imageUrl)}
                  />
                )}
              </div>
            ))}
          </div>
          <span style={{ marginTop: "20px", marginBottom: "10px" }}>
            채팅방 참가자
          </span>
          <div>
            {location.pathname.startsWith("/chatroompage") ||
            location.pathname.startsWith("/privatechatroompage")
              ? participantInfos.map((participant, index) => (
                  <div
                    key={index}
                    className="participantInfoDiv"
                    style={{
                      marginBottom: "10px",
                      cursor: "pointer",
                      transition: "background-color 0.5s ease",
                    }}
                    onClick={() => handleParticipantClick(participant)}
                  >
                    <img
                      src={participant.profileImg}
                      alt={participant.nickname}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                      }}
                    />{" "}
                    <span>{participant.nickname}</span>
                  </div>
                ))
              : null}
          </div>
        </>
      </div>
      <ImageModal
        show={showImageModal}
        imageUrl={selectedImage}
        onClose={handleCloseImageModal}
      />
      <ParticipantModal
        show={showParticipantModal}
        participant={selectedParticipant}
        onClose={handleCloseParticipantModal}
      />
    </>
  );
};

export default Sidebar;
