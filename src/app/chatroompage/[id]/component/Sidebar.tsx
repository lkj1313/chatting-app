"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { chatRoomSidebarClose, chatRoomSidebarOpen } from "@/app/store/uiSlice";
import { RootState, AppDispatch } from "@/app/store/store";
import { useRouter } from "next/navigation";
import ImageModal from "./ImageModal";
import ParticipantModal from "./ParticipantModal";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { Message } from "./type";
import { participantInfo } from "@/app/store/participantModalSlice";
import {
  participantModalOpen,
  participantModalClose,
} from "@/app/store/uiSlice";
import { auth } from "firebase-admin";

interface ParticipantInfo {
  uid: string;
  nickname: string;
  profileImg: string;
  additionalInfo?: string;
}

// Firestore에서 특정 사용자 ID에 해당하는 참가자 정보를 가져오는 비동기 함수
// 입력: participantId (string) - 참가자의 고유 ID
// 출력: Promise<ParticipantInfo | null> - 참가자 정보를 포함한 객체 또는 null
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
  const router = useRouter();

  // Redux 상태에서 사이드바 열림/닫힘 상태 가져오기
  const chatRoomSidebar = useSelector(
    (state: RootState) => state.ui.chatRoomSidebarOpen
  );

  // 사이드바 열기 함수
  const openSidebar = () => {
    dispatch(chatRoomSidebarOpen());
  };

  // 사이드바 닫기 함수
  const closeSidebar = () => {
    dispatch(chatRoomSidebarClose());
  };

  // 이미지 클릭 시 이미지 모달 열기 함수
  const handleImageClick = (imageUrl: string | undefined) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setShowImageModal(true);
    }
  };
  // 이미지 모달 닫기 함수
  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  // 참가자 클릭 시 참가자 모달 열기 함수
  const handleParticipantClick = (participant: ParticipantInfo) => {
    dispatch(participantInfo(participant));
    dispatch(participantModalOpen());
  };

  // Redux 상태에서 현재 user 가져오기
  const currentUser = useSelector((state: RootState) => state.auth.user);
  // Redux 상태에서 메시지 가져오기
  const chatRoomMessages = useSelector(
    (state: RootState) => state.chatRoomMessages.messages
  );

  // Redux 상태에서 참가자 정보 가져오기
  const chatRoomParticipants = useSelector(
    (state: RootState) => state.chatRoom.participants
  );
  // Redux 상태에서 채팅방 정보 가져오기
  const chatRoomInfo = useSelector((state: RootState) => state.chatRoom);

  // 현재 페이지 경로에 따라 이미지 URL이 있는 메시지 필터링
  useEffect(() => {
    if (location.pathname.startsWith("/chatroompage")) {
      setHaveImageUrLMessages(
        chatRoomMessages.filter((i) => i.imageUrl !== "")
      );
    }
  }, [chatRoomMessages]);

  // 현재 페이지 경로에 따라 참가자 정보 가져오기
  useEffect(() => {
    const fetchParticipants = async () => {
      let participants: any = [];
      if (location.pathname.startsWith("/chatroompage")) {
        participants = chatRoomParticipants;
      }

      const profiles = await Promise.all(
        participants.map((id: string) => fetchParticipantInfo(id))
      );
      setParticipantInfos(
        profiles.filter((info) => info !== null) as ParticipantInfo[]
      );
    };

    fetchParticipants();
  }, [chatRoomParticipants]);

  // 자신을 가장 위에 표시하기 위해 사용자 정보를 배열의 맨 앞에 추가
  const orderedParticipants = [
    ...participantInfos.filter((p) => p.uid === currentUser.uid),
    ...participantInfos.filter((p) => p.uid !== currentUser.uid),
  ];

  // Firestore에서 채팅방을 삭제하는 비동기 함수
  const deleteChatRoom = async (chatRoomId: string): Promise<void> => {
    try {
      const chatRoomRef = doc(db, "chatRooms", chatRoomId);
      await deleteDoc(chatRoomRef);
      console.log("Chat room deleted successfully.");
    } catch (error) {
      console.error("Error deleting chat room:", error);
    }
  };
  const handleDeleteChatRoom = async () => {
    if (chatRoomInfo.userId === currentUser.uid) {
      const confirmDelete = window.confirm("정말로 채팅방을 삭제하시겠습니까?");
      if (confirmDelete && chatRoomInfo.chatRoomId) {
        await deleteChatRoom(chatRoomInfo.chatRoomId); // chatRoomInfo.id는 삭제할 채팅방의 ID
        router.push("/");
        closeSidebar();
      }
    } else {
      alert("방장만이 채팅방을 삭제할수 있습니다.");
    }
  };
  return (
    <div className="pageWrapper">
      {chatRoomSidebar && (
        <div
          className={`sidebarOverlay ${chatRoomSidebar ? "overlayShow" : ""}`}
          onClick={closeSidebar}
        ></div>
      )}
      <div
        className={`headerSidebar ${
          chatRoomSidebar ? "headerSidebarShow" : ""
        }`}
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
            {location.pathname.startsWith("/chatroompage") &&
              orderedParticipants.map((participant, index) => (
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
              ))}
          </div>
          {chatRoomInfo.userId === currentUser.uid ? (
            <button
              style={{ marginTop: "20px" }}
              onClick={handleDeleteChatRoom}
            >
              채팅방 삭제
            </button>
          ) : null}
        </>
      </div>
      <ImageModal
        show={showImageModal}
        imageUrl={selectedImage}
        onClose={handleCloseImageModal}
      />
      <ParticipantModal />
    </div>
  );
};

export default Sidebar;
