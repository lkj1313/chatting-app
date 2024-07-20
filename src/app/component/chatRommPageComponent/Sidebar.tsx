"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import ImageModal from "./ImageModal";
import ParticipantModal from "./ParticipantModal";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Message } from "./type";
import {
  openParticipantModal,
  closeParticipantModal,
} from "@/app/store/participantModalSlice";

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

// Firestore에서 참가자 정보를 가져오는 함수
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
  const dispatch: AppDispatch = useDispatch();
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [participantInfos, setParticipantInfos] = useState<ParticipantInfo[]>(
    []
  );
  const [haveImageUrLMessages, setHaveImageUrLMessages] = useState<Message[]>(
    []
  );

  // Redux 상태에서 모달 표시 여부와 선택된 참가자 정보 가져오기
  const { showModal, selectedParticipant } = useSelector(
    (state: RootState) => state.participantModal
  );

  // 사이드바 닫기 함수
  const sidebarClose = () => {
    setSidebarOpen(false);
  };

  // 이미지 클릭 시 이미지 모달 열기 함수
  const handleImageClick = (imageUrl: string | undefined) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setShowImageModal(true);
    }
  };

  // 참가자 클릭 시 참가자 모달 열기 함수
  const handleParticipantClick = (participant: ParticipantInfo) => {
    dispatch(openParticipantModal(participant));
  };

  // 이미지 모달 닫기 함수
  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  // Redux 상태에서 user 가져오기
  const currentUser = useSelector((state: RootState) => state.auth.user);
  // Redux 상태에서 메시지 가져오기
  const chatRoomMessages = useSelector(
    (state: RootState) => state.chatRoomMessages.messages
  );
  const privateChatRoomMessages = useSelector(
    (state: RootState) => state.privateChatRoomMessages.messages
  );

  // Redux 상태에서 참가자 정보 가져오기
  const chatRoomParticipants = useSelector(
    (state: RootState) => state.chatRoom.participants
  );
  const privateChatParticipants = useSelector(
    (state: RootState) => state.privateChatRoom.participants
  );

  // 현재 페이지 경로에 따라 이미지 URL이 있는 메시지 필터링
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

  // 현재 페이지 경로에 따라 참가자 정보 가져오기
  useEffect(() => {
    const fetchParticipants = async () => {
      let participants: any = [];
      if (location.pathname.startsWith("/chatroompage")) {
        participants = chatRoomParticipants;
      } else if (location.pathname.startsWith("/privatechatroompage")) {
        participants = privateChatParticipants;
      }

      const profiles = await Promise.all(
        participants.map((id: string) => fetchParticipantInfo(id))
      );
      setParticipantInfos(
        profiles.filter((info) => info !== null) as ParticipantInfo[]
      );
    };

    fetchParticipants();
  }, [chatRoomParticipants, privateChatParticipants]);

  // 자신을 가장 위에 표시하기 위해 사용자 정보를 배열의 맨 앞에 추가
  const orderedParticipants = [
    ...participantInfos.filter((p) => p.id === currentUser.uid),
    ...participantInfos.filter((p) => p.id !== currentUser.uid),
  ];
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
              ? orderedParticipants.map((participant, index) => (
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
      <ParticipantModal />
    </>
  );
};

export default Sidebar;
