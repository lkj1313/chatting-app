"use client";
import React from "react";
import { Modal, Button } from "react-bootstrap";

interface ParticipantModalProps {
  show: boolean;
  participant: {
    nickname: string;
    profileImg: string;
    additionalInfo?: string; // 필요한 추가 정보
  } | null;
  onClose: () => void;
}

const ParticipantModal: React.FC<ParticipantModalProps> = ({
  show,
  participant,
  onClose,
}) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title style={{ flex: 1, textAlign: "center" }}>
          참가자 정보
        </Modal.Title>
      </Modal.Header>
      <div style={{ display: "flex" }}>
        <Modal.Body>
          {participant && (
            <div>
              <img
                src={participant.profileImg}
                alt={participant.nickname}
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
              <h4 style={{ textAlign: "center", marginTop: "10px" }}>
                {participant.nickname}
              </h4>
              {participant.additionalInfo && (
                <p>{participant.additionalInfo}</p>
              )}
            </div>
          )}
        </Modal.Body>
      </div>
      <div className="infoChatDiv">
        <img src="/comment.png" style={{ width: "30px" }}></img>
        <div>1:1 채팅</div>
      </div>{" "}
    </Modal>
  );
};

export default ParticipantModal;
