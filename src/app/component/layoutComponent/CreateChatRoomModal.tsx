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
    if (user.uid && user.nickname) {
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
        dispatch(closeModal());
         dispatch(closeSidebar()); // 사이드바 닫기
        router.push(`/chatroompage/${chatRoomId}`);
      } else {
        console.error("Failed to create chat room");
      }
    } else {
      console.error("User information is missing");
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
        className={`modalContainer ${showModal ? "show" : ""}`}
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
                  onChange={(e) => setLocalChannelName(e.target.value)}
                />
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
