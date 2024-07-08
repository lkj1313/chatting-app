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
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InfoModal;
