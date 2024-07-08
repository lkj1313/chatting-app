// ChatRoomPage.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatRoomById } from "@/app/store/chatRoomSlice";
import { RootState, AppDispatch } from "@/app/store/store";
import { db, storage } from "../../../../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Modal, Button } from "react-bootstrap";

import ChatInputComponent from "@/app/chatroompage/components/ChatInputComponent";
import MessageListComponent from "@/app/chatroompage/components/MessageListComponent";
import { Message } from "@/app/chatroompage/components/type";

const ChatRoomPage = ({ params }: { params: { id: string } }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [chatRoom, setChatRoom] = useState<any>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const userProfileImg = user.profileImgURL;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [showImageChattingModal, setImageChattingShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchChatRoomById(params.id));

      const chatRoomRef = doc(db, "chatRooms", params.id);
      getDoc(chatRoomRef)
        .then((doc) => {
          if (doc.exists()) {
            setChatRoom(doc.data());
          } else {
            console.error("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });

      const messagesRef = collection(db, "chatRooms", params.id, "messages");
      const q = query(messagesRef, orderBy("time"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs: Message[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          msgs.push({
            id: doc.id,
            text: data.text,
            time: data.time,
            userId: data.userId,
            userName: data.userName,
            profileImg: userProfileImg || "",
            imageUrl: data.imageUrl || "",
          });
        });
        setMessages(msgs);
      });

      return () => unsubscribe();
    }
  }, [params.id, dispatch]);

  const handleSendMessage = async (text: string, imageUrl = "") => {
    if ((text.trim() || imageUrl) && user.uid) {
      const newMessage = {
        text,
        time: new Date().toISOString(),
        userId: user.uid,
        userName: user.nickname || "Anonymous",
        profileImg: userProfileImg,
        imageUrl,
      };
      await addDoc(
        collection(db, "chatRooms", params.id, "messages"),
        newMessage
      );
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        const storageRef = ref(storage, `chatImages/${file.name}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
        handleSendMessage("", imageUrl);
      } catch (error) {
        console.error("Error uploading image: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImageClick = (url: string) => {
    setModalImage(url);
    setImageChattingShowModal(true);
  };

  const closeImgeModal = () => {
    setImageChattingShowModal(false);
    setModalImage(null);
  };

  const openInfoModal = () => setShowInfoModal(true);
  const closeInfoModal = () => setShowInfoModal(false);

  return (
    <div className="chat_wrap">
      <header className="chatRoomHeader" onClick={openInfoModal}>
        {chatRoom ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            {chatRoom.chatRoomImg ? (
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "25px",
                  marginRight: "20px",
                }}
                src={chatRoom.chatRoomImg}
                alt="Chat Room Image"
              />
            ) : (
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "25px",
                  backgroundColor: "#ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "12px",
                  textAlign: "center",
                  marginRight: "20px",
                }}
              >
                {chatRoom?.channelName?.[0] || "N/A"}
              </div>
            )}
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0",
                  fontSize: "13px",
                  userSelect: "none",
                  display: "flex",
                  alignItems: "center",
                  flexGrow: 1,
                }}
              >
                channelName : &nbsp;
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "13px",
                  userSelect: "none",
                  flexGrow: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {chatRoom?.channelName || "N/A"}
              </p>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </header>

      <MessageListComponent
        messages={messages}
        userId={user.uid!}
        handleImageClick={handleImageClick}
      />

      <ChatInputComponent
        handleSendMessage={handleSendMessage}
        handleImageUpload={handleImageUpload}
        loading={loading}
      />

      <Modal show={showImageChattingModal} onHide={closeImgeModal}>
        <Modal.Body>
          {modalImage && (
            <img src={modalImage} alt="Modal" style={{ width: "100%" }} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeImgeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showInfoModal} onHide={closeInfoModal}>
        <Modal.Header style={{ border: "none" }}>
          <div style={{ width: "100%" }}>
            <div>
              <p style={{ fontSize: "20px", marginBottom: "20px" }}>채널정보</p>
            </div>
            <div className="container" style={{ width: "100%" }}>
              <div className="row">
                <div className="col-5">
                  {chatRoom?.chatRoomImg ? (
                    <img
                      src={chatRoom.chatRoomImg}
                      alt="Chat Room Image"
                      style={{
                        width: "100%",
                        height: "100px",
                        borderRadius: "50px",
                      }}
                    />
                  ) : (
                    <div
                      className="col-5"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50px",
                        backgroundColor: "#ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "30px",
                        textAlign: "center",
                        marginRight: "30px",
                      }}
                    >
                      {chatRoom?.channelName?.[0] || "N/A"}
                    </div>
                  )}
                </div>
                <div className="col-7">
                  <div
                    className="container d-flex flex-column"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <div
                      className="row flex-grow-1 d-flex align-items-center justify-content-center"
                      style={{
                        border: "1px solid black",
                        width: "100%",
                        height: "50%",
                      }}
                    >
                      <div className="col-12">
                        <p
                          style={{
                            margin: 0,
                            fontSize: "10px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "10px",
                              display: "flex",
                              alignItems: "center",
                              margin: 0,
                            }}
                          >
                            channelName: &nbsp;
                          </span>
                          {chatRoom?.channelName || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div
                      className="row flex-grow-1 d-flex align-items-center justify-content-center"
                      style={{ width: "100%", height: "50%" }}
                    >
                      <div className="col-12">
                        <p
                          style={{
                            margin: "0",
                            fontSize: "30px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "20px",
                              display: "flex",
                              alignItems: "center",
                              margin: "0",
                            }}
                          >
                            description: &nbsp;
                          </span>{" "}
                          {chatRoom?.description || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeInfoModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChatRoomPage;
