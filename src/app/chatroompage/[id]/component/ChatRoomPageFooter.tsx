"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, storage } from "../../../../../firebase"; // storage 추가
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // storage 관련 함수 추가
import { useParams } from "next/navigation";

interface ChatRoomPageFooterProps {
  handleSendMessage: (text: string, imageUrl?: string) => void;
}

const ChatRoomPageFooter: React.FC<ChatRoomPageFooterProps> = ({
  handleSendMessage,
}) => {
  const [inputText, setInputText] = useState<string>("");
  const [showPicker, setShowPicker] = useState(false);
  const [isParticipant, setIsParticipant] = useState<boolean>(false); // 사용자가 채팅방 참가자인지 여부
  const user = useSelector((state: RootState) => state.auth.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState<boolean>(false); // 사용자가 채팅방에 들어왔는지 여부

  // URL 파라미터에서 채팅방 ID 가져오기
  const params = useParams();

  // params.id가 배열인 경우 첫 번째 요소를 사용하고, 그렇지 않으면 그대로 사용
  const chatRoomId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  // 이미지 업로드 함수
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const storageRef = ref(storage, `chatImages/${file.name}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
        handleSendMessage("", imageUrl);
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    }
  };

  // chatroom 입장 함수
  const enterChatRoom = useCallback(async () => {
    try {
      const chatRoomRef = doc(db, "chatRooms", chatRoomId);
      await updateDoc(chatRoomRef, {
        participants: arrayUnion(user.uid),
      });
      setIsParticipant(true);
      setHasEntered(true);
    } catch (error) {
      console.error("Error adding user to participants: ", error);
    }
  }, [chatRoomId, user.uid]);

  useEffect(() => {
    if (user.uid && !isParticipant) {
      enterChatRoom(); // 사용자 자동 참가
    }
  }, [user.uid, isParticipant, enterChatRoom]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSendMessage(inputText);
        setInputText("");
      }
    },
    [inputText, handleSendMessage]
  );

  const handleEmojiSelect = useCallback((emoji: any) => {
    setInputText((prevText) => prevText + emoji.native);
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(event.target as Node)
    ) {
      setShowPicker(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <footer
      className="container-fluid"
      style={{
        margin: "0",
        padding: "0",
        height: "50px",
        borderBottom: "1px solid gray",
        position: "relative",
      }}
    >
      {isParticipant ? (
        <div
          className="row"
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            margin: "0",
            padding: "0",
          }}
        >
          <div
            className="uploadButtonDiv"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "50px",
              margin: "0",
              padding: "0",
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src="/uploadButton.png"
              alt="uploadButton"
              style={{ width: "30px" }}
            />
          </div>

          {showPicker && (
            <div
              ref={pickerRef}
              style={{
                position: "absolute",
                bottom: "60px",
                right: "1px",
                width: "auto",
                height: "auto",
              }}
            >
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                emojiSize={20}
                perLine={7}
                theme="light"
                style={{ width: "250px", height: "300px" }}
              />
            </div>
          )}
          <input
            style={{
              flex: 1,
              height: "100%",
              margin: "0",
              padding: "10px",
              fontSize: "15px",
            }}
            className="chatInput"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="내용 입력"
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />

          <div
            className="emojiButtonDiv"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "50px",
              margin: "0",
              padding: "0",
            }}
          >
            <button
              className="emojiButton"
              style={{
                height: "100%",
                width: "50px",
                margin: "0",
                padding: "0",
                border: "none",
                fontSize: "20px",
                backgroundColor: "transparent",
              }}
              onClick={() => setShowPicker(!showPicker)}
            >
              😊
            </button>
          </div>
          <div
            className="chatSubmitDiv"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "50px",
              margin: "0",
              padding: "0",
              cursor: "pointer",
            }}
          >
            <button
              style={{
                height: "100%",
                width: "50px",
                margin: "0",
                padding: "0",
                border: "none",
                fontSize: "20px",
                backgroundColor: "transparent",
              }}
              onClick={() => {
                handleSendMessage(inputText);
                setInputText("");
              }}
            >
              <img src="/favicon.png" style={{ width: "25px" }} />
            </button>
          </div>
        </div>
      ) : (
        <div className="chat_restricted" role="button" onClick={enterChatRoom}>
          대화방 들어가기
        </div>
      )}
    </footer>
  );
};

export default React.memo(ChatRoomPageFooter);
