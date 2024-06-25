"use client";
import React from "react";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { login } from "@/app/store/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebase"; // Firestore 초기화
import { Dropdown } from "react-bootstrap";
import useSignOut from "./useSignOut";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sidebar: React.FC = () => {
  const handleSignOut = useSignOut();
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);

  const sidebarOpen = useSelector(
    (state: RootState) => state.container.sidebarOpen
  );

  const user = useSelector((state: RootState) => state.auth.user);

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
  return (
    <div
      className={`d-flex flex-column flex-shrink-0  p-3 bg-body-tertiary ${`sidebar ${
        sidebarOpen ? "show" : ""
      }`}`}
      style={{
        width: "200px",
        height: "100%",
        border: "1px solid black",
        boxSizing: "border-box",
      }}
    >
      <Dropdown>
        {" "}
        <div className="d-flex align-items-center">
          <Dropdown.Toggle
            variant="none"
            id="dropdown-basic"
            style={{ border: "none" }}
          >
            <img
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
          <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleSignOut}>Log Out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <hr />
      <ul className="nav nav-pills flex-column  p-0">
        <li className="nav-item">
          <a href="#" className="nav-link link-body-emphasis">
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#speedometer2" />
            </svg>
            대화방 만들기
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link link-body-emphasis">
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#table" />
            </svg>
            Orders
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link link-body-emphasis">
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#grid" />
            </svg>
            Products
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link link-body-emphasis">
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#people-circle" />
            </svg>
            Customers
          </a>
        </li>
      </ul>

      <hr />
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
