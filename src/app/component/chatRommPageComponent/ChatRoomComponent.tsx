"use client";
import  { useEffect, useState, useRef } from "react";
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // 스토리지 관련 함수 추가
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Modal, Button } from "react-bootstrap";

interface ChatRoomComponentProps {
  chatRoomId: string;
}

interface Message {
  id: string;
  text: string;
  time: string;
  userId: string;
  userName: string;
  profileImg: string;
  imageUrl?: string; // 이미지 URL 추가
}

const ChatRoomComponent: React.FC<ChatRoomComponentProps> = ({
  chatRoomId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [chatRoom, setChatRoom] = useState<any>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const userProfileImg = user.profileImgURL;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null); // 타입을 명시적으로 지정
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [showImageChattingModal, setImageChattingShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    if (chatRoomId) {
      dispatch(fetchChatRoomById(chatRoomId));

      // Firestore에서 채팅방 정보 가져오기
      const chatRoomRef = doc(db, "chatRooms", chatRoomId);
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

      // Firestore에서 메시지 실시간 업데이트
      const messagesRef = collection(db, "chatRooms", chatRoomId, "messages");
      const q = query(messagesRef, orderBy("time"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs: Message[] = [];
        querySnapshot.forEach((doc) => {
          console.log(doc);
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
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });

      // 컴포넌트 언마운트 시 실시간 업데이트 구독 해제
      return () => unsubscribe();
    }
  }, [chatRoomId, dispatch]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (imageUrl = "") => {
    if ((inputText.trim() || imageUrl) && user.uid) {
      const newMessage = {
        text: inputText,
        time: new Date().toISOString(),
        userId: user.uid,
        userName: user.nickname || "Anonymous",
        profileImg: userProfileImg,
        imageUrl,
      };
      await addDoc(
        collection(db, "chatRooms", chatRoomId, "messages"),
        newMessage
      );
      setInputText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true); // 로딩 시작
      try {
        const storageRef = ref(storage, `chatImages/${file.name}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
        setImageUrl(imageUrl);
        handleSendMessage(imageUrl);
      } catch (error) {
        console.error("Error uploading image: ", error);
      } finally {
        setLoading(false); // 로딩 종료
      }
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setInputText((prevText) => prevText + emoji.native);
  };

  const handleClickOutside = (event: MouseEvent) => {
    // 이모지바깥 클릭시 setshowpicker false
    if (
      pickerRef.current &&
      !pickerRef.current.contains(event.target as Node)
    ) {
      setShowPicker(false);
    }
  };

  useEffect(() => {
    // 마우스다운시 handleclickoutside함수 발동
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageClick = (url: string) => {
    setModalImage(url);
    setImageChattingShowModal(true);
  };

  const closeImgeModal = () => {
    //채팅이미지모달
    setImageChattingShowModal(false);
    setModalImage(null);
  };

  const openInfoModal = () => setShowInfoModal(true);
  const closeInfoModal = () => setShowInfoModal(false);
  return (
    <div className="chat_wrap">
      <header className="chatRoomHeader" onClick={openInfoModal}>
        {chatRoom ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
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
                  marginRight: "20px", // 원과 텍스트 사이 간격 추가
                }}
              >
                {chatRoom && chatRoom.channelName ? (
                  <p
                    style={{
                      margin: "0",
                      fontSize: "30px",
                      userSelect: "none",
                    }}
                  >
                    {chatRoom.channelName[0]}
                  </p>
                ) : (
                  <p
                    style={{
                      margin: "0",
                      fontSize: "30px",
                      userSelect: "none",
                    }}
                  >
                    N/A
                  </p>
                )}
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
                  flexGrow: 1, // 가용 공간을 균등하게 나누기 위해 설정
                }}
              >
                {" "}
                channelName : &nbsp;
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "13px",
                  userSelect: "none",
                  flexGrow: 1, // 가용 공간을 균등하게 나누기 위해 설정
                  overflow: "hidden", // 넘치는 텍스트 숨기기
                  textOverflow: "ellipsis", // 넘치는 텍스트를 ...로 표시
                }}
              >
                {chatRoom.channelName}
              </p>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </header>
      <div className="inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-container ${
              msg.userId === user.uid ? "mymsg" : ""
            }`}
          >
            {msg.userId !== user.uid && (
              <img
                src={msg.profileImg}
                alt={msg.userName}
                className="profile-image"
              />
            )}
            <div
              className={`message-box ${
                msg.userId === user.uid ? "mymsg" : ""
              }`}
            >
              {msg.userId !== user.uid && (
                <div className="user">{msg.userName}</div>
              )}
              <div className="text">
                {msg.text}
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Uploaded"
                    style={{
                      maxWidth: "100%",
                      marginTop: "0",
                      cursor: "pointer",
                    }}
                    onClick={() => handleImageClick(msg.imageUrl!)}
                  />
                )}
              </div>
              <div className="time">
                {new Date(msg.time).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>

      <footer className="footer">
        <div className="uploadButtonDiv">
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
              style={{ width: "250px", height: "300px" }} // Picker 크기 조절
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
        />{" "}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />{" "}
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
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignContent: "flex-start",
            border: "none",
          }}
        >
          <Modal.Header style={{ border: "none" }}>
            <div style={{ width: "100%" }}>
              <div>
                <p style={{ fontSize: "20px", marginBottom: "20px" }}>
                  채널정보
                </p>
              </div>

              <div className="container" style={{ width: "100%" }}>
                <div className="row">
                  <div className="col-5">
                    {chatRoom && chatRoom.chatRoomImg ? ( //이미지가있을시 이미지
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
                      <div // 이미지가없을시 둥근원
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
                        {chatRoom && chatRoom.channelName ? (
                          <p
                            style={{
                              margin: "0",
                              userSelect: "none",
                              width: "100%",
                            }}
                          >
                            {chatRoom.channelName[0]}
                          </p>
                        ) : (
                          <p
                            style={{
                              margin: "0",
                              userSelect: "none",
                            }}
                          >
                            N/A
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 채널명, 채널정보 DIV*/}
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
        </div>
      </Modal>
    </div>
  );
};

export default ChatRoomComponent;
