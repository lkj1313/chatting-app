"use client";
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { initiatePrivateChat } from "@/app/store/privateChatRoomSlice";
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
    // participant 정보 로그 출력

    // 현재 유저 정보와 참가자 정보가 유효한지 확인
    if (currentUser && currentUser.uid && participant) {
      try {
        // initiatePrivateChat 함수를 호출하여 채팅 방 생성 또는 조회
        const resultAction = await dispatch(
          initiatePrivateChat({
            myId: currentUser.uid,
            selectedId: participant.id,
          })
        ).unwrap();

        // 성공적으로 채팅 방이 생성되거나 조회된 경우
        if (resultAction) {
          const chatId = resultAction; // 반환된 채팅 방 ID
          console.log(chatId);
          router.push(`/privatechatroompage/${chatId.chatRoomId}`); // 해당 채팅 방으로 이동
        } else {
          // 오류 처리: 채팅 방 생성 또는 조회 실패
          console.error("1:1 채팅을 시작하는 데 실패했습니다.");
        }
      } catch (error) {
        // 오류 처리: 예외 발생 시
        console.error("1:1 채팅을 시작하는 데 실패했습니다:", error);
      }
    } else {
      // 오류 처리: 유효하지 않은 현재 유저 정보 또는 참가자 정보
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
