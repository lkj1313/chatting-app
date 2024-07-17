"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import ImageModal from "./ImageModal";
import ParticipantModal from "./ParticipantModal"; // 추가된 import
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (close: boolean) => void;
}

interface ParticipantInfo {
  id: string;
  nickname: string;
  profileImg: string;
  additionalInfo?: string; // 필요한 추가 정보
}

// 각 참가자의 정보를 가져오는 비동기 함수
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
        profileImg: data.profileImg,
        additionalInfo: data.additionalInfo, // 필요한 추가 정보
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
  const [selectedParticipant, setSelectedParticipant] =
    useState<ParticipantInfo | null>(null);
  const [participantInfos, setParticipantInfos] = useState<ParticipantInfo[]>(
    []
  ); // 여기서 타입 명시

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

  const messages = useSelector((state: RootState) => state.messages.messages);
  console.log("Messages:", messages);

  const haveImageUrLMessages = messages.filter((i) => i.imageUrl !== "");
  console.log("Messages with Image URL:", haveImageUrLMessages);

  const chatRoomParticipants = useSelector(
    (state: RootState) => state.chatRoom.participants
  );
  console.log(chatRoomParticipants);

  useEffect(() => {
    const fetchAllParticipants = async () => {
      const participantInfoPromises = chatRoomParticipants.map(
        async (participantId) => {
          const info = await fetchParticipantInfo(participantId);
          return info;
        }
      );
      const participantInfos = await Promise.all(participantInfoPromises);
      setParticipantInfos(
        participantInfos.filter(
          (info): info is ParticipantInfo => info !== null
        )
      );
    };

    if (chatRoomParticipants.length > 0) {
      fetchAllParticipants();
    }
  }, [chatRoomParticipants]);

  return (
    <>
      {sidebarOpen && (
        <div
          className={`sidebarOverlay ${sidebarOpen ? "overlayShow" : ""}`}
          onClick={sidebarClose}
        ></div>
      )}
      <div
        className={`headerSidebar ${sidebarOpen ? "headerSidebarShow" : ""}`}
      >
        <strong
          style={{ borderBottom: "1px solid gray", paddingBottom: "10px" }}
        >
          채팅방 서랍
        </strong>
        <>
          <span style={{ marginTop: "20px", marginBottom: "10px" }}>사진</span>
          <div className="imageGrid">
            {haveImageUrLMessages.map((image, index) => (
              <div
                key={index}
                className="imageBox"
                style={{ marginBottom: "20px" }}
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
        </>
        <>
          <span style={{ marginTop: "20px", marginBottom: "10px" }}>
            채팅방 참가자
          </span>
          <div>
            {participantInfos.map((participant, index) => (
              <div
                key={index}
                className="participantInfoDiv"
                style={{ marginBottom: "10px", cursor: "pointer" }}
                onClick={() => handleParticipantClick(participant)}
              >
                <img
                  src={participant.profileImg}
                  alt={participant.nickname}
                  style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                />{" "}
                <span>{participant.nickname}</span>
              </div>
            ))}
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
