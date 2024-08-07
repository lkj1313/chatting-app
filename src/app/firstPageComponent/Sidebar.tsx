import React, { useState, useRef, useEffect } from "react";
import useSignOut from "./useSignOut";
import { openModal, closeModal, closeSidebar } from "@/app/store/uiSlice";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase"; // Firestore 초기화
import { login } from "@/app/store/authSlice";
import { getCookie } from "cookies-next";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { Dropdown, Modal, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import CreateChatRoomModal from "./CreateChatRoomModal";
import ProfileModal from "./ProfileModal";

const Sidebar: React.FC = () => {
  const handleSignOut = useSignOut();
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [isEditingStatusMessage, setIsEditingStatusMessage] = useState(false); // 상태 메시지 편집 상태
  const [newStatusMessage, setNewStatusMessage] = useState(""); // 새로운 상태 메시지
  const router = useRouter();

  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
  const user = useSelector((state: RootState) => state.auth.user);
  const changeProfileImgInputRef = useRef<HTMLInputElement>(null);
  const isAnimating = useRef(false); // 애니메이션 상태를 추적하는 ref

  // findChatRoomModal
  const [findChatRoomShow, setFindChatRoomShow] = useState(false);
  const handleCloseFindChatRoomModal = () => setFindChatRoomShow(false);
  const handleShowFindChatRoomModal = () => setFindChatRoomShow(true);

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
              statusMessage: userData?.statusMessage || null, // 상태 메시지 추가
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
    // 프사변경 함수
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
    // 닉네임변경함수
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

  const handleStatusMessageSave = async () => {
    // 상태 메시지 저장 함수
    if (user.uid && newStatusMessage) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          statusMessage: newStatusMessage,
        });

        // Redux 상태 업데이트
        dispatch(login({ ...user, statusMessage: newStatusMessage }));
        setIsEditingStatusMessage(false);
      } catch (error) {
        console.error("Error updating status message in Firestore:", error);
      }
    }
  };

  const handleStatusMessageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewStatusMessage(event.target.value);
  };

  const handleStatusMessageBlur = () => {
    setIsEditingStatusMessage(false);
  };

  const handleStatusMessageClick = () => {
    setIsEditingStatusMessage(true);
  };

  useEffect(() => {
    const sidebar = document.querySelector(".homeSidebar") as HTMLElement;

    const handleAnimationEnd = () => {
      isAnimating.current = false; // 애니메이션이 끝나면 false로 설정
    };

    if (sidebarOpen) {
      // 사이드바가 열렸을 때
      if (isAnimating.current) return; // 애니메이션 중이면 동작하지 않음
      isAnimating.current = true;
      sidebar.style.display = "flex";
      requestAnimationFrame(() => {
        sidebar.classList.add("homeSidebarShow");
        setTimeout(handleAnimationEnd, 500); // 애니메이션 지속 시간과 동일하게 설정
      });
    } else {
      // 사이드바가 닫혔을 때
      if (isAnimating.current) return; // 애니메이션 중이면 동작하지 않음
      isAnimating.current = true;
      sidebar.classList.remove("homeSidebarShow");
      setTimeout(() => {
        sidebar.style.display = "none";
        handleAnimationEnd(); // 애니메이션이 끝나면 false로 설정
      }, 500); // 애니메이션 지속 시간 후 display를 none으로 변경
    }
  }, [sidebarOpen]);

  return (
    <>
      {sidebarOpen && ( //sidebar열릴시 배경 overlay
        <div
          className={`sidebarOverlay ${sidebarOpen ? "overlayShow" : ""}`}
          onClick={handleOverlayClick}
        ></div>
      )}

      <div className={`homeSidebar ${sidebarOpen ? "show" : ""}`}>
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

        {/* ProfileModal 컴포넌트 사용 */}
        <ProfileModal
          show={showProfileModal}
          onClose={handleCloseProfileModal}
          user={user}
          newNickname={newNickname}
          isEditingNickname={isEditingNickname}
          newStatusMessage={newStatusMessage} // 새로운 상태 메시지
          isEditingStatusMessage={isEditingStatusMessage} // 상태 메시지 편집 상태
          onNicknameChange={handleNicknameChange}
          onNicknameSave={handleNicknameSave}
          onNicknameBlur={handleNicknameBlur}
          onNicknameClick={handleNicknameClick}
          onStatusMessageChange={handleStatusMessageChange} // 상태 메시지 변경 핸들러
          onStatusMessageSave={handleStatusMessageSave} // 상태 메시지 저장 핸들러
          onStatusMessageBlur={handleStatusMessageBlur} // 상태 메시지 블러 핸들러
          onStatusMessageClick={handleStatusMessageClick} // 상태 메시지 클릭 핸들러
          onImageChange={handleFileChange}
          onImageClick={handleImageClick}
        />
      </div>
    </>
  );
};

export default Sidebar;
