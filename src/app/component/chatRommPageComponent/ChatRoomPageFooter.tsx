"use client";
import React, { useState, useRef, useEffect } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface ChatRoomPageFooter {
  handleSendMessage: (text: string, imageUrl?: string) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  isParticipant: boolean;
  enterChatRoom: () => Promise<void>;
}

const ChatRoomPageFooter: React.FC<ChatRoomPageFooter> = ({
  handleSendMessage,
  handleImageUpload,
  loading,
  isParticipant,

  enterChatRoom,
}) => {
  const [inputText, setInputText] = useState<string>("");
  const [showPicker, setShowPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

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
            ></img>
          </div>
          {/* {loading && <div className="loadingSpinner"></div>} */}
          {showPicker && (
            <div
              ref={pickerRef}
              style={{
                position: "absolute",
                bottom: "60px",
                right: "20px",
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

              // borderLeft: "0.5px solid black",
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
      ) : (
        <div className="chat_restricted" role="button" onClick={enterChatRoom}>
          대화방 들어가기
        </div>
      )}
    </footer>
  );
};

export default ChatRoomPageFooter;
