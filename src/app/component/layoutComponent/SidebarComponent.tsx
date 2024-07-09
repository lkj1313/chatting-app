import React from "react";
import { useEffect, useState, useRef } from "react";

import useSignOut from "./useSignOut";

import { openModal, closeModal, closeSidebar } from "@/app/store/uiSlice";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase"; // Firestore 초기화

import { login } from "@/app/store/authSlice";

import { getCookie } from "cookies-next";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";

import { Dropdown, Modal, Button } from "react-bootstrap";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateChatRoomModal from "./CreateChatRoomModal";

const Sidebar: React.FC = () => {
  const handleSignOut = useSignOut();
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState("");

  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
  // const showModal = useSelector((state: RootState) => state.ui.showModal);

  const user = useSelector((state: RootState) => state.auth.user);
  const changeProfileImgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true); // 클라이언트 사이드에서만 실행되도록 설정
  }, []);

  useEffect(() => {
    if (isClient) {
      const authToken = getCookie("authToken");
      console.log("Auth Token:", authToken); // 로그 추가
      if (authToken) {
        fetchUserData(authToken as string);
      }
    }
  }, [isClient]); // 종속성 배열에 isClient 추가

  const handleProfileClick = () => {
    // 프로필모달 열기함수

    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    // 프로필모달 닫기 함수
    setShowProfileModal(false);
  };
  const fetchUserData = async (token: string) => {
    try {
      console.log("Fetching UID with token:", token);
      const response = await fetch("/api/userdataget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }), // JSON.stringify로 올바르게 변환
      });

      console.log("Response status:", response.status); // 로그 추가

      if (response.ok) {
        const data = await response.json();
        const uid = data.uid;
        console.log("UID fetched:", uid); // 로그 추가

        // Firestore에서 추가적인 사용자 데이터 가져오기
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          dispatch(
            login({
              uid,
              email: userData?.email || null,
              nickname: userData?.nickname || null,
              profileImgURL: userData?.profileImg || null,
            })
          );
        } else {
          console.error("No such document!");
        }
      } else {
        console.error("Failed to fetch user data", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const handleOverlayClick = () => {
    dispatch(closeSidebar());
  };
  const closeModalClick = () => {
    dispatch(closeModal());
  };
  const handleImageClick = () => {
    if (changeProfileImgInputRef.current) {
      changeProfileImgInputRef.current.click();
    }
  };

  const handleFileChange = async (
    //프사변경 함수
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const newProfileImgURL = reader.result as string;

        // Redux 상태 업데이트
        dispatch(login({ ...user, profileImgURL: newProfileImgURL }));

        // Firestore에 이미지 URL 업데이트
        if (user.uid) {
          try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
              profileImg: newProfileImgURL,
            });
            console.log("Profile image updated successfully in Firestore");
          } catch (error) {
            console.error("Error updating profile image in Firestore:", error);
          }
        } else {
          console.error("User UID is null");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNicknameSave = async () => {
    //닉네임변경함수
    if (user.uid && newNickname) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          nickname: newNickname,
        });

        // Redux 상태 업데이트
        dispatch(login({ ...user, nickname: newNickname }));
        setIsEditingNickname(false);
      } catch (error) {
        console.error("Error updating nickname in Firestore:", error);
      }
    }
  };

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewNickname(event.target.value);
  };
  const handleNicknameBlur = () => {
    setIsEditingNickname(false);
  };
  const handleNicknameClick = () => {
    setIsEditingNickname(true);
  };
  return (
    <div>
      {sidebarOpen && ( //sidebar열릴시 배경 overlay
        <div
          className={`sidebarOverlay ${sidebarOpen ? "overlayShow" : ""}`}
          onClick={handleOverlayClick}
        ></div>
      )}

      <div //사이드바 div
        className={`d-flex flex-column flex-shrink-0 p-3  ${`sidebar ${
          sidebarOpen ? "show" : ""
        }`}`}
      >
        <Dropdown>
          {" "}
          <div className="d-flex align-items-center">
            <Dropdown.Toggle
              variant="none"
              id="dropdown-basic"
              style={{ border: "none" }}
            >
              <img //사이드바 프로필이미지
                src={`${user.profileImgURL}`}
                alt="profileImg"
                width="40"
                height="40"
                className="rounded-circle me-2"
              />
            </Dropdown.Toggle>
            <strong>{user.nickname}</strong>
          </div>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleProfileClick}>Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Log Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <hr />
        <ul className="nav nav-pills flex-column  p-0">
          <li className="nav-item">
            <button
              onClick={() => dispatch(openModal())}
              className="nav-link link-body-emphasis"
            >
              <svg className="bi pe-none me-2" width="16" height="16">
                <use xlinkHref="#speedometer2" />
              </svg>
              대화방 만들기
            </button>
          </li>
        </ul>
        <hr />
        <CreateChatRoomModal />
        <ToastContainer />{" "}
        <Modal show={showProfileModal} onHide={handleCloseProfileModal}>
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
                    onChange={handleFileChange}
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
                      src={`${user.profileImgURL}`}
                    ></img>
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
                      onChange={handleNicknameChange}
                      onBlur={handleNicknameBlur}
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          handleNicknameSave();
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <p
                      style={{ margin: "0", cursor: "pointer" }}
                      onClick={handleNicknameClick}
                    >
                      {user.nickname}
                    </p>
                  )}
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>프로필사진과 닉네임을 변경하세요!</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseProfileModal}>
                Close
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Sidebar;
