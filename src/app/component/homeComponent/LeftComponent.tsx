"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateChatRoomModal from "./sidebarComponent/chatroom/CreateChatRoomModal";
import { openSidebar } from "@/app/store/uiSlice";
import Sidebar from "@/app/component/homeComponent/sidebarComponent/SidebarComponent";
import { db } from "../../../../firebase";
import { collection, getDocs } from "firebase/firestore";

import { setChatRoomId } from "@/app/store/chatRoomSlice";

interface ChatRoom {
  chatRoomId: string;
  channelName: string;
  chatRoomImg: string;
}
const LeftComponent: React.FC = () => {
  const [width, setWidth] = useState("8%"); // 초기 너비를 8%로 설정
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const dispatch = useDispatch();

  const toggleWidth = () => {
    if (windowWidth > 761) {
      // 761px 이상일 때만 토글 기능 활성화
      setWidth((prevWidth) => (prevWidth === "8%" ? "15%" : "8%"));
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 330) {
        setWidth("35%"); // 330px 미만일 때 너비를 40%로 설정
      } else if (330 <= window.innerWidth && window.innerWidth <= 460) {
        setWidth("30%"); // 330px 이상 390px 이하일 때 너비를 30%로 설정
      } else if (window.innerWidth <= 761) {
        setWidth("25%"); // 761px 이하일 때 너비를 15%로 설정
      } else {
        setWidth("8%"); // 기본 너비 설정
      }
    };

    window.addEventListener("resize", handleResize);

    // 초기 로드 시에도 너비를 설정
    handleResize();

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    // Firestore에서 "chatRooms" 컬렉션의 모든 문서를 가져옵니다.
    const querySnapshot = await getDocs(collection(db, "chatRooms"));

    // 빈 배열을 생성하여 가져온 채팅방 데이터를 저장할 준비를 합니다.
    const rooms: ChatRoom[] = [];

    // 쿼리 스냅샷의 각 문서를 순회합니다.
    querySnapshot.forEach((doc) => {
      // 각 문서의 데이터를 추출하여 chatRoomId와 함께 rooms 배열에 추가합니다.
      rooms.push({ chatRoomId: doc.id, ...doc.data() } as ChatRoom);
    });

    // rooms 배열을 상태로 설정하여 컴포넌트가 재렌더링되도록 합니다.
    setChatRooms(rooms);
    console.log(chatRooms);
  };
  const handleChatRoomClick = (chatRoomId: string) => {
    dispatch(setChatRoomId(chatRoomId));
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: width,
        transition: "width 0.3s ease",
        borderRight: "1px solid #ccc",
        boxSizing: "border-box",
        padding: "0",
        position: "relative",
      }}
    >
      <Sidebar />
      <div className="buttonContainer">
        <button
          className="hamburger"
          onClick={() => dispatch(openSidebar())} // 사이드바 열기 액션 디스패치
        >
          <img style={{ width: "40px" }} src="/Hamburger_icon.png" />
        </button>
      </div>
      <>
        {chatRooms.map((room) => (
          <div key={room.chatRoomId} className="chatRoomButtonContainer">
            <button
              className="chatRoomButton"
              onClick={() => handleChatRoomClick(room.chatRoomId)}
            >
              {room.chatRoomImg ? (
                <img src={room.chatRoomImg} alt={room.channelName} />
              ) : (
                <span
                  style={{
                    color: "black",
                    fontSize: "16px",
                    textAlign: "center",
                  }}
                >
                  {room.channelName[0]} {/* 채팅방 이름의 첫 글자를 표시 */}
                </span>
              )}
            </button>
          </div>
        ))}
      </>
      <div
        className="resizable-handle"
        onClick={toggleWidth}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "7px",
          cursor: "pointer",
          backgroundColor: "#007bff",
        }}
      />
      <CreateChatRoomModal />
    </div>
  );
};

export default LeftComponent;
