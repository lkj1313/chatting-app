"use client";
import React from "react";
import { Modal, Button } from "react-bootstrap";

interface ChatRoomInfoModalProps {
  show: boolean;
  chatRoom: any;
  participantProfileImg: string | null;
  participantNickname: string | null;
  onClose: () => void;
}

const ChatRoomInfoModal: React.FC<ChatRoomInfoModalProps> = ({
  show,
  chatRoom,
  participantProfileImg,
  participantNickname,
  onClose,
}) => {
  const isPrivateChat = location.pathname.startsWith("/privatechatroompage");

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header style={{ border: "none", padding: "0" }}>
        <div style={{ width: "100%" }}>
          <div className="container" style={{ width: "100%" }}>
            <div
              className="row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="col-12"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  maxHeight: "300px",
                  marginBottom: "10px",
                }}
              >
                {isPrivateChat ? (
                  <img
                    src={participantProfileImg || "default_image_url"}
                    alt="Participant Profile Image"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "75px",
                    }}
                  />
                ) : chatRoom?.chatRoomImg ? (
                  <img
                    src={chatRoom.chatRoomImg}
                    alt="Chat Room Image"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "75px",
                    }}
                  />
                ) : (
                  <div
                    className="col-5"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "75px",
                      backgroundColor: "#ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "30px",
                      textAlign: "center",
                      marginRight: "30px",
                      margin: "0",
                    }}
                  >
                    {chatRoom?.channelName?.[0] || "N/A"}
                  </div>
                )}
              </div>{" "}
              {/* channelname */}
              <div
                className="row"
                style={{ display: "flex", margin: "0", marginBottom: "5px" }}
              >
                <div
                  className="col-12"
                  style={{
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    className="col-12"
                    style={{
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isPrivateChat
                      ? participantNickname
                        ? `${participantNickname}`
                        : "N/A"
                      : chatRoom?.channelName
                      ? `${chatRoom.channelName}`
                      : "N/A"}
                  </div>
                </div>
                <div className="row">
                  <div
                    className="col-12"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "0",
                    }}
                  >
                    {chatRoom?.description ? (
                      <p
                        style={{
                          margin: "0",
                          fontSize: "15px",
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
                          설명: &nbsp;
                        </span>
                        {chatRoom.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatRoomInfoModal;