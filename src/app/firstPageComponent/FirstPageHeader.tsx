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
  onSelectChatRoom: (chatRoomId: string) => void;
  activeComponent: string; // 추가
}

const FirstPageHeader: React.FC<FirstPageHeaderProps> = ({
  isReadingMode,
  onClickReadingButton,
  onClickBackButton,
  onSelectChatRoom,
  activeComponent, // 추가
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
        {activeComponent === "main" && isReadingMode ? (
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
          activeComponent === "main" &&
          !isReadingMode && (
            <ChatRoomSearch
              onClickBackButton={onClickBackButton}
              onSelectChatRoom={onSelectChatRoom}
            />
          )
        )}
      </Navbar>
    </header>
  );
};

export default React.memo(FirstPageHeader);
