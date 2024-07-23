"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  privateChatRoomSidebarClose,
  participantModalOpen,
} from "@/app/store/uiSlice";
import { RootState, AppDispatch } from "@/app/store/store";
import { usePathname } from "next/navigation";
import ImageModal from "@/app/chatroompage/[id]/component/ImageModal";
import ParticipantModal from "@/app/chatroompage/[id]/component/ParticipantModal";

import { Message } from "@/app/chatroompage/[id]/component/type";
import { fetchChatRoomData } from "@/app/store/privateChatRoomSlice";
import { participantInfo } from "@/app/store/participantModalSlice";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";

interface ParticipantInfo {
  uid: string;
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
        uid: participantId,
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

const Sidebar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [participantInfos, setParticipantInfos] = useState<ParticipantInfo[]>(
    []
  );
  const [haveImageUrLMessages, setHaveImageUrLMessages] = useState<Message[]>(
    []
  );

  // Redux 상태에서 사이드바 열림/닫힘 상태 가져오기
  const sidebarState = useSelector(
    (state: RootState) => state.ui.privateChatRoomSidebar
  );

  // Redux 상태에서 참가자 ID 가져오기
  const participants = useSelector(
    (state: RootState) => state.privateChatRoom.participants
  );

  // Redux 상태에서 user 가져오기
  const currentUser = useSelector((state: RootState) => state.auth.user);
  // Redux 상태에서 메시지 가져오기
  const chatRoomMessages = useSelector(
    (state: RootState) => state.chatRoomMessages.messages
  );

  // 현재 페이지 경로에서 chatRoomId 추출
  const chatRoomId = usePathname().split("/")[2];

  // Fetch chat room data on component mount
  useEffect(() => {
    if (chatRoomId) {
      dispatch(fetchChatRoomData(chatRoomId));
    }
  }, [chatRoomId, dispatch]);

  // Fetch participant infos based on participant IDs
  useEffect(() => {
    const fetchParticipants = async () => {
      const profiles = await Promise.all(
        participants.map((id: string) => fetchParticipantInfo(id))
      );
      setParticipantInfos(
        profiles.filter((info) => info !== null) as ParticipantInfo[]
      );
    };

    fetchParticipants();
  }, [participants]);

  // 현재 페이지 경로에 따라 이미지 URL이 있는 메시지 필터링
  useEffect(() => {
    if (location.pathname.startsWith("/privatechatroompage")) {
      setHaveImageUrLMessages(
        chatRoomMessages.filter((i) => i.imageUrl !== "")
      );
    }
  }, [chatRoomMessages]);

  // 사이드바 닫기 함수
  const closeSidebar = () => {
    dispatch(privateChatRoomSidebarClose());
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
    dispatch(participantInfo(participant));
    dispatch(participantModalOpen());
  };

  // 이미지 모달 닫기 함수
  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  // 자신을 가장 위에 표시하기 위해 사용자 정보를 배열의 맨 앞에 추가
  const orderedParticipants = [
    ...participantInfos.filter((p) => p.uid === currentUser.uid),
    ...participantInfos.filter((p) => p.uid !== currentUser.uid),
  ];

  return (
    <>
      {sidebarState && (
        <div
          className={`sidebarOverlay ${sidebarState ? "overlayShow" : ""}`}
          onClick={closeSidebar}
        ></div>
      )}
      <div
        className={`headerSidebar ${sidebarState ? "headerSidebarShow" : ""}`}
        style={{ position: "absolute", right: "0px", height: "100vh" }}
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
            {orderedParticipants.map((participant, index) => (
              <div
                key={index}
                className="participantInfoDiv"
                style={{
                  marginBottom: "10px", // 아래 여백 10px
                  cursor: "pointer", // 마우스를 올리면 포인터 커서로 변경
                  transition: "background-color 0.5s ease", // 배경색 변경 시 0.5초 동안 부드럽게 전환
                }}
                onClick={() => handleParticipantClick(participant)} // 클릭 시 handleParticipantClick 함수 호출
              >
                <img
                  src={participant.profileImg} // 참가자의 프로필 이미지
                  alt={participant.nickname} // 이미지의 대체 텍스트로 참가자 닉네임 사용
                  style={{
                    width: "30px", // 이미지 너비 30px
                    height: "30px", // 이미지 높이 30px
                    borderRadius: "50%", // 이미지 테두리를 둥글게 (원형으로)
                  }}
                />{" "}
                <span>{participant.nickname}</span> {/* 참가자의 닉네임 표시 */}
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
    </>
  );
};

export default Sidebar;
