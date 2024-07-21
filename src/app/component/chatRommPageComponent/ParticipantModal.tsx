"use client";
import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { closeParticipantModal } from "@/app/store/participantModalSlice";
import { initiatePrivateChat } from "@/app/store/privateChatRoomSlice";
import { useRouter } from "next/navigation";
import { addFriend } from "@/app/store/authSlice";
import { db } from "../../../../firebase";
import { arrayUnion, doc, updateDoc, getDoc } from "firebase/firestore";
import { Bounce, toast } from "react-toastify";

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

  const handlePrivateChat = async () => {
    // 1:1 채팅함수
    console.log("handlePrivateChat called");

    if (currentUser && currentUser.uid && selectedParticipant) {
      try {
        toast("Entering chat room...", {
          toastId: "123",
          type: "info",
          position: "top-center",
          transition: Bounce,
        });

        const resultAction = await dispatch(
          initiatePrivateChat({
            myId: currentUser.uid,
            selectedId: selectedParticipant.uid,
          })
        ).unwrap();

        if (resultAction) {
          const chatId = resultAction.chatRoomId; // 반환된 채팅 방 ID
          toast.update("123", {
            render: "채팅방 접속 완료!",
            type: "success",
            autoClose: 500,
            position: "top-center",
            transition: Bounce,
          });

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
  const handleAddFriend = async () => {
    // 친구 추가 함수
    console.log(selectedParticipant); // 선택된 참가자 정보를 콘솔에 출력

    // 현재 로그인된 사용자와 선택된 참가자가 존재하는지 확인
    if (currentUser && currentUser.uid && selectedParticipant) {
      try {
        // Firestore에서 현재 사용자의 문서 참조를 가져옴
        const userDocRef = doc(db, "users", currentUser.uid);

        // Firestore에서 현재 사용자의 문서를 가져옴
        const userDoc = await getDoc(userDocRef);

        // 사용자 문서가 존재하는지 확인
        if (userDoc.exists()) {
          const userData = userDoc.data(); // 사용자 데이터 가져옴

          const friends = userData.friends || []; // 친구 목록을 가져오거나 빈 배열로 초기화

          // 선택된 참가자가 이미 친구 목록에 있는지 확인
          if (friends.includes(selectedParticipant.uid)) {
            alert("이미 추가된 친구입니다."); // 이미 친구인 경우 알림
            return; // 함수 종료
          }

          // Redux 상태 업데이트 (친구 추가)
          dispatch(addFriend(selectedParticipant.uid));

          // Firestore에 친구 추가 (친구 목록에 선택된 참가자 ID 추가)
          await updateDoc(userDocRef, {
            friends: arrayUnion(selectedParticipant.uid),
          });
          console.log("친구가 성공적으로 추가되었습니다."); // 성공 메시지 출력
        } else {
          console.error("사용자 문서를 찾을 수 없습니다."); // 사용자 문서를 찾을 수 없는 경우 오류 메시지 출력
        }
      } catch (error) {
        console.error("친구를 추가하는 데 실패했습니다:", error); // 친구 추가 중 오류 발생 시 오류 메시지 출력
      }
    } else {
      // 로그인된 사용자나 선택된 참가자가 없는 경우 오류 메시지 출력
      if (!currentUser || !currentUser.uid) {
        console.error("로그인이 필요합니다."); // 로그인 필요 메시지 출력
      }
      if (!selectedParticipant) {
        console.error("참가자가 필요합니다."); // 참가자 필요 메시지 출력
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
      {selectedParticipant && selectedParticipant.uid !== currentUser.uid && (
        <div
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
        >
          <div
            className="infoChatDiv"
            style={{ marginRight: "25px" }}
            onClick={handlePrivateChat}
          >
            <img src="/comment.png" style={{ width: "30px" }} />
            <div>1:1 채팅</div>
          </div>
          <div className="infoChatDiv" onClick={handleAddFriend}>
            <img src="/friendIcon.png" style={{ width: "30px" }}></img>
            <div>친구추가</div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ParticipantModal;
