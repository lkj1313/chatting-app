// ChatInput.tsx
"use client";
import React, { useState, useRef } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface ChatInputProps {
  handleSendMessage: (text: string, imageUrl?: string) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

const ChatInputComponent: React.FC<ChatInputProps> = ({
  handleSendMessage,
  handleImageUpload,
  loading,
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

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <footer className="footer">
      <div className="uploadButtonDiv container">
        <button
          className="uploadButton"
          onClick={() => fileInputRef.current?.click()}
        >
          {loading ? (
            <div className="loadingSpinner"></div>
          ) : (
            <img
              style={{ height: "100%", width: "100%" }}
              src="/uploadButton.png"
              alt="Upload"
            />
          )}
        </button>
      </div>
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
      <div className="emojiButtonDiv" style={{}}>
        <button
          className="emojiButton"
          style={{}}
          onClick={() => setShowPicker(!showPicker)}
        >
          <span>😊</span>
        </button>
      </div>
    </footer>
  );
};

export default ChatInputComponent;
