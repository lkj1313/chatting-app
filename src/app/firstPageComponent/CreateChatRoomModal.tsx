"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  setChatRoomImg,
  setChannelName,
  setDescription,
  saveChatRoom,
  setChatRoomId,
} from "@/app/store/chatRoomSlice";
import { closeModal, closeSidebar } from "@/app/store/uiSlice";
import { RootState, AppDispatch } from "@/app/store/store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../firebase";

const CreateChatRoomModal: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const showModal = useSelector((state: RootState) => state.ui.showModal);
  const chatRoomImg = useSelector(
    (state: RootState) => state.chatRoom.chatRoomImg
  );
  const status = useSelector((state: RootState) => state.chatRoom.status);
  const user = useSelector((state: RootState) => state.auth.user);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const faviconUrl = "favicon.png";

  // 로컬 상태
  const [localChannelName, setLocalChannelName] = useState("");
  const [localDescription, setLocalDescription] = useState("");
  const [localChatRoomImg, setLocalChatRoomImg] = useState(chatRoomImg);
  const [channelNameError, setChannelNameError] = useState(
    "채널명은 최소 1자 이상 입력해주세요."
  );

  const handleOverlayClick = () => {
    dispatch(closeModal());
  };

  const handleModalContentClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalChatRoomImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const notify = () => {
    toast.info("채팅방을 생성 중입니다...", {
      autoClose: 100,
      position: "top-center",
    });
  };
  const handleSubmit = async () => {
    console.log("User Info:", user); // 사용자 정보 확인

    // 유저 정보와 채널명 길이 확인 (1자 이상 8자 이하)
    if (
      user &&
      user.uid &&
      user.nickname &&
      localChannelName.length > 0 &&
      localChannelName.length <= 8
    ) {
      notify();

      // 상태를 Redux로 디스패치
      dispatch(setChannelName(localChannelName));
      dispatch(setDescription(localDescription));
      dispatch(setChatRoomImg(localChatRoomImg));

      const resultAction = await dispatch(
        saveChatRoom({
          chatRoomImg: localChatRoomImg,
          channelName: localChannelName,
          description: localDescription,
          userId: user.uid,
          userName: user.nickname,
        })
      );

      if (saveChatRoom.fulfilled.match(resultAction)) {
        const chatRoomId = resultAction.payload;
        dispatch(setChatRoomId(chatRoomId)); // 새로운 채팅방 ID 설정

        // 대화방 생성 후 참가자 목록에 추가
        const chatRoomRef = doc(db, "chatRooms", chatRoomId);
        await updateDoc(chatRoomRef, {
          participants: arrayUnion(user.uid),
        });

        dispatch(closeModal());
        dispatch(closeSidebar()); // 사이드바 닫기
        router.push(`/chatroompage/${chatRoomId}`);
      } else {
        console.error("Failed to create chat room");
      }
    } else {
      // 어느 조건이 false인지 확인하기 위해 각각의 조건을 출력
      if (!user) {
        console.error("User object is null");
      } else {
        if (!user.uid) {
          console.error("User UID is missing");
        }
        if (!user.nickname) {
          console.error("User Nickname is missing");
        }
        if (localChannelName.length === 0) {
          console.error("Channel name is too short");
        }
        if (localChannelName.length > 8) {
          console.error("Channel name is too long");
        }
      }
    }
  };

  const handleChannelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalChannelName(value);
    if (value.length < 1) {
      setChannelNameError("채널명은 최소 1자 이상 입력해주세요.");
    } else if (value.length > 8) {
      setChannelNameError("채널명은 8자 이하로 입력해주세요.");
    } else {
      setChannelNameError("");
    }
  };

  return (
    <>
      {showModal && (
        <div
          className={`modal-overlay ${showModal ? "show" : ""}`}
          onClick={handleOverlayClick}
        ></div>
      )}
      <div
        className={`modalContainer ${showModal ? "modalContainerShow" : ""}`}
        onClick={handleModalContentClick}
        style={{ maxWidth: "300px" }}
      >
        <div className="modal-content">
          <div className="header">
            <div className="headerContainer" style={{ display: "flex" }}>
              <div
                className="fileInputContainer"
                style={{ marginRight: "30px" }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <button
                  style={{
                    border: "none",
                    width: "100px",
                    height: "100px",
                    borderRadius: "50px",

                    cursor: "pointer",
                  }}
                  onClick={handleButtonClick}
                >
                  <img
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50px",
                      objectFit: "cover",
                    }}
                    src={localChatRoomImg || "/camera.png"}
                    alt="Upload"
                  />
                </button>
              </div>
              <div
                className="channelNameContainer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "30px",
                  position: "relative",
                }}
              >
                <input
                  id="channelName"
                  type="text"
                  placeholder="채널명"
                  className="channelInput"
                  value={localChannelName}
                  onChange={handleChannelNameChange}
                  style={{
                    borderColor: channelNameError ? "red" : "initial",
                  }}
                />{" "}
                {channelNameError && (
                  <span
                    style={{
                      color: "red",
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    {channelNameError}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="modal-body">
            <input
              className="descriptionInputBox"
              id="description"
              type="text"
              placeholder="설명 (선택사항)"
              value={localDescription}
              onChange={(e) => setLocalDescription(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button onClick={handleOverlayClick}>취소</button>
            <button onClick={handleSubmit} disabled={status === "loading"}>
              만들기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateChatRoomModal;
