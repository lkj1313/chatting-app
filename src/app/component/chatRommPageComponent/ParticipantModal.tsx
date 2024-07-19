"use client";
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchPrivateChatRoomById } from "@/app/store/privateChatRoomSlice";
import { RootState, AppDispatch } from "@/app/store/store";

interface ParticipantModalProps {
  show: boolean;
  participant: {
    nickname: string;
    profileImg: string;
    additionalInfo?: string; // 필요한 추가 정보
    id: string;
  } | null;
  onClose: () => void;
}

const ParticipantModal: React.FC<ParticipantModalProps> = ({
  show,
  participant,
  onClose,
}) => {
  console.log("Participant in Modal:", participant); // 추가된 콘솔 로그
  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user); // 현재 로그인된 사용자 정보를 가져옵니다.
  const router = useRouter();

  const handlePrivateChat = async () => {
    console.log(participant);
    if (currentUser && currentUser.uid && participant) {
      const resultAction = await dispatch(
        fetchPrivateChatRoomById(participant.id)
      );
      if (fetchPrivateChatRoomById.fulfilled.match(resultAction)) {
        const chatId = resultAction.payload;
        router.push(`/privatechatroompage/${chatId}`);
      } else {
        // 오류 처리
        console.error(
          "1:1 채팅을 시작하는 데 실패했습니다:",
          resultAction.payload
        );
      }
    } else {
      if (!currentUser || !currentUser.uid) {
        console.error("로그인이 필요합니다.");
      }
      if (!participant) {
        console.error("참가자가 필요합니다.");
      }
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title style={{ flex: 1, textAlign: "center" }}>
          참가자 정보
        </Modal.Title>
      </Modal.Header>
      <div style={{ display: "flex" }}>
        <Modal.Body>
          {participant && (
            <div>
              <img
                src={participant.profileImg}
                alt={participant.nickname}
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
              <h4 style={{ textAlign: "center", marginTop: "10px" }}>
                {participant.nickname}
              </h4>
              {participant.additionalInfo && (
                <p>{participant.additionalInfo}</p>
              )}
            </div>
          )}
        </Modal.Body>
      </div>
      <div className="infoChatDiv" onClick={handlePrivateChat}>
        <img src="/comment.png" style={{ width: "30px" }}></img>
        <div>1:1 채팅</div>
      </div>{" "}
    </Modal>
  );
};

export default ParticipantModal;
