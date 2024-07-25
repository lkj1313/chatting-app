import React, { useState, useRef, useEffect } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../../../../firebase"; // storage 추가
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // storage 관련 함수 추가
import { useParams } from "next/navigation";
import { fetchMessagesByChatRoomId } from "@/app/store/privateChatRoomMessagesSlice";

const PrivateChatRoomPageFooter: React.FC = ({}) => {
  const [inputText, setInputText] = useState<string>("");
  const [showPicker, setShowPicker] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  // URL 파라미터에서 채팅방 ID 가져오기
  const params = useParams();
  const chatRoomId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const handleSendMessage = async (text: string, imageUrl = "") => {
    if ((text.trim() || imageUrl) && user.uid) {
      const newMessage = {
        text,
        time: new Date().toISOString(),
        userId: user.uid,
        userName: user.nickname || "Anonymous",
        profileImg: user.profileImgURL || "/default-profile.png",
        imageUrl,
        readBy: [], // 읽은 사용자 목록 초기화
      };
      await addDoc(
        collection(db, "privateChatRooms", chatRoomId, "messages"),
        newMessage
      );
      // 메시지 전송 후 메시지 목록 다시 불러오기
      dispatch(fetchMessagesByChatRoomId(chatRoomId) as any); // 타입 캐스팅
    }
  };

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage(inputText);
      setInputText("");
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setInputText((prevText) => prevText + emoji.native);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(event.target as Node)
    ) {
      setShowPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          ></img>
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
          className="emojiButtonDiv "
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
            <img src="/favicon.png" style={{ width: "25px" }}></img>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(PrivateChatRoomPageFooter);
