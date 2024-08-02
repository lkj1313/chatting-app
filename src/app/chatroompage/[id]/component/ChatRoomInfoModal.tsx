"use client";
import { RootState } from "@/app/store/store";
import React, { use } from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { chatRoomInfoModalClose } from "@/app/store/uiSlice";

interface ChatRoomInfoModalProps {
  chatRoom: any;
  participantProfileImg: string | null;
  participantNickname: string | null;
}

const ChatRoomInfoModal: React.FC<ChatRoomInfoModalProps> = ({ chatRoom }) => {
  const dispatch = useDispatch();

  const infomodalShow = useSelector(
    (state: RootState) => state.ui.chatRoomInfoModalOpen
  );
  const closeInfoModal = () => {
    dispatch(chatRoomInfoModalClose());
  };
  return (
    <>
      <Modal show={infomodalShow} onHide={closeInfoModal}>
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
                        margin: "0",
                      }}
                    >
                      {chatRoom?.channelName?.[0] || "N/A"}
                    </div>
                  )}
                </div>
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
                      {chatRoom?.channelName || "N/A"}
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
                    ></div>
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
    </>
  );
};

export default ChatRoomInfoModal;
