import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

interface ChatRoom {
  channelName: string;
  chatRoomId: string;
}

interface ChatRoomSearchProps {
  onClickBackButton: () => void;
  onSelectChatRoom: (channelName: string) => void; // 콜백 함수 프롭 추가
}

const ChatRoomSearch: React.FC<ChatRoomSearchProps> = ({
  onClickBackButton,
  onSelectChatRoom,
}) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const chatRoomCollection = collection(db, "chatRooms");
        const chatRoomSnapshot = await getDocs(chatRoomCollection);
        const chatRoomList = chatRoomSnapshot.docs.map((doc) => {
          const data = doc.data() as ChatRoom;
          return data;
        });
        setChatRooms(chatRoomList);
      } catch (error) {
        console.error("Error fetching chat rooms: ", error);
      }
    };

    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (selectedChatRoom.length > 0) {
      onSelectChatRoom(selectedChatRoom[0].channelName); // 선택된 채팅방의 이름을 콜백 함수로 전달
    }
  }, [selectedChatRoom, onSelectChatRoom]);

  return (
    <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
      <button
        style={{
          backgroundColor: "transparent",
          border: "none",
          marginRight: "30px",
        }}
        onClick={onClickBackButton}
      >
        <img src="/backIcon.png" style={{ height: "40px" }} alt="Back" />
      </button>
      <Form style={{ width: "100%" }}>
        <Typeahead
          id="chat-room-typeahead"
          labelKey="channelName"
          onChange={(selected) => setSelectedChatRoom(selected as ChatRoom[])}
          options={chatRooms}
          placeholder="검색"
          selected={selectedChatRoom}
          style={{ width: "100%" }}
        />
      </Form>
    </div>
  );
};

export default ChatRoomSearch;
