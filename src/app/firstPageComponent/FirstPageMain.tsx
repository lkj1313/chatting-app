"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setChatRoomId } from "@/app/store/chatRoomSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ChatRoom {
  id: string;
  channelName: string;
  description: string;
  chatRoomImg: string;
  latestMessage?: string;
}

const FirstPageMain: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const chatRoomDocs = await getDocs(collection(db, "chatRooms"));
        const chatRoomList: ChatRoom[] = await Promise.all(
          chatRoomDocs.docs.map(async (doc) => {
            const latestMessageQuery = query(
              collection(db, "chatRooms", doc.id, "messages"),
              orderBy("time", "desc"),
              limit(1)
            );
            const latestMessageSnapshot = await getDocs(latestMessageQuery);
            const latestMessage =
              latestMessageSnapshot.docs[0]?.data().text || "No messages yet";

            return {
              id: doc.id,
              channelName: doc.data().channelName,
              description: doc.data().description,
              chatRoomImg: doc.data().chatRoomImg,
              latestMessage,
            };
          })
        );
        setChatRooms(chatRoomList);
      } catch (error) {
        console.error("Error fetching chat rooms: ", error);
      }
    };

    fetchChatRooms();
  }, []);
  const handleChatBoxClick = (id: string) => {
    toast.info("Entering chat room...", {
      autoClose: 1000,
      position: "top-center",
    });

    // Delay the navigation and state update slightly to allow the toast to show
    setTimeout(() => {
      router.push(`/chatroompage/${id}`);
      dispatch(setChatRoomId(id));
    }, 1000); // Adjust the delay to match the toast duration
  };

  return (
    <div
      className="firstPageMaincontainer"
      style={{ width: "100%", height: "100%", padding: "0", margin: "0" }}
    >
      {chatRooms.length > 0 ? (
        chatRooms.map((room) => (
          <div className="chatBox chatRow" key={room.id}>
            <div
              className="container"
              style={{ height: "70px", padding: "0px" }}
            >
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
                    ) : room.channelName ? (
                      <span
                        style={{
                          color: "black",
                          fontSize: "16px",
                          textAlign: "center",
                        }}
                      >
                        {room.channelName[0]}
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "black",
                          fontSize: "16px",
                          textAlign: "center",
                        }}
                      >
                        N/A
                      </span>
                    )}
                  </button>
                </div>
                <div className="col-9" style={{ height: "100%", padding: "0" }}>
                  <div className="row" style={{ height: "60%" }}>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "20px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <strong>{room.channelName}</strong>
                    </p>
                  </div>
                  <div className="row" style={{ height: "40%" }}>
                    <p
                      style={{
                        margin: "0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {room.latestMessage}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No chat rooms available</p>
      )}
    </div>
  );
};

export default FirstPageMain;
