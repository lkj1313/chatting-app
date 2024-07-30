"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { UseDispatch, useDispatch, useSelector } from "react-redux";
import { fetchChatRooms, setChatRoomId } from "@/app/store/chatRoomSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppDispatch, RootState } from "../store/store";

interface ChatRoom {
  id: string;
  channelName: string;
  description: string;
  chatRoomImg: string;
  latestMessage?: string;
}

const FirstPageMain: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const router = useRouter();
  const chatRooms = useSelector((state: RootState) => state.chatRoom.chatRooms);

  useEffect(() => {
    dispatch(fetchChatRooms());
  }, [dispatch]);

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
      style={{
        width: "100%",
        height: "100%",
        padding: "0",
        margin: "0",
        overflowX: "hidden",
      }}
    >
      {chatRooms.length > 0 ? (
        chatRooms.map((room) => (
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
