"use client";
import React from "react";
import { Modal, Button } from "react-bootstrap";

interface InfoModalProps {
  show: boolean;
  chatRoom: any;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ show, chatRoom, onClose }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header style={{ border: "none", padding: "0" }}>
        <div style={{ width: "100%" }}>
          <div>
            <p style={{ fontSize: "20px", marginBottom: "20px" }}>채널정보</p>
          </div>
          <div className="container" style={{ width: "100%" }}>
            <div className="row" style={{ display: "flex" }}>
              <div
                className="col-12"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  maxHeight: "300px",
                  marginBottom: "10px",
                }}
              >
                {chatRoom?.chatRoomImg ? (
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
                    }}
                  >
                    {chatRoom?.channelName?.[0] || "N/A"}
                  </div>
                )}
              </div>{" "}
              {/* channelname */}
              <div
                className="row"
                style={{ display: "flex", marginBottom: "5px" }}
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
                  <p
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {chatRoom?.channelName
                      ? `channelName: ${chatRoom.channelName}`
                      : "N/A"}
                  </p>
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
                          description: &nbsp;
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

export default InfoModal;
