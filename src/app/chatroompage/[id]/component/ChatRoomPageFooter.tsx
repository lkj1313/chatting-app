"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "../../../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "next/navigation";

interface ChatRoomPageFooterProps {
  handleSendMessage: (text: string, imageUrl?: string) => void;
  chatRoomParticipants: string[];
}

interface ParticipantMap {
  [chatRoomId: string]: boolean;
}

const ChatRoomPageFooter: React.FC<ChatRoomPageFooterProps> = ({
  handleSendMessage,
  chatRoomParticipants,
}) => {
  const [inputText, setInputText] = useState<string>("");
  const [showPicker, setShowPicker] = useState(false);
  const [participantMap, setParticipantMap] = useState<ParticipantMap>({});
  const user = useSelector((state: RootState) => state.auth.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // URL 파라미터에서 채팅방 ID 가져오기
  const params = useParams();

  // params.id가 배열인 경우 첫 번째 요소를 사용하고, 그렇지 않으면 그대로 사용
  const chatRoomId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  // 디버깅 로그 추가
  console.log("Chat Room ID:", chatRoomId);
  console.log("User UID:", user?.uid);
  console.log("Participant Map:", participantMap);

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
    if (!chatRoomId || !user?.uid) {
      console.error("ChatRoom ID or User UID is null");
      return;
    }

    try {
      // 채팅방 문서 참조
      const chatRoomRef = doc(db, "chatRooms", chatRoomId);
      const chatRoomDoc = await getDoc(chatRoomRef);

      // 문서가 존재하지 않는다면 생성
      if (!chatRoomDoc.exists()) {
        await setDoc(chatRoomRef, { participants: [user.uid] });
      } else {
        await updateDoc(chatRoomRef, {
          participants: arrayUnion(user.uid),
        });
      }

      // 사용자 문서 참조
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      // 문서가 존재하지 않는다면 생성
      if (!userDoc.exists()) {
        await setDoc(userRef, { participatingRoom: [chatRoomId] });
      } else {
        await updateDoc(userRef, {
          participatingRoom: arrayUnion(chatRoomId),
        });
      }

      setParticipantMap((prevMap) => ({ ...prevMap, [chatRoomId]: true }));
    } catch (error) {
      console.error("Error adding user to participants: ", error);
    }
  }, [chatRoomId, user?.uid]);
  console.log("차트룸참가자", chatRoomParticipants);
  useEffect(() => {
    if (user?.uid && chatRoomParticipants.includes(user.uid)) {
      setParticipantMap((prevMap) => ({ ...prevMap, [chatRoomId]: true }));
    } else {
      setParticipantMap((prevMap) => ({ ...prevMap, [chatRoomId]: false }));
    }
  }, [user?.uid, chatRoomParticipants, chatRoomId]);

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
      {participantMap[chatRoomId] ? (
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
        <button
          style={{ width: "100%", height: "100%", borderRadius: "0" }}
          type="button"
          className="btn btn-secondary"
          onClick={enterChatRoom}
        >
          대화방 참가
        </button>
      )}
    </footer>
  );
};

export default React.memo(ChatRoomPageFooter);
