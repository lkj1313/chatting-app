import React, { useRef } from "react";
import { Modal, Button } from "react-bootstrap";

interface ProfileModalProps {
  show: boolean;
  onClose: () => void;
  user: any;
  newNickname: string;
  isEditingNickname: boolean;
  newStatusMessage: string;
  isEditingStatusMessage: boolean;
  onNicknameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNicknameSave: () => void;
  onNicknameBlur: () => void;
  onNicknameClick: () => void;
  onStatusMessageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusMessageSave: () => void;
  onStatusMessageBlur: () => void;
  onStatusMessageClick: () => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageClick: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  show,
  onClose,
  user,
  newNickname,
  isEditingNickname,
  newStatusMessage,
  isEditingStatusMessage,
  onNicknameChange,
  onNicknameSave,
  onNicknameBlur,
  onNicknameClick,
  onStatusMessageChange,
  onStatusMessageSave,
  onStatusMessageBlur,
  onStatusMessageClick,
  onImageChange,
  onImageClick,
}) => {
  const changeProfileImgInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (changeProfileImgInputRef.current) {
      changeProfileImgInputRef.current.click();
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Modal.Header>
          <Modal.Title>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="file"
                ref={changeProfileImgInputRef}
                style={{ display: "none" }}
                onChange={onImageChange}
              />
              <button
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "35px",
                  border: "none",
                  cursor: "pointer",
                  marginRight: "30px",
                }}
                onClick={handleImageClick}
              >
                <img
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "35px",
                  }}
                  src={user.profileImgURL}
                  alt="Profile"
                />
              </button>
              {isEditingNickname ? (
                <input
                  style={{
                    padding: "15px",
                    height: "50px",
                    width: "300px",
                    borderRadius: "10px",
                  }}
                  placeholder="닉네임을 변경하세요"
                  type="text"
                  value={newNickname}
                  onChange={onNicknameChange}
                  onBlur={onNicknameBlur}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      onNicknameSave();
                    }
                  }}
                  autoFocus
                />
              ) : (
                <p
                  style={{ margin: "0", cursor: "pointer" }}
                  onClick={onNicknameClick}
                >
                  {user.nickname}
                </p>
              )}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {isEditingStatusMessage ? (
              <input
                style={{
                  padding: "15px",
                  height: "50px",
                  width: "100%",
                  borderRadius: "10px",
                }}
                placeholder="상태 메시지를 변경하세요"
                type="text"
                value={newStatusMessage}
                onChange={onStatusMessageChange}
                onBlur={onStatusMessageBlur}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    onStatusMessageSave();
                  }
                }}
                autoFocus
              />
            ) : (
              <p
                style={{ margin: "0", cursor: "pointer" }}
                onClick={onStatusMessageClick}
              >
                {user.statusMessage || "상태 메시지를 입력하세요"}
              </p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ProfileModal;
