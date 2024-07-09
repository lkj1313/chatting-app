"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setChatRoomId } from "@/app/store/chatRoomSlice";
import { useRouter } from "next/navigation";

interface ChatRoom {
  id: string;
  channelName: string;
  description: string;
  chatRoomImg: string;
}

const ChatRoomList: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const chatRoomDocs = await getDocs(collection(db, "chatRooms"));
        const chatRoomList = chatRoomDocs.docs.map((doc) => ({
          id: doc.id,
          channelName: doc.data().channelName,
          description: doc.data().description,
          chatRoomImg: doc.data().chatRoomImg,
        }));
        setChatRooms(chatRoomList);
      } catch (error) {
        console.error("Error fetching chat rooms: ", error);
      }
    };

    fetchChatRooms();
  }, []);

  const handleChatBoxClick = (id: string) => {
    router.push(`/chatroompage/${id}`);
    dispatch(setChatRoomId(id));
  };

  return (
    <div
      className="container"
      style={{ width: "100%", height: "100%", padding: "0", margin: "0" }}
    >
      {chatRooms.map((room) => (
        <div className="chatBox chatRow" key={room.id}>
          <div className="container" style={{ height: "70px", padding: "0px" }}>
            <div
              className="row"
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "0",
                height: "100%",
                cursor: "pointer",
              }}
              onClick={() => handleChatBoxClick(room.id)}
            >
              <div
                className="col-3"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0",
                  paddingLeft: "5px",
                  height: "100%",
                }}
              >
                <button className="chatRoomButton">
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
                      {room.channelName[0]}
                    </span>
                  )}
                </button>
              </div>
              <div className="col-9" style={{ height: "100%", padding: "0" }}>
                <div className="row" style={{ height: "60%" }}>
                  <p style={{ margin: "0", fontSize: "20px" }}>
                    <strong>{room.channelName}</strong>
                  </p>
                </div>
                <div className="row" style={{ height: "40%" }}>
                  <p>{room.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList;
