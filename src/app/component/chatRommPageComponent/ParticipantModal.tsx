"use client";
import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { closeParticipantModal } from "@/app/store/participantModalSlice";
import { initiatePrivateChat } from "@/app/store/privateChatRoomSlice";
import { useRouter } from "next/navigation";

const ParticipantModal = () => {
  const router = useRouter();
  const handleClose = () => {
    dispatch(closeParticipantModal());
  };
  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user); // 현재 로그인된 사용자 정보를 가져옵니다.
  const { showModal, selectedParticipant } = useSelector(
    (state: RootState) => state.participantModal
  );

  // useEffect(() => {
  //   const handleRouteChange = () => {
  //     dispatch(closeParticipantModal());
  //   };

  //   window.addEventListener("popstate", handleRouteChange);
  //   return () => {
  //     window.removeEventListener("popstate", handleRouteChange);
  //   };
  // }, [dispatch]);

  const handlePrivateChat = async () => {
    console.log("handlePrivateChat called");
    if (currentUser && currentUser.uid && selectedParticipant) {
      try {
        const resultAction = await dispatch(
          initiatePrivateChat({
            myId: currentUser.uid,
            selectedId: selectedParticipant.id,
          })
        ).unwrap();

        if (resultAction) {
          const chatId = resultAction.chatRoomId; // 반환된 채팅 방 ID
          console.log(chatId);
          router.push(`/privatechatroompage/${chatId}`);
        } else {
          console.error("1:1 채팅을 시작하는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("1:1 채팅을 시작하는 데 실패했습니다:", error);
      }
    } else {
      if (!currentUser || !currentUser.uid) {
        console.error("로그인이 필요합니다.");
      }
      if (!selectedParticipant) {
        console.error("참가자가 필요합니다.");
      }
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title style={{ flex: 1, textAlign: "center" }}>
          참가자 정보
        </Modal.Title>
      </Modal.Header>
      <div style={{ display: "flex" }}>
        <Modal.Body>
          {selectedParticipant && (
            <div>
              <img
                src={selectedParticipant.profileImg}
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
              <h4 style={{ textAlign: "center", marginTop: "10px" }}>
                {selectedParticipant.nickname}
              </h4>
              {selectedParticipant.additionalInfo && (
                <p>{selectedParticipant.additionalInfo}</p>
              )}
            </div>
          )}
        </Modal.Body>
      </div>
      {selectedParticipant && selectedParticipant.id !== currentUser.uid && (
        <div className="infoChatDiv" onClick={handlePrivateChat}>
          <img src="/comment.png" style={{ width: "30px" }} />
          <div>1:1 채팅</div>
        </div>
      )}
    </Modal>
  );
};

export default ParticipantModal;
