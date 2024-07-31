"use client"; // 클라이언트 컴포넌트로 지정
import React from "react";
import { useDispatch } from "react-redux";
import { Navbar, Button } from "react-bootstrap";
import { openSidebar } from "@/app/store/uiSlice";
import ChatRoomSearch from "./ChatRoomSearch"; // ChatRoomSearch 컴포넌트 임포트

interface FirstPageHeaderProps {
  isReadingMode: boolean;
  onClickReadingButton: () => void;
  onClickBackButton: () => void;
  onSelectChatRoom: (channelName: string) => void; // 콜백 함수 프롭 추가
}

const FirstPageHeader: React.FC<FirstPageHeaderProps> = ({
  isReadingMode,
  onClickReadingButton,
  onClickBackButton,
  onSelectChatRoom,
}) => {
  const dispatch = useDispatch();

  return (
    <header className="firstPageHeaderDiv">
      <Navbar
        className="headerNavBar"
        variant="dark"
        expand="lg"
        style={{
          height: "100%",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isReadingMode ? (
          <>
            <button
              onClick={onClickReadingButton}
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <img
                src="/reading.png"
                style={{ height: "40px" }}
                alt="Reading Mode"
              ></img>
            </button>
            <Button
              variant="dark"
              onClick={() => dispatch(openSidebar())}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </Button>
          </>
        ) : (
          <ChatRoomSearch
            onClickBackButton={onClickBackButton}
            onSelectChatRoom={onSelectChatRoom}
          />
        )}
      </Navbar>
    </header>
  );
};

export default React.memo(FirstPageHeader);
