"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "../store/store";
import { fetchChatRooms, setChatRoomId } from "@/app/store/chatRoomSlice";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { ChatRoomState } from "@/app/store/chatRoomSlice";
interface FirstPageMainProps {
  selectedChatRoomId?: string;
  isReadingMode: boolean;
}

const FirstPageMain: React.FC<FirstPageMainProps> = ({
  selectedChatRoomId,
  isReadingMode,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const chatRooms = useSelector((state: RootState) => state.chatRoom.chatRooms);
  console.log("chatRooms", chatRooms);
  const [allChatRooms, setAllChatRooms] = useState<ChatRoomState[]>([]);
  useEffect(() => {
    dispatch(fetchChatRooms());
  }, [dispatch]);
  useEffect(() => {
    const fetchAllChatRooms = async () => {
      try {
        const chatRoomCollection = collection(db, "chatRooms");
        const chatRoomSnapshot = await getDocs(chatRoomCollection);
        const chatRoomList: ChatRoomState[] = chatRoomSnapshot.docs.map(
          (doc) => {
            const data = doc.data() as ChatRoomState;
            return {
              chatRoomId: doc.id,
              channelName: data.channelName,
              description: data.description,
              chatRoomImg: data.chatRoomImg,
              latestMessage: data.latestMessage || "No messages yet",
              participants: data.participants,
              userId: data.userId,
              userName: data.userName,
              status: "idle",
              error: null,
              chatRooms: [],
            };
          }
        );
        setAllChatRooms(chatRoomList);
      } catch (error) {
        console.error("Error fetching chat rooms: ", error);
      }
    };

    fetchAllChatRooms();
  }, [dispatch]);

  const handleChatBoxClick = (id: string) => {
    router.push(`/chatroompage/${id}`);
    dispatch(setChatRoomId(id));
  };

  const filteredChatRooms = isReadingMode
    ? allChatRooms.filter((room) => room.chatRoomId === selectedChatRoomId)
    : chatRooms;

  return (
    <div className="firstPageMaincontainer">
      {filteredChatRooms.length > 0 ? (
        filteredChatRooms.map((room) => (
          <div className="chatBox chatRow" key={room.chatRoomId}>
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
                onClick={() =>
                  room.chatRoomId && handleChatBoxClick(room.chatRoomId)
                }
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
                      <img src={room.chatRoomImg} />
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

export default React.memo(FirstPageMain);
