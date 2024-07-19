"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import ImageModal from "./ImageModal";
import ParticipantModal from "./ParticipantModal";
import { useParams } from "next/navigation";
import { fetchChatRoomById } from "@/app/store/chatRoomSlice";
import { fetchPrivateChatRoomById } from "@/app/store/privateChatRoomSlice";
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
  additionalInfo?: string;
}

// 각 참가자의 프로필 이미지를 가져오는 비동기 함수
const fetchParticipantProfileImg = async (participantId: string) => {
  try {
    const participantRef = doc(db, "users", participantId);
    const participantSnap = await getDoc(participantRef);

    if (participantSnap.exists()) {
      return participantSnap.data().profileImg;
    } else {
      console.error("No such participant!");
      return null;
    }
  } catch (error) {
    console.error("Error getting participant profile image:", error);
    return null;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const { id: chatRoomId } = useParams<{ id: string }>();
  const [participantInfos, setParticipantInfos] = useState<ParticipantInfo[]>(
    []
  );
  const [selectedParticipant, setSelectedParticipant] =
    useState<ParticipantInfo | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const chatRoom = useSelector((state: RootState) => state.chatRoom);
  const { participants, status, error } = chatRoom;
  const [participantProfiles, setParticipantProfiles] = useState<
    ParticipantInfo[]
  >([]);
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
          nickname: data.nickname || participantId, // 닉네임이 없을 경우 ID 사용
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
  useEffect(() => {
    if (chatRoomId) {
      if (location.pathname.includes("/chatroompage/")) {
        dispatch(fetchChatRoomById(chatRoomId));
      } else if (location.pathname.includes("/privatechatroompage/")) {
        dispatch(fetchPrivateChatRoomById(chatRoomId));
      }
    }
  }, [chatRoomId, dispatch]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const profiles: (ParticipantInfo | null)[] = await Promise.all(
        participants.map(async (id) => {
          const participantInfo = await fetchParticipantInfo(id);
          return participantInfo;
        })
      );
      setParticipantInfos(
        profiles.filter((info) => info !== null) as ParticipantInfo[]
      );
    };

    if (participants.length > 0) {
      fetchProfiles();
    }
  }, [participants]);

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
  const haveImageUrLMessages = messages.filter((i) => i.imageUrl !== "");

  if (status === "loading") {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
  }

  if (error) {
    return <div>Error: {error}</div>; // 에러 발생 시 표시할 내용
  }

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
                    style={{ width: "50px", height: "50px", cursor: "pointer" }}
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
            {participantInfos.map((participant) => (
              <div
                key={participant.id}
                className="participantInfoDiv"
                style={{ marginBottom: "10px", cursor: "pointer" }}
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
